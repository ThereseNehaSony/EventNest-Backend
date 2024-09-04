import mongoose, { Schema, model } from 'mongoose';
import { WalletEntity } from '../../../../domain/entities/walletEntity';

const TransactionSchema = new Schema({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  date: { type: Date, default: Date.now, required: true },
  description: { type: String, required: true },
}, { _id: false });  

const WalletSchema = new Schema<WalletEntity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0, required: true },
  transactions: { type: [TransactionSchema], default: [] },
}, {
  timestamps: true, 
});

export const Wallet = model<WalletEntity>('Wallet', WalletSchema);
