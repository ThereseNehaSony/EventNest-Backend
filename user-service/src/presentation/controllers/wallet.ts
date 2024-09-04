import { Wallet } from "../../infrastructure/database/mongoDB/models/wallet";
import { NextFunction, Request, Response } from "express";
import { publishEvent } from "../../infrastructure/RabbitMQ/publisher";

export const walletPayment = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, totalAmount, eventId } = req.body;
 console.log("wallet")
 console.log(req.body,"body...");
 ;
 
  try {
    // Find the wallet associated with the user
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    // Check if the wallet has enough balance
    if (wallet.balance < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Deduct the total amount from the wallet
    wallet.balance -= totalAmount;
    await wallet.save();


    await publishEvent('payment_exchange', 'payment.successful', { userId, totalAmount, eventId });

    // Respond with a success message
    res.status(200).json({ success: true, message: 'Payment successful' });

    // Further processing can be done here if needed, such as booking confirmation
  } catch (error) {
    // Handle server errors
   // res.status(500).json({ success: false, message: 'Server error', error: error.message });
    next(error);  // Optionally pass the error to next middleware
  }
};
