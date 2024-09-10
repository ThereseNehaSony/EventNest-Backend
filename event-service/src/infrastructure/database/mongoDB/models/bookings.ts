// import mongoose, { Schema, Document } from 'mongoose';

// export interface IBooking extends Document {
//   // userName: string;
//   userId: string,
//   // eventName: string;
//   ticketType?: string; // Optional for free events
//   quantity?: number;   // Optional for free events
//   amountPaid?: number; // Optional for free events
//   bookingDate: Date;
//   status: 'confirmed' | 'cancelled';
// }

// const BookingSchema: Schema = new Schema({
//   // userId:{type:String},
//   userName: { type: String, required: false },
//   eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
//   ticketType: { type: String, required: false }, // Optional
//   quantity: { type: Number, required: false },   // Optional
//   amountPaid: { type: Number, required: false }, // Optional
//   bookingDate: { type: Date, default: Date.now },
//   status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
// });

// const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

// export default Booking;


import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userName: string; 
  //// Assuming userId should be used instead of userName
  eventId: mongoose.Types.ObjectId; // Reference to the Event
  ticketType?: string;
  quantity?: number;
  amountPaid?: number;
  bookingDate: Date;
  paymentType: string;
  status: 'confirmed' | 'cancelled';
}

const BookingSchema: Schema = new Schema({
  userName: { type: String, required: false },

  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: false },
  ticketType: { type: String, required: false },
  quantity: { type: Number, required: false },
  amountPaid: { type: Number, required: false },
  bookingDate: { type: Date, default: Date.now },
  paymentType:{type:String},
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
});

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
