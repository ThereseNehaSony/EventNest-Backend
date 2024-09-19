import { Router } from "express";
//import { controllers } from "../../presentation/controllers";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { createCheckoutSessionController, verifySession } from "../../presentation/controllers/createCheckOutSesssion";
export const paymentRoutes = () => {
    const router = Router();



  router.post("/create-checkout-session",createCheckoutSessionController);
  router.get('/verify-payment/:sessionId', verifySession)


  return router;
};