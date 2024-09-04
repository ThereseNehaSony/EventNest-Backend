// import { NextFunction, Request, Response } from "express";
// import { IDependencies } from "../../application/interfaces/IDependencies";
// import { verifyToken } from "../../utils/jwt/verifyToken";
// import Stripe from "stripe";

// // Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//     apiVersion: "2024-06-20",
// });

// export const createCheckoutSessionController = (
//   dependencies: IDependencies
// ) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     console.log('dsdsdsd');
    
//     try {
//         console.log("entered....");
        
//       const { items } = req.body;

//       if (!items || items.length === 0) {
//         return res.status(400).json({ message: "No items provided" });
//       }

//       // Create the checkout session
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: items.map((item: any) => ({
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: item.name,
//             },
//             unit_amount: item.amount * 100, // Stripe expects the amount in cents
//           },
//           quantity: item.quantity,
//         })),
//         mode: "payment",
//         success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//       });

//       // Send session ID to the client
//       res.status(200).json({ id: session.id });
//     } catch (error) {
//       console.error("Error creating checkout session", error);
//       next(error);
//     }
//   };
// };

import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";

// Log the Stripe API Key for debugging

console.log("Stripe API Key at Initialization:", process.env.STRIPE_SECRET_KEY);
// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export const createCheckoutSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Entered createCheckoutSessionController");
  console.log("Stripe API Key at Controller:", process.env.STRIPE_SECRET_KEY);
  try {
    // Log the items received in the request
    console.log("Request Body Items:", req.body.items);

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount * 100, 
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    // Send session ID to the client
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session", error);
    next(error);
  }
};
