import { Wallet } from "../../infrastructure/database/mongoDB/models/wallet";
import { NextFunction, Request, Response } from "express";
import { publishEvent } from "../../infrastructure/RabbitMQ/publisher";

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit'; 
  date: Date;
  
}

export const walletPayment = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, totalAmount, eventId } = req.body;


  try {
      
      const wallet = await Wallet.findOne({ userId });
  
      if (!wallet) {
          return res.status(404).json({ success: false, message: 'Wallet not found' });
      }

     
      if (wallet.balance < totalAmount) {
          return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

    
      wallet.balance -= totalAmount;
      console.log("paid...")
     
      const transaction: Transaction = {
          id: new Date().toISOString(), 
          type: 'debit',
          date: new Date(),
          amount: totalAmount,
         
      };
     console.log(transaction,"trans...")
      
      wallet.transactions.push(transaction);

     
      await wallet.save();

     
      await publishEvent('payment_exchange', 'payment.successful', { userId, totalAmount, eventId });

      
      res.status(200).json({ success: true, message: 'Payment successful' });

      
  } catch (error) {
      
      next(error);  
  }
};
export const getWallet = async (req:Request, res:Response) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    console.log(wallet,"wallet....")
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: 'Server error',  });
  }
};