import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { userRoutes } from "../infrastructure/routes/userRoutes";
import { dependencies } from "../config/dependencies";
import cors from 'cors'

import {  consumeUserCreated ,consumeHostStatusUpdate, consumeRefundMessages} from '../infrastructure/RabbitMQ/consumer'
import { requestUserList, } from "../infrastructure/RabbitMQ/publisher";
dotenv.config();
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3002;

app.set("trust proxy", true);

const corsOptions = {
  origin:'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/user", userRoutes(dependencies));


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const errorResponse = {
    errors: [{ message: err?.message || "Something went wrong" }],
  };
  return res.status(500).json(errorResponse);
});

app.listen(PORT, () => {
  console.log(`connected to user service at ${PORT}`);
  
  consumeUserCreated();
  // consumeHostStatusUpdate()
  consumeHostStatusUpdate('userServiceQueue');
  consumeRefundMessages('refund_queue')
  
});

export default app;