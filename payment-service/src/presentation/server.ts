import express,{Application, NextFunction, Request, Response} from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { paymentRoutes } from "../infrastructure/routes/paymentRoutes";
//import { dependencies } from "../config/dependencies";
import cors from 'cors'

dotenv.config();
console.log("Stripe API Key:,,,,,,,,,", process.env.STRIPE_SECRET_KEY);

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3007

app.set("trust proxy", true);

const corsOptions = {
  origin:'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/payment", paymentRoutes());

app.use((
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err);
      const errorResponse = {
      errors: [{ message: err?.message || 'Something went wrong' }],
    };
    return res.status(500).json(errorResponse);
  })

  app.listen(PORT, () => { 
    console.log(`connected to payment service at ${PORT}`) 
}) 

export default app; 