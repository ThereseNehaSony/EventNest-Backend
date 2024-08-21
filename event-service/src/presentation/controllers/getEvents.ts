import { Request, Response } from 'express';
import { Event } from '../../infrastructure/database/mongoDB/models/event';
import { HttpStatusCode } from '../../utils/statusCodes/httpStatusCode'; 

export const getEventsByHostName = async (req: Request, res: Response) => {
    const hostName = req.params.hostName;
    console.log("hiiiiiiii");
    
    console.log(hostName,"hostname....")
  
    try {
      const events = await Event.find({ host: hostName });
      if (!events.length) {
        return res.status(404).json({ message: 'No events found for this host.' });
      }
     // console.log(events,"events...........")
      res.status(HttpStatusCode.OK).json({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  };