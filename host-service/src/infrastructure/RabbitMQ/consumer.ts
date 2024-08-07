import { connect, Connection, Channel, Message } from 'amqplib/callback_api';
import { Host } from '../database/mongoDB/models/hostModel';

const rabbitMQUrl = 'amqp://localhost';


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

       
        const exchange = 'host_events';

        channel.assertExchange(exchange, 'fanout', {
          durable: false,
        });

        
        channel.assertQueue('', {
          exclusive: true,
        }, (error2, q) => {
          if (error2) {
            connection.close();
            reject(error2);
            return;
          }

          
          channel.bindQueue(q.queue, exchange, '');

          console.log(`[*] Waiting for host created messages in ${q.queue}. `);

          // Consume message
          channel.consume(q.queue, async (msg: Message | null) => {
            console.log("haiii");
            
            try {
              if (msg?.content) {
                const hostDetails = JSON.parse(msg.content.toString());
                console.log(`[x] Received host created message:`, hostDetails);

                //save to db
                const newHost = new Host(hostDetails);
                await newHost.save();
                console.log(`[x] Saved host details to MongoDB`);

                
                channel.ack(msg);
              }
            } catch (error) {
              console.error(`Error processing host created message:`, error);
              
              channel.nack(msg!, false, false);
            }
          }, {
            noAck: false,
          });

          resolve(); 
        });
      });
    });
  });
};
