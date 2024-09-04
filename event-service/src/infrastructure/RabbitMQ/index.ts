import amqp from 'amqplib';

export const initializeRabbitMQ = async () => {
  try {
    // Establish connection to RabbitMQ
    const connection = await amqp.connect('amqp://localhost');

    // Create a channel
    const channel = await connection.createChannel();

    // Ensure the channel is closed on process exit
    process.on('exit', () => {
      channel.close();
      console.log('RabbitMQ channel closed');
    });

    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    throw error;
  }
};
