import { Request, Response } from 'express';
import { Event} from '../../infrastructure/database/mongoDB/models/event';
import { HttpStatusCode } from '../../utils/statusCodes/httpStatusCode';
import Booking from '../../infrastructure/database/mongoDB/models/bookings'
import { log } from 'winston';
import { Document } from 'mongoose';
import { consumeEvent } from '../../infrastructure/RabbitMQ/consumer';

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
    console.log(event, "event...........................");


    const bookings = await Booking.find({ eventId: eventId });

    // Calculate metrics
    const attendeesCount = bookings.length;
    if (!event) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found' });
    }

    res.status(HttpStatusCode.OK).json({event,attendeesCount});
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
    console.log('Event saved:', savedEvent);
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

    // Create a new booking document
    const newBooking = new Booking({
     eventId,
     // eventName:eventName,
    //  eventDateTime,
      userName:userName,
     // userId:userId
     // ticketQuantities,
    //  totalPrice,
    });

    // Save the booking in the database
    await newBooking.save();

    // Send a successful response
    res.status(201).json({ message: 'Booking registered successfully', booking: newBooking });
  } catch (error) {
    console.error('Error registering booking:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};



// export const getUpcomingEvents = async (req: CustomRequest, res: Response) => {
//   try {
//     const userId = req.user?.id; // Ensure user is authenticated and user ID is available
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }

//     const currentDate = new Date();

//     // Query for bookings associated with the user and populate the event details
//     const bookings = await Booking.find({
//       userId,
//     }).populate({
//       path: 'eventId', // Assuming 'eventId' is the reference to Event
//       match: { startDate: { $gte: currentDate } }, // Only upcoming events
//     }) as unknown as IBookingWithEvent[]; // Cast to the new interface

//     // Filter out any bookings where the event details were not populated (i.e., no upcoming events)
//     const upcomingEvents = bookings.filter(booking => booking.eventId).map(booking => ({
//       eventName: booking.eventId.eventName,
//       eventDate: booking.eventId.startDate, // Or whatever field name represents the event date
//       eventTime: booking.eventId.startTime, // Or whatever field name represents the event time
//       location: booking.eventId.location,
//       imageUrl: booking.eventId.imageUrl,
//       status: booking.status,
//     }));

//     res.json(upcomingEvents);
//   } catch (error) {
//     console.error('Error fetching upcoming events:', error);
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };


export const getUpcomingEvents = async (req: Request, res: Response) => {
  const userName = req.params.userName;

  try {
    // Fetch bookings and populate the eventId field
    const events = await Booking.find({ userName }) // Change this to userId if needed
      .populate('eventId') // Populate event details
      .exec();

    if (!events.length) {
      return res.status(404).json({ message: 'No events found for this user.' });
    }

    // Map bookings to extract event details
    // const events = bookings.map(booking => ({
    //   eventName: booking.eventId?.eventName || 'Unknown', // Check for undefined eventId
    //   eventDate: booking.eventId?.startDate || 'Unknown',
    //   eventTime: booking.eventId?.startTime || 'Unknown',
    //   location: booking.eventId?.location || 'Unknown',
    //   imageUrl: booking.eventId?.imageUrl || 'Unknown',
    //   status: booking.status,
    // }));
console.log(events,"events....");

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const handlePaymentSuccessful = async (message: any) => {
  const { userId, totalAmount, eventId } = message;

  // Create a booking in the event service
  await Booking.create({ userId, eventId, amountPaid: totalAmount,paymentType:'wallet' });
  console.log('Booking created for event:', eventId);
};

// Start consuming the event
consumeEvent('payment_exchange', 'booking_queue', 'payment.successful', handlePaymentSuccessful);