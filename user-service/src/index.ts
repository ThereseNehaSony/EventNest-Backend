import server from './presentation/server'
import dbConnection from './infrastructure/database/DbConnection';

(async() => {
    try {
        server;
        await dbConnection()
        .catch((error: any) => {
            console.log(error?.message);
            process.exit();
        })
        
      .then(() => console.log("Running"))
      .catch((error) => {
        console.error(`Error while initializing rabbitmq consumer: ${error}`);
        process.exit();
      });
    } catch (error: any) {
        console.log(error?.message)
    }
})();