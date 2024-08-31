import mongoose, { Schema, model } from 'mongoose';
import { EventEntity } from '../../../../domain/entities/eventEntity';


const LocationSchema = new Schema({
  address1: { type: String, 
   
 },
  address2: { type: String },
  city: { type: String, 
   
 },
  state: { type: String,
   
    },
  pincode: { type: String,
    
     },
  googleMapLink: { type: String }
}, { _id: false }); 


const TicketDetailsSchema = new Schema({
  type: { 
    type: String, 
  },
  seats: { 
    type: Number, 
     
  },
  price: { 
    type: Number 
  }
}, { _id: false }); 

const eventSchema = new Schema<EventEntity>({
  title: {
    type: String,
    
  },
  category: {
    type: String,
    
  },
  description: {
    type: String,
   
  },
  host: {
    type: String,
   
  },
  location: {
    type: LocationSchema,
    
  },
  image: { 
    type: String, 
     
  },
  ticketType: {
    type: String,
    
  },
  ticketDetails: [TicketDetailsSchema], 
  type: {
    type: String,
    enum: ['online', 'offline'],
    
  },
  startDate: {
    type: Date,
    
  },
  endDate: {
    type: Date,
    
  },
  startTime: {
    type: String,
    
  },
  endTime: {
    type: String,
    
  },
  status: {
    type: String,
    default: "pending",
  },
  entryType: {
    type: String,
    enum: ['Paid', 'Free'],
   
  },
  isPublished:{
    type:Boolean,
    default:false
  },
  rejectionReason: {
    type: String,
    default: null,  
  },
}, {
  timestamps: true,
});


export const Event = model<EventEntity>('Event', eventSchema);
