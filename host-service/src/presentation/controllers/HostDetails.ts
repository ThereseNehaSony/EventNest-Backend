// src/controllers/userController.ts
import { Request, Response,NextFunction } from 'express';
import {Host } from '../../infrastructure/database/mongoDB/models/hostModel'; // Adjust the path according to your project structure
//import { IUser } from '../../infrastructure/database/mongoDB/models/userModel'; // Importing the interface if needed

// Extend Request interface to include the user object
interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export const getUserDetails = async (req: CustomRequest, res: Response) => {
  try {
    console.log("reached deatils, host service");
    
    
    const userId = req.user?.id;
    console.log(userId,"id......")
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing in the request' });
    }

    const user = await Host.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ userDetails: user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getHostDetails = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const { id } = req.params;
    const host = await Host.findById(id);
    
   
    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host not found',
      });
    }

    res.json({
      success: true,
      data: host,
    });
  } catch (error) {
    next(error);
  }
};


export const updateHostStatus = async (req: Request, res: Response) => {
  try {
    
    const { newStatus } = req.body;
    const {hostId} = req.body
  
    const host = await Host.findByIdAndUpdate(
      hostId,
      { status:newStatus },
      { new: true }
    );
   console.log(host)
    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    res.status(200).json(host);
  } catch (error) {
    res.status(500).json({ message: 'Error updating host status', error });
  }
};