import mongoose, { Schema, model } from "mongoose";
import { IUserEntity } from "../../../../domain/entities/userEntities";

const UserSchema: Schema<IUserEntity> = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    role:{type:String},
    status:{type: String},
    phone:{type:String}
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUserEntity>("users", UserSchema);