import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {adminRoutes} from "../infrastructure/routes/adminRoutes";
import cors from 'cors'
// import {  consumeUserListResponse } from '../infrastructure/RabbitMQ/consumer'
// import { requestUserList } from "../infrastructure/RabbitMQ/publisher";
import path from 'path';
import { dependencies } from "../config/dependencies";
dotenv.config();
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3003;

app.set("trust proxy", true);

const corsOptions = {
  origin:'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] 
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/event", adminRoutes(dependencies));


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const errorResponse = {
    errors: [{ message: err?.message || "Something went wrong" }],
  };
  return res.status(500).json(errorResponse);
});

app.listen(PORT, () => {
  console.log(`connected to event service at ${PORT}`);
  // requestUserList()
  // consumeUserListResponse();
});

export default app;