// import { model } from "mongoose";
// import { EventEntity } from "../../../../domain/entities/eventEntity";
// import mongoose from 'mongoose';

// const eventSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         // required: true,
//     },
//     category: {
//         type: String,
//         // required: true,
//     },
//     description: {
//         type: String,
//         // required: true,
//     },
//     host: {
//         type: String,
//     },
//     location: {
//         type: String,
//     },
//     image: {
//         type: String,
//         // required: true,
//     },
//     ticketType: {
//         type: String,
//         // required: true,
//     },
//     ticketFee: {
//         type: Number,
//         // required: true,
//     },
   
//     type: {
//         type: String,
//         enum: ['online','offline']
//     },
//     startDate: {
//         type: Date,
//     },
//     endDate: {
//         type: Date,
//     },
//     startTime: {
//         type: String,
//     },
//     endTime: {
//         type: String,
//     },
//     status: {
//         type: String,
//         default: "pending"
//     }
// },
// {
//     timestamps: true
// })

// export const Event = model<EventEntity>('event', eventSchema);

import mongoose, { Schema, model } from 'mongoose';
import { EventEntity } from '../../../../domain/entities/eventEntity';


const LocationSchema = new Schema({
  address1: { type: String, 
    // required: true
 },
  address2: { type: String },
  city: { type: String, 
    // required: true
 },
  state: { type: String,
    //  required: true 
    },
  pincode: { type: String,
    //  required: true
     },
  googleMapLink: { type: String }
}, { _id: false }); 


const TicketDetailsSchema = new Schema({
  type: { 
    type: String, 
   
    // required: true 
  },
  seats: { 
    type: Number, 
    // required: true 
  },
  price: { 
    type: Number 
  }
}, { _id: false }); 

const eventSchema = new Schema<EventEntity>({
  title: {
    type: String,
    // required: true,
  },
  category: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  host: {
    type: String,
    // required: true,
  },
  location: {
    type: LocationSchema,
    // required: true,
  },
  image: { 
    type: String, 
    // required: true 
  },
  ticketType: {
    type: String,
    // required: true,
  },
  ticketDetails: [TicketDetailsSchema], 
  type: {
    type: String,
    enum: ['online', 'offline'],
    // required: true,
  },
  startDate: {
    type: Date,
    // required: true,
  },
  endDate: {
    type: Date,
    // required: true,
  },
  startTime: {
    type: String,
    // required: true,
  },
  endTime: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  entryType: {
    type: String,
    enum: ['Paid', 'Free'],
    // required: true,
  },
  isPublished:{
    type:Boolean,
    default:false
  }
}, {
  timestamps: true,
});


export const Event = model<EventEntity>('Event', eventSchema);
