// import amqp from 'amqplib/callback_api';

// export const consumeUserCreated = (processUser: (user: any) => void) => {
//   amqp.connect('amqp://localhost', (error0, connection) => {
//     if (error0) {
//       throw error0;
//     }
//     connection.createChannel((error1, channel) => {
//       if (error1) {
//         throw error1;
//       }
//       const exchange = 'user_exchange';
//       const queue = 'user_created_queue';
//       const routingKey = 'user.created';

//       channel.assertExchange(exchange, 'topic', {
//         durable: false
//       });

//       channel.assertQueue(queue, {
//         exclusive: false
//       }, (error2, q) => {
//         if (error2) {
//           throw error2;
//         }
//         console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue);

//         channel.bindQueue(q.queue, exchange, routingKey);

//         channel.consume(q.queue, (msg) => {
//           if (msg.content) {
//             const user = JSON.parse(msg.content.toString());
//             console.log(`Received user data: ${msg.content.toString()}`);
//             processUser(user);
//           }
//         }, {
//           noAck: true
//         });
//       });
//     });
//   });
// };


// src/infrastructure/rabbitMQ/consumer.ts
import amqplib from 'amqplib';
import { User } from '../database/mongoDB/models/userModel';
//const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const RABBITMQ_URL = 'amqp://127.0.0.1:5672';
export const consumeUserListResponse = async () => {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const responseQueue = 'user_list_response';

  await channel.assertQueue(responseQueue, { durable: false });

  channel.consume(responseQueue, async (msg) => {
    if (msg !== null) {
      const users = JSON.parse(msg.content.toString());
      console.log('Received user list:', users);
 
    
          //saving users to db
          const uniqueUsers = [];
          for (const user of users) {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
          uniqueUsers.push(user);
  }
}

// Insert only unique users into the database
await User.insertMany(uniqueUsers);
      channel.ack(msg);
    }
  });
};
