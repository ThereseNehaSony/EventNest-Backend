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
  const { userId, totalAmount, eventId,ticketType,quantity,userName } = req.body;


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
    
      
      wallet.transactions.push(transaction);

     
      await wallet.save();

     
      await publishEvent('payment_exchange', 'payment.successful', { userId, totalAmount, eventId ,ticketType,quantity,userName});

      
      res.status(200).json({ success: true, message: 'Payment successful' });

      
  } catch (error) {
      
      next(error);  
  }
};
export const getWallet = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const totalTransactions = wallet.transactions.length;

    // Sort transactions by date (latest first) and paginate
    const transactions = wallet.transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Latest first
      .slice((page - 1) * limit, page * limit); // Pagination logic

    res.json({
      balance: wallet.balance,
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const processRefund = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;

  try {
   
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found for this user' });
    }

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid refund amount' });
    }

    
    wallet.balance += amount; 

    
    const transaction: Transaction = {
      id: new Date().toISOString(), 
      type: 'credit',
      date: new Date(),
      amount: amount,
     
  };
 
  
  wallet.transactions.push(transaction);
    await wallet.save();

    return res.status(200).json({ success: true, message: 'Refund processed successfully', balance: wallet.balance });
  } catch (error) {
    console.error('Error processing refund:', error);
    return res.status(500).json({ success: false, message: 'Error processing refund' });
  }
};