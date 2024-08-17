// src/controllers/eventController.ts
import { Request, Response } from 'express';
import {Event} from '../../infrastructure/database/mongoDB/models/event';

export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.eventId;
    console.log(eventId,"id......................");
    
    const event = await Event.findById(eventId);
     console.log(event,"event...........................");
     
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateEventStatus = async (req: Request, res: Response) => {
    try {
      const { eventId, action } = req.params;
  
      // Check if action is valid
      if (!['approve', 'reject'].includes(action.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid action.' });
      }
  
      // Find the event by ID
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
  
      // Update status based on action
      event.status = action === 'approve' ? 'approved' : 'rejected';
  
      // Save updated event
      await event.save();
  
      res.status(200).json({ message: `Event ${action}d successfully.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

// export const updateEventStatus = async (req: Request, res: Response) => {
//   try {
//     const eventId = req.params.eventId;
//     const { action, reason } = req.body;

//     if (!['approve', 'reject'].includes(action)) {
//       return res.status(400).json({ message: 'Invalid action' });
//     }

//     const event = await Event.findById(eventId);

//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     if (action === 'approve') {
//       event.status = 'Approved';
//     } else if (action === 'reject') {
//       event.status = 'Rejected';
//       event.rejectionReason = reason || 'No reason provided';
//     }

//     await event.save();

//     res.json({ message: `Event ${action}d successfully` });
//   } catch (error) {
//     console.error('Error updating event status:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
