import amqplib from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://127.0.0.1:5672';

// export const publishToQueue = async (queue: string, message: any) => {
//   try {
//     const connection = await amqplib.connect(RABBITMQ_URL);
//     const channel = await connection.createChannel();

//     await channel.assertQueue(queue, { durable: true });
//     await channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

//     console.log('Message sent to queue:', message);

//     await channel.close();
//     await connection.close();
//   } catch (error) {
//     console.error('Error in publishing to queue:', error);
//   }
// };


export const publishToQueue = async (exchange: string, message: any) => {
  try {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'fanout', { durable: true });
    await channel.publish(exchange, '', Buffer.from(message), { persistent: true });

    console.log('Message sent to exchange:', message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error in publishing to exchange:', error);
  }
};
