import amqplib from 'amqplib';
import { User } from '../database/mongoDB/models/userModel';

const RABBITMQ_URL = 'amqp://127.0.0.1:5672';
// export const consumeUserListResponse = async () => {
//   const connection = await amqplib.connect(RABBITMQ_URL);
//   const channel = await connection.createChannel();
//   const responseQueue = 'user_list_response';

//   await channel.assertQueue(responseQueue, { durable: false });

//   channel.consume(responseQueue, async (msg) => {
//     if (msg !== null) {
//       const users = JSON.parse(msg.content.toString());
//       console.log('Received user list:');
 
    
//           //saving users to db
//           const uniqueUsers = [];
//           for (const user of users) {
//           const existingUser = await User.findOne({ email: user.email });
//           if (!existingUser) {
//           uniqueUsers.push(user);
//   }
// }

// // only unique users to db
// await User.insertMany(uniqueUsers);
//       channel.ack(msg);
//     }
//   });
// };

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
          // Update user details in the database
          const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true, upsert: true });
          console.log('User updated:', updatedUser);
        } catch (error) {
          console.error('Error updating user:', error);
        }
      }
    }, { noAck: true });
  } catch (error) {
    console.error('Error setting up RabbitMQ consumer:', error);
  }
};




export const consumeHostStatusUpdate = async () => {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = 'hostStatusUpdate';

  await channel.assertQueue(queue, { durable: true });

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
