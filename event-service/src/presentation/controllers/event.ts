import { Request, Response,NextFunction } from 'express';
import { Event} from '../../infrastructure/database/mongoDB/models/event';
import { HttpStatusCode } from '../../utils/statusCodes/httpStatusCode';
import Booking from '../../infrastructure/database/mongoDB/models/bookings'
import { log } from 'winston';
import { Document } from 'mongoose';
import { consumeEvent } from '../../infrastructure/RabbitMQ/consumer';
import { sendRefundMessage } from '../../infrastructure/RabbitMQ/publisher';
import axios from 'axios';

const USER_SERVICE_URL = 'http://localhost:3002'

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}
interface IEvent {
  eventName: string;
  startDate: string;
  startTime: string;
  location: string;
  imageUrl: string;
}

// Booking interface
interface IBooking extends Document {
  userName: string;
  eventId: IEvent; // Assuming eventId references an Event document
  status: string;
  bookingDate: Date;
}
export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    

    const event = await Event.findById(eventId);
    console.log(event, "event fouind...........................");


    const bookings = await Booking.find({ eventId: eventId });

    // Calculate metrics
    const attendeesCount = bookings.length;
    if (!event) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found' });
    }
    const totalAmountReceived = bookings.reduce((sum, booking) => sum + (booking.amountPaid || 0), 0);

    res.status(HttpStatusCode.OK).json({event,attendeesCount,totalAmountReceived});
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const updateEventStatus = async (req: Request, res: Response) => {
  try {
    const { eventId, action } = req.params;
    console.log(req.params,"params....")
    const reason = req.body.rejectionReason;
    console.log(reason,'reason...');
    console.log("entered............")

    if (!['approve', 'reject'].includes(action.toLowerCase())) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Invalid action.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found.' });
    }
//console.log("event",event);

    event.status = action === 'approve' ? 'approved' : 'rejected';
    console.log(event.status,"status....")
    if (action === 'reject') {
      event.rejectionReason = reason; 
    }
    const savedEvent = await event.save();
    
    res.status(HttpStatusCode.OK).json({ message: `Event ${action}d successfully.` });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.' });
  }
};

export const publishEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found' });
    }

    event.isPublished = true;
    await event.save();

    return res.status(HttpStatusCode.OK).json({ message: 'Event published successfully' });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.' });
  }
};
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;
  const eventData = req.body;
console.log("editing")
console.log(eventId);

  try {
   
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found' });
      return;
    }

   
    if (event.isPublished || event.status !== 'pending') {
      res.status(HttpStatusCode.FORBIDDEN).json({ message: 'Event cannot be edited' });
      return;
    }

    
    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });

    if (!updatedEvent) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Failed to update event' });
      return;
    }

    res.status(HttpStatusCode.OK).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};

export const bookEvent = async (req: Request, res: Response) => {
  try {
    const { eventId, eventName,userId, eventDateTime, userName, ticketQuantities, totalPrice } = req.body;
console.log(req.body,"bodyyyy");

    
    const newBooking = new Booking({
     eventId,
     // eventName:eventName,
    //  eventDateTime,
      userName:userName,
     // userId:userId
     // ticketQuantities,
    //  totalPrice,
    });

    
    await newBooking.save();


    res.status(201).json({ message: 'Booking registered successfully', booking: newBooking });
  } catch (error) {
    console.error('Error registering booking:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};



export const getUpcomingEvents = async (req: Request, res: Response) => {
  const userName = req.params.userName;

  try {

    const events = await Booking.find({ userName }) 
      .populate({
        path: 'eventId',
        match: { startDate: { $gt: new Date() } }, 
      })
      .exec();

    
    const upcomingEvents = events.filter(booking => booking.eventId);

    if (!upcomingEvents.length) {
      return res.status(404).json({ message: 'No upcoming events found for this user.' });
    }

    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getPastEvents = async (req: Request, res: Response) => {
  const userName = req.params.userName;

  try {
 
    const events = await Booking.find({ userName }) 
      .populate({
        path: 'eventId',
        match: { endDate: { $lt: new Date() } }, 
      })
      .exec();


    const pastEvents = events.filter(booking => booking.eventId);

    if (!pastEvents.length) {
      return res.status(404).json({ message: 'No past events found for this user.' });
    }

    res.status(200).json(pastEvents);
  } catch (error) {
    console.error('Error fetching past events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handlePaymentSuccessful = async (message: any) => {
  const { userId, totalAmount, eventId } = message;


  await Booking.create({ userId, eventId, amountPaid: totalAmount,paymentType:'wallet' });
  console.log('Booking created for event:', eventId);
};


consumeEvent('payment_exchange', 'booking_queue', 'payment.successful', handlePaymentSuccessful);


export const getBookingDetails = async (req: Request, res: Response, next: NextFunction) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId).populate('eventId');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const event = booking.eventId as any; 

    res.json({
      success: true,
      data: {
        eventImage: event.image,
        eventName: event.title,
        eventDate: event.startDate,
        eventTime: event.startDate,
        quantity:  booking.quantity,
        location: `${event.location.addressline1}, ${event.location.city}, ${event.location.state}`,
        ticketType: booking.ticketType,
        status:booking.status,
        amountPaid: booking.amountPaid,
        //cancellationPolicy: event.description, 
        qrCodeValue: `${booking._id}-${event._id}` 
      }
    });
  } catch (error) {
    next(error);
  }
};



export const saveBooking = async (req: Request, res: Response) => {
  console.log('enetererd for saving');
  
  try {
    const { userName, eventId, tickets, totalAmountPaid, paymentType, bookingDate } = req.body;
 console.log((req.body,"body.."));
 
    const bookingData = tickets.map((ticket: any) => ({
      userName,
      eventId,
      ticketType: ticket.ticketType,
      quantity: ticket.quantity,
      amountPaid: totalAmountPaid,
      paymentType,
      bookingDate: bookingDate || new Date(),
    }));

    const savedBookings = await Booking.insertMany(bookingData);
    
    for (const ticket of tickets) {
      const { ticketType, quantity } = ticket;

      await Event.updateOne(
        { _id: eventId, 'ticketDetails.type': ticketType },
        { $inc: { 'ticketDetails.$.seats': -quantity } } 
      );
    }
    return res.status(200).json({ success: true, data: savedBookings });
  } catch (error) {
    console.error('Error saving booking:', error);
    return res.status(500).json({ success: false, message: 'Error saving booking' });
  }
};


export const cancelBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

   
    booking.status = 'cancelled';
    await booking.save();

    
    const event = await Event.findById(booking.eventId); 
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    
    const seatsToRelease = booking.quantity ?? 0; 

    if (seatsToRelease <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid number of seats to release' });
    }

    
    const ticketType = booking.ticketType; 
    const ticketDetail = event.ticketDetails.find((t) => t.type === ticketType);

    if (ticketDetail) {
      ticketDetail.seats += seatsToRelease;  
    };
    

    await event.save();

    const refundAmount = booking.amountPaid ?? 0; 
    // if (refundAmount > 0) {
    //   // Refund the amount to the user's wallet
    //   await axios.post(`${USER_SERVICE_URL}/wallet/refund`, {
    //     userId: booking.userId, // Assuming booking has a userId field
    //     amount: refundAmount
    //   });
    // }


    // const refundMessage = {
    //   userName: booking.userName,
    //   amount: booking.amountPaid ?? 0 // Default to 0 if undefined
    // };

    // await sendRefundMessage(refundMessage);
    // console.log("calllddd",refundMessage);
    

    return res.status(200).json({ success: true, message: 'Booking cancelled and seats updated' });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ success: false, message: 'Error cancelling booking' });
  }
};