import { Request, Response,NextFunction } from 'express';
import { Event} from '../../infrastructure/database/mongoDB/models/event';
import { HttpStatusCode } from '../../utils/statusCodes/httpStatusCode';
import Booking from '../../infrastructure/database/mongoDB/models/bookings'
import { log } from 'winston';
import { Document } from 'mongoose';
import { consumeEvent } from '../../infrastructure/RabbitMQ/consumer';
import { sendRefundMessage } from '../../infrastructure/RabbitMQ/publisher';
import axios from 'axios';
import Stripe from 'stripe';

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
   

    const bookings = await Booking.find({ eventId: eventId });

    const attendeesCount = bookings.length;
    if (!event) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found' });
    }
    const totalAmountReceived = bookings.reduce((sum, booking) => sum + (booking.amountPaid || 0), 0);
    const recentRegistrations = await Booking.find({ eventId: eventId })
    .sort({ bookingDate: -1 }) 
    .limit(5);

    res.status(HttpStatusCode.OK).json({event,recentRegistrations,attendeesCount,totalAmountReceived});
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


    
    const newBooking = new Booking({
     eventId,
     // eventName:eventName,
    //  eventDateTime,
      userName:userName,
    userId:userId
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
  const {userId, userName,quantity,ticketType, totalAmount,eventId, } = message;


  await Booking.create({userName,userId,  eventId,quantity,ticketType, amountPaid: totalAmount,paymentType:'wallet' });
 
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
        type: event.type,
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



// export const saveBooking = async (req: Request, res: Response) => {
//   console.log('enetererd for saving');
  
//   try {
//     const { userName, eventId, tickets, totalAmountPaid, paymentType, bookingDate } = req.body;
//     console.log((req.body,"body.."));
 
//     const bookingData = tickets.map((ticket: any) => ({
//       userName,
//       eventId,
//       ticketType: ticket.ticketType,
//       quantity: ticket.quantity,
//       amountPaid: totalAmountPaid,
//       paymentType,
//       bookingDate: bookingDate || new Date(),
//     }));

//     const savedBookings = await Booking.insertMany(bookingData);
    
//     for (const ticket of tickets) {
//       const { ticketType, quantity } = ticket;

//       await Event.updateOne(
//         { _id: eventId, 'ticketDetails.type': ticketType },
//         { $inc: { 'ticketDetails.$.seats': -quantity } } 
//       );
//     }
//     return res.status(200).json({ success: true, data: savedBookings });
//   } catch (error) {
//     console.error('Error saving booking:', error);
//     return res.status(500).json({ success: false, message: 'Error saving booking' });
//   }
// };




interface BookingData {
  userId:string;
  userName: string;
  eventId: string;
  ticketType: string;
  quantity:any,
  totalAmountPaid: number;
  paymentType: string;
  bookingDate?: Date;
}


// export const saveBooking = async (bookingData: BookingData) => {
//   try {
//     // Destructure and validate bookingData
//     const { userName, eventId, ticketType, quantity, totalAmountPaid, paymentType, bookingDate } = bookingData;

//     if (!userName || !eventId || !ticketType || quantity === undefined || totalAmountPaid === undefined || !paymentType) {
//       throw new Error('Missing required booking data');
//     }

//     console.log('Booking data:', bookingData);

//     // Create a new booking
//     const booking = {
//       userName,
//       eventId,
//       ticketType,
//       quantity,
//       amountPaid: totalAmountPaid,
//       paymentType,
//       bookingDate: bookingDate || new Date(),
//     };

//     console.log('Booking object:', booking);

//     // Insert the booking into the database
//     const savedBooking = await Booking.create(booking);

//     // Update event ticket availability for the specific ticket type
//     await Event.updateOne(
//       { _id: eventId, 'ticketDetails.type': ticketType },
//       { $inc: { 'ticketDetails.$.seats': -quantity } }
//     );

//     return { success: true, data: savedBooking };
//   } catch (error) {
//     console.error('Error saving booking:', error);
//     return { success: false, message: 'Error saving booking' };
//   }
// };

export const saveBooking = async (bookingData: BookingData) => {
  try {
    const { userId,userName = 'defaultUser', eventId = 'defaultEventId', ticketType = 'defaultType', quantity = 0, totalAmountPaid = 0, paymentType = 'defaultPayment', bookingDate = new Date() } = bookingData;

    console.log('Using default booking data:', { userName, userId,eventId, ticketType, quantity, totalAmountPaid, paymentType, bookingDate });

    if (!userName || !eventId || !ticketType || quantity === undefined || totalAmountPaid === undefined || !paymentType) {
      throw new Error('Missing required booking data');
    }

    const booking = {
      userName,
      userId,
      eventId,
      ticketType,
      quantity,
      amountPaid: totalAmountPaid,
      paymentType,
      bookingDate,
    };

    const savedBooking = await Booking.create(booking);

    await Event.updateOne(
      { _id: eventId, 'ticketDetails.type': ticketType },
      { $inc: { 'ticketDetails.$.seats': -quantity } }
    );

    return { success: true, data: savedBooking };
  } catch (error) {
    
    return { success: false, message: 'Error saving booking' };
  }
};

export const savedOnlineBooking = async (req: Request, res: Response): Promise<void> => {
  const bookingData = req.body;
  console.log(bookingData, "booking data..");

  try {
    // Create a new Booking instance and save it
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    // Decrease the seats for the ticket type
    const { eventId, ticketType,quantity } = bookingData;
    console.log(eventId,ticketType,quantity);
    
    // if (tickets.length > 0) {
    //   const ticketType = ticketType;
    //   const quantity = quantity;

      const result = await Event.updateOne(
        { _id: eventId, 'ticketDetails.type': ticketType },
        { $inc: { 'ticketDetails.$.seats': -quantity } }
      );

     
    

    
    res.status(201).json({ success: true, message: 'Booking saved successfully', data: savedBooking });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
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
   if (refundAmount > 0) {
  await axios.post(`http://localhost:3002/user/wallet/refund`, {
    userId: booking.userId, 
    amount: refundAmount,
  });
}


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


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})
export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.body.session_id);


    if (session.payment_status === 'paid') {
      
   
      const metadata = session.metadata;
      if (!metadata) {
        return res.status(400).json({ success: false, message: 'Metadata is missing in the session' });
      }

   
      let tickets;
      try {
        tickets = JSON.parse(metadata.tickets);
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid ticket details' });
      }
      if (session.amount_total === null) {
        return res.status(400).json({ success: false, message: 'Total amount is missing in the session' });
      }
      const {  eventId, ticketType, quantity, userId } = metadata;

      //  booking data
      const bookingData: BookingData = {
        userName: session.customer_details?.name || 'Unknown User', 
        userId:userId,
        eventId: metadata.eventId,
        ticketType:metadata.ticketType,
        quantity:metadata.quantity, 
        totalAmountPaid: (session.amount_total / 100) , 
        paymentType: 'online',
        bookingDate: new Date(),
      };

      
      const result = await saveBooking(bookingData);

      

      if (result.success) {
        return res.status(200).json({ success: true, message: 'Payment successful, booking created' });
      } else {
        return res.status(500).json({ success: false, message: result.message });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};

export const getAttendees = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  
  try {
    const attendees = await Booking.find({ eventId })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalAttendees = await Booking.countDocuments({ eventId }).exec();

    res.status(200).json({
      attendees,
      totalPages: Math.ceil(totalAttendees / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching attendees:', error);
    res.status(500).json({ message: 'Error fetching attendees.' });
  }
};

export const searchEvents = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
 console.log(query,"query...")
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Use MongoDB's text search or regular expression for searching
    const searchRegex = new RegExp(query, 'i'); // 'i' for case insensitive search

    // Search by title, description, or category
    const events = await Event.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    });

    return res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error occurred while searching events' });
  }
};