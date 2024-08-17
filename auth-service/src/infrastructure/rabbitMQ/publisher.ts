import amqp from 'amqplib/callback_api';

const RABBITMQ_URL = 'amqp://127.0.0.1:5672';

export const publishUserCreated = (user: any) => {
  amqp.connect(RABBITMQ_URL, (error0, connection) => {
    console.log('rabbit connecteddd......')
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      const exchange = 'user_exchange';
      const routingKey = 'user.created';

      channel.assertExchange(exchange, 'topic', {
        durable: false
      });
      console.log("publishing user.........")
      channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(user)));
      
    });
  });
};


export const publishHostCreated = (hostDetails: any) => {
  amqp.connect(RABBITMQ_URL, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const exchange = 'host_events';

      channel.assertExchange(exchange, 'fanout', {
        durable: false,
      });

      const message = JSON.stringify(hostDetails);

      // Publish message 
      channel.publish(exchange, '', Buffer.from(message));
      console.log(`[x] Sent host created message: ${message}`);

      setTimeout(() => {
        connection.close();
      }, 500);
    });
  });
};