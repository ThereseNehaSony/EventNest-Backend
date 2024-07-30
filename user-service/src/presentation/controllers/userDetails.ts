// src/controllers/userController.ts
import { Request, Response } from 'express';
import { User } from '../../infrastructure/database/mongoDB/models/userModel'; // Adjust the path according to your project structure
//import { IUser } from '../../infrastructure/database/mongoDB/models/userModel'; // Importing the interface if needed

// Extend Request interface to include the user object
interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export const getUserDetails = async (req: CustomRequest, res: Response) => {
  try {
    console.log("reached deatils, user service");
    
    
    const userId = req.user?.id;
    console.log(userId,"id......")
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing in the request' });
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ userDetails: user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};



