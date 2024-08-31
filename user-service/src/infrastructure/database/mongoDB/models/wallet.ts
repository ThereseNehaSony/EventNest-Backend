import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction {
  transactionId: string;
  type: 'credit' | 'debit';
  amount: number;
  date: Date;
  description?: string;
}

export interface IWallet extends Document {
  userId: string;
  balance: number;
  transactions: ITransaction[];
}

const TransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
});

const WalletSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [TransactionSchema],
});

const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);

export default Wallet;
