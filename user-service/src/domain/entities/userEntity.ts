import { ObjectId } from "mongoose";

export interface UserEntity {
    _id?: ObjectId,
    username: string;
    email: string;
    status: string;
    role: string;
    phone: string;
    address: string;
    

}


// import { ObjectId } from "mongoose";

// export interface UserEntity {
//   _id?: ObjectId;
//   username: string;
//   email: string;
//   status: string;
//   role: string;
//   phone: string;
//   address?: {
//     line1: string;
//     line2?: string;
//     city: string;
//     state: string;
//     pincode: string;
//     googleMapsLocation?: string;
//   };
// }
