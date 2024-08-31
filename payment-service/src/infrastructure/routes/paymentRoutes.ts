import { Router } from "express";
//import { controllers } from "../../presentation/controllers";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { createCheckoutSessionController } from "../../presentation/controllers/createCheckOutSesssion";
export const paymentRoutes = () => {
    const router = Router();



  router.post("/create-checkout-session",createCheckoutSessionController);
  router.get('/pay',(req,res)=>{
    console.log("paymmm")
    res.send('working')
})


  return router;
};