import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();




const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!.trim());
    console.log("🍃🍃🍃 Database connected with MongoDB 🍃🍃🍃");
  } catch (error: any) {
    console.error("🍁🍁🍁 Database Connection failed 🍁🍁🍁");
    console.error(error.message);
    process.exit(1);
  }
};

export default dbConnection;