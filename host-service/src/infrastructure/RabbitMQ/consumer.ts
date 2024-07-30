import { connect, Connection, Channel, Message } from 'amqplib/callback_api';
import { Host } from '../database/mongoDB/models/hostModel'; // Adjust the import path as per your file structure

// RabbitMQ connection URL
const rabbitMQUrl = 'amqp://localhost';

// Function to consume host created events
export const consumeHostCreated = () => {
  return new Promise<void>((resolve, reject) => {
    connect(rabbitMQUrl, (error0, connection: Connection) => {
      if (error0) {
        reject(error0);
        return;
      }
      
      connection.createChannel((error1, channel: Channel) => {
        if (error1) {
          connection.close();
          reject(error1);
          return;
        }

        // Name of the exchange
        const exchange = 'host_events';

        // Declare the exchange
        channel.assertExchange(exchange, 'fanout', {
          durable: false,
        });

        // Declare a queue with a random name (exclusive queue)
        channel.assertQueue('', {
          exclusive: true,
        }, (error2, q) => {
          if (error2) {
            connection.close();
            reject(error2);
            return;
          }

          // Bind the queue to the exchange
          channel.bindQueue(q.queue, exchange, '');

          console.log(`[*] Waiting for host created messages in ${q.queue}. `);

          // Consume messages from the queue
          channel.consume(q.queue, async (msg: Message | null) => {
            console.log("haiii");
            
            try {
              if (msg?.content) {
                const hostDetails = JSON.parse(msg.content.toString());
                console.log(`[x] Received host created message:`, hostDetails);

                // Save host details to MongoDB
                const newHost = new Host(hostDetails);
                await newHost.save();
                console.log(`[x] Saved host details to MongoDB`);

                // Acknowledge the message
                channel.ack(msg);
              }
            } catch (error) {
              console.error(`Error processing host created message:`, error);
              // Reject message if an error occurs
              channel.nack(msg!, false, false);
            }
          }, {
            noAck: false,
          });

          resolve(); // Resolve the promise once consumer is set up
        });
      });
    });
  });
};
