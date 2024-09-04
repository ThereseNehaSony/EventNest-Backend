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


export const publishUserBlockedEvent = async (userId: string, operation: 'block' | 'unblock') => {
  const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = 'user_blocked_event';

  const message = JSON.stringify({
    userId,
    operation,
  });

  await channel.assertQueue(queue, { durable: false });
  await channel.sendToQueue(queue, Buffer.from(message));

  console.log(`Message sent to queue: ${message}`);

  await channel.close();
  await connection.close();
};


export const publishEvent = async (exchange: string, routingKey: string, message: any) => {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
 // const queue = 'user_blocked_event';
    
    await channel.assertExchange(exchange, 'direct', { durable: true });
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    
    console.log('Event published:', routingKey);
  } catch (error) {
    console.error('Failed to publish event', error);
  }
};