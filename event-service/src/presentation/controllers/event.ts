import { Request, Response } from 'express';
import { Event } from '../../infrastructure/database/mongoDB/models/event';
import { HttpStatusCode } from '../../utils/statusCodes/httpStatusCode';

export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    console.log(eventId, "id......................");

    const event = await Event.findById(eventId);
    console.log(event, "event...........................");

    if (!event) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found' });
    }

    res.status(HttpStatusCode.OK).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const updateEventStatus = async (req: Request, res: Response) => {
  try {
    const { eventId, action } = req.params;

    if (!['approve', 'reject'].includes(action.toLowerCase())) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Invalid action.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Event not found.' });
    }

    event.status = action === 'approve' ? 'approved' : 'rejected';
    await event.save();

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
