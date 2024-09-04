
import mongoose from 'mongoose';

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  date: Date;

}

export interface WalletEntity extends mongoose.Document {
  userId:  mongoose.Types.ObjectId; 
  balance: number;
  transactions: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}
