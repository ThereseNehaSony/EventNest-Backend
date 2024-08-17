import mongoose, { Schema, model } from "mongoose";
import { UserEntity } from "../../../../domain/entities/userEntity";

const AddressSchema: Schema = new mongoose.Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    googleMapsLocation: { type: String },
  },
  { _id: false } // Disables the creation of an _id field for the subschema
);


const UserSchema: Schema<UserEntity> = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String },
    status: { type: String },
    phone: { type: String },
    address: { type: String}// Include the AddressSchema here
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<UserEntity>("users", UserSchema);
