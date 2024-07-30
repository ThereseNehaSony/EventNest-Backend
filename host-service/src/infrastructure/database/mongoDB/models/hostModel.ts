
// import mongoose from 'mongoose';



// const hostSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   phone:String,
//   aadharNo: String,
//   address:String,
//   BankAcc:String
// });

// const Host = mongoose.model('Host', hostSchema);

// export { Host };

// Assuming this is in your Host model file (hostModel.ts)
import mongoose, { Schema, Document } from 'mongoose';
import { UserEntity } from "../../../../domain/entities/userEntity";

// export interface IHost extends Document {
//   username: string;
//   email: String;
//   role:String;
//   status:String,
//   address?: string;
//   phone?: string;
//   aadharNumber?: string;
//   bankAccountNumber?: string;
//   // Other fields as needed
// }

const hostSchema: Schema<UserEntity> = new mongoose.Schema(
  {
  username: { type: String },
  email:{type:String},
  role:{type:String},
  address: { type: String },
  phone: { type: String },
  status:{type:String},
  aadharNumber: { type: String },
  bankAccountNumber: { type: String },

});

export const Host = mongoose.model<UserEntity>('Host', hostSchema);

