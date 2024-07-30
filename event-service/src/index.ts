import server from './presentation/server'
import dbConnection from './infrastructure/database/DbConnection';
//import { runConsumer } from './infrastructure/kafka/consumer';
//  test
(async() => {
    try {
        server;
        await dbConnection()
        .catch((error: any) => {
            console.log(error?.message);
            process.exit();
        })
        //await runConsumer()
      .then(() => console.log("Running"))
      .catch((error) => {
        console.error(`Error while initializing rabbitmq consumer: ${error}`);
        process.exit();
      });
    } catch (error: any) {
        console.log(error?.message)
    }
})();