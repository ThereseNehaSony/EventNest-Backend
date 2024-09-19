import mongoose, { Schema, model } from 'mongoose';
import { WalletEntity } from '../../../../domain/entities/walletEntity';

export const TransactionSchema = new Schema({
  id: { type: String, },
  amount: { type: Number,  },
  type: { type: String, enum: ['credit', 'debit'], },
  date: { type: Date, default: Date.now },
  
}, { _id: false });  

const WalletSchema = new Schema<WalletEntity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0, required: true },
  transactions: { type: [TransactionSchema], default: [] },
}, {
  timestamps: true, 
});

export const Wallet = model<WalletEntity>('Wallet', WalletSchema);
