import { initializeRabbitMQ } from "./index";


export const consumeEvent = async (exchange: string, queue: string, routingKey: string, handleMessage: (message: any) => void) => {
    try {
      const channel = await initializeRabbitMQ();
      
      await channel.assertExchange(exchange, 'direct', { durable: true });
      await channel.assertQueue(queue, { durable: true });
      await channel.bindQueue(queue, exchange, routingKey);
      
      channel.consume(queue, (msg:any) => {
        if (msg) {
          const message = JSON.parse(msg.content.toString());
          handleMessage(message);
          channel.ack(msg);
        }
      });
  
      console.log('Event consumption started for:', queue);
    } catch (error) {
      console.error('Failed to consume event', error);
    }
  };

