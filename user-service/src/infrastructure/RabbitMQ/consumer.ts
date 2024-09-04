import amqplib from 'amqplib';
import { User } from '../database/mongoDB/models/userModel';
import { Wallet } from '../database/mongoDB/models/wallet';

const RABBITMQ_URL = 'amqp://127.0.0.1:5672';


export const consumeUserCreated = async () => {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchange = 'user_exchange';
    const routingKey = 'user.created';

    await channel.assertExchange(exchange, 'topic', { durable: false });
    const { queue } = await channel.assertQueue('', { exclusive: true });

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

    await channel.bindQueue(queue, exchange, routingKey);

    channel.consume(queue, async (msg) => {
      if (msg && msg.content) {
        const user = JSON.parse(msg.content.toString());
        console.log(' [x] Received %s', user);

        try {
          
          const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true, upsert: true });
          console.log('User updated:', updatedUser);

          const wallet = new Wallet({
            userId: updatedUser._id,
            balance: 0,  
            transactions: [], 
          });
          
          await wallet.save();
          console.log('Wallet created for user:', updatedUser._id);

        } catch (error) {
          console.error('Error updating user:', error);
        }
      }
    }, { noAck: true });
  } catch (error) {
    console.error('Error setting up RabbitMQ consumer:', error);
  }
};




// export const consumeHostStatusUpdate = async () => {
//   const connection = await amqplib.connect(RABBITMQ_URL);
//   const channel = await connection.createChannel();
//   const queue = 'hostStatusUpdate';

//   await channel.assertQueue(queue, { durable: true });

//   channel.consume(queue, async (msg) => {
//     if (msg !== null) {
//       const { userId, status } = JSON.parse(msg.content.toString());
      
//       try {
//         await User.findByIdAndUpdate(userId, { status: status });
//         console.log(`User status updated for userId: ${userId}`);
//         channel.ack(msg);
//       } catch (error) {
//         console.error('Error updating user status:', error);
//         channel.nack(msg);
//       }
//     }
//   });
// };

export const consumeHostStatusUpdate = async (queue: string) => {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const exchange = 'hostStatusExchange';

  await channel.assertExchange(exchange, 'fanout', { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, '');

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { userId, status } = JSON.parse(msg.content.toString());
      
      try {
        await User.findByIdAndUpdate(userId, { status: status });
        console.log(`User status updated for userId: ${userId}`);

        channel.ack(msg);
      } catch (error) {
        console.error('Error updating user status:', error);
        channel.nack(msg);
      }
    }
  });
};
