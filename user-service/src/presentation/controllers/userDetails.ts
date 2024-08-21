
import { Request, Response } from 'express';
import { User } from '../../infrastructure/database/mongoDB/models/userModel'; 
import { HttpStatusCode } from '../../utils/statusCode/httpStatusCode';

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

export const getUserDetails = async (req: CustomRequest, res: Response) => {
  try {
    // console.log("reached deatils, user service");
    
    
    const userId = req.user?.id;
    // console.log(userId,"id......")
    if (!userId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'User ID is missing in the request' });
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND);
    }

    res.status(HttpStatusCode.OK).json({ userDetails: user });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Server Error', error });
  }
};



