// import server from './presentation/server'
// import{consumeHostCreated } from './infrastructure/RabbitMQ/consumer'
// import dbConnection from './infrastructure/database/DbConnection';
// //import { runConsumer } from './infrastructure/kafka/consumer';
// //  test

// (async() => {
//     try {
//         server;
//         await dbConnection()
//         .catch((error: any) => {
//             console.log(error?.message);
//             process.exit();
//         })
//         await consumeHostCreated ()
//       .then(() => console.log("Running"))
//       .catch((error) => {
//         console.error(`Error while initializing rabbitmq consumer: ${error}`);
//         process.exit();
//       });
//     } catch (error: any) {
//         console.log(error?.message)
//     }
// })();

import server from './presentation/server';
import { consumeHostCreated } from './infrastructure/RabbitMQ/consumer';
import dbConnection from './infrastructure/database/DbConnection';

(async () => {
  try {
    // Start your server
    server;

    // Connect to the database
    await dbConnection().catch((error: any) => {
      console.log(`Database connection error: ${error.message}`);
      process.exit(1); // Exit process on database connection error
    });

    // Start consuming host created events from RabbitMQ
    await consumeHostCreated().then(() => {
      console.log("RabbitMQ consumer initialized successfully");
    }).catch((error) => {
      console.error(`Error while initializing RabbitMQ consumer: ${error}`);
      process.exit(1); // Exit process on RabbitMQ consumer initialization error
    });

    console.log("Server, database, and RabbitMQ consumer are running.");

  } catch (error) {
    console.error(`Error during initialization:`);
    process.exit(1); // Exit process on any unhandled error during initialization
  }
})();
