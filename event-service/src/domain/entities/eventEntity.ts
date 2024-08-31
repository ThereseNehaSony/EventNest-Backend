// import { ObjectId } from "mongoose";

// export interface EventEntity {
//     id?: ObjectId;
//     title: string;
//     category: string;
//     startDate: Date;
//     endDate:Date;
//     startTime: string;
//     endTime:string;
//     description: string;
//     host: string;
//     location: string;
//     images: string[];
//     ticketType: string;
//     ticketFee: number;
//     status: string;
//     type:string;
//   }

import { ObjectId } from "mongoose";


export interface TicketDetailEntity {
  type: 'Paid' | 'Free'; 
  seats: number;
  price?: number; 
}


export interface LocationEntity {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
  googleMapLink?: string;
}

export interface EventEntity {
  id?: ObjectId;
  title: string;
  category: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  description: string;
  host: string;
  location: LocationEntity;
  image: string;
  ticketType: string;
  ticketDetails: TicketDetailEntity[]; 
  status: string;
  type: 'online' | 'offline'; 
  entryType: 'Paid' | 'Free'; 
  isPublished: boolean;
   rejectionReason: string;
}
