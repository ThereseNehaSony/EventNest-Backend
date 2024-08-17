
import server from './presentation/server';
import { consumeHostCreated } from './infrastructure/RabbitMQ/consumer';
import dbConnection from './infrastructure/database/DbConnection';

(async () => {
  try {
   
    server;

    
    await dbConnection().catch((error: any) => {
      console.log(`Database connection error: ${error.message}`);
      process.exit(1); 
    });

    
    await consumeHostCreated().then(() => {
      console.log("RabbitMQ consumer initialized successfully");
    }).catch((error) => {
      console.error(`Error while initializing RabbitMQ consumer: ${error}`);
      process.exit(1); 
    });

    console.log("Server, database, and RabbitMQ consumer are running.");

  } catch (error) {
    console.error(`Error during initialization:`);
    process.exit(1); 
  }
})();
