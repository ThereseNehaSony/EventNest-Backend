import mongoose, { Schema, model } from "mongoose";
import { UserEntity } from "../../../../domain/entities/userEntity";

const UserSchema: Schema<UserEntity> = new mongoose.Schema(
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

export const User = mongoose.model<UserEntity>("users", UserSchema);