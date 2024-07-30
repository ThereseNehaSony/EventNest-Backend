import { ObjectId } from "mongoose";

export interface UserEntity {
    _id?: ObjectId,
    username: string;
    email: string;
    status: string;
    role: string;
    phone: string;
    address:string,
    aadharNumber:string,
    bankAccountNumber:string
}