import amqplib from 'amqplib';

//const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const RABBITMQ_URL = 'amqp://127.0.0.1:5672';
export const requestUserList = async () => {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const requestQueue = 'user_list_request';

  await channel.assertQueue(requestQueue, { durable: false });
  console.log('Sending request for user list to RabbitMQ');
  channel.sendToQueue(requestQueue, Buffer.from('Requesting user list'));

  setTimeout(() => {
    connection.close();
  }, 500);
};

export const publishUserBlockedEvent = async (userId:any) => {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const userBlockedQueue = 'user_blocked_event';

  await channel.assertQueue(userBlockedQueue, { durable: false });
  console.log('Publishing user blocked event');

  const event = { userId };
  channel.sendToQueue(userBlockedQueue, Buffer.from(JSON.stringify(event)));

  setTimeout(() => {
    connection.close();
  }, 500);
};


