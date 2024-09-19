import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export const createCheckoutSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  try {
  

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Create checkout 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: (item.amount * 100) + 50, 
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    // Send session id 
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session", error);
    next(error);
  }
};







export const verifySession = async (req: Request, res: Response) => {
    const { sessionId } = req.params; 
  console.log(req.params, "Received URL Parameters"); 

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId as string);

    if (session.payment_status === 'paid') {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({ success: false });
  }
};




// export const verifyPaymentController = async (req: Request, res: Response) => {
//   const { session_id } = req.query;

//   if (!session_id) {
//     return res.status(400).json({ error: 'Session ID is required' });
//   }

//   try {
//     const session = await stripe.checkout.sessions.retrieve(session_id as string);

//     if (session.payment_status === 'paid') {
//       // Assuming metadata includes eventId, userId, totalAmount, tickets, etc.
//       const bookingData = session.metadata;

//       // Process the booking
//       await saveBooking({
//         eventId: bookingData.eventId,
//         userId: bookingData.userId,
//         totalAmount: bookingData.totalAmount,
//         tickets: JSON.parse(bookingData.tickets),
//       });

//       return res.status(200).json({ success: true, message: 'Payment successful, booking created' });
//     } else {
//       return res.status(400).json({ success: false, message: 'Payment not completed' });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
