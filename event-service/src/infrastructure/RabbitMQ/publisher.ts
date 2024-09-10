import amqplib from 'amqplib';


const RABBITMQ_URL = 'amqp://127.0.0.1:5672';
const QUEUE_NAME = 'refundQueue'; 
export const sendRefundMessage = async (message: { userName: string, amount: number }) => {
  try {
    // Create a connection to RabbitMQ
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Send message to RabbitMQ queue
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });
   
    // Close connection
    await channel.close();
    await connection.close();

  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
    throw error; 
  }
};
