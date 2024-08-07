
import amqplib from 'amqplib';
import { User } from '../database/mongoDB/models/loginCredentials'; 

const RABBITMQ_URL = 'amqp://127.0.0.1:5672';

export const consumeUserListRequest = async () => {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const requestQueue = 'user_list_request';
  const responseQueue = 'user_list_response';

  await channel.assertQueue(requestQueue, { durable: false });
  await channel.assertQueue(responseQueue, { durable: false });

  channel.consume(requestQueue, async (msg) => {
    if (msg !== null) {
      console.log('Received user list request');
      const users = await User.find();
      
      channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(users)));
      channel.ack(msg);
    }
  });
};

export const listenForUserBlockedEvents = async () => {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const userBlockedQueue = 'user_blocked_event';

  await channel.assertQueue(userBlockedQueue, { durable: false });
  console.log('Listening for user blocked events');

  channel.consume(userBlockedQueue, async (msg) => {
    if (msg !== null) {
      const event = JSON.parse(msg.content.toString());
      console.log('Received user blocked event:', event);

      
      if (event.operation === 'block') {
        await blockUserInAuthDB(event.userId, 'blocked');
      } else if (event.operation === 'unblock') {
        await blockUserInAuthDB(event.userId, 'active'); 
      }

      channel.ack(msg);
    }
  });
};

const blockUserInAuthDB = async (userId: string, status: 'blocked' | 'active') => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log(`User with ID: ${userId} not found`);
      return;
    }

    user.status = status;
    await user.save();
    console.log(`Updated user with ID: ${userId} to status ${status} in Auth Service DB`);
  } catch (error) {
    console.error(`Error updating user with ID: ${userId}`, error);
  }
};