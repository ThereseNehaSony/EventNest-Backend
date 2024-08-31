import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

interface DecodedToken extends JwtPayload {
  _id: any;
  id: string;
}

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.user_jwt;
  console.log(token,"token...")
  if (!token) {
    return res.status(401).json({ message: 'No token authorization denied' });
  }

  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as unknown as DecodedToken;
    console.log(decoded,"decoded.........");
    
    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }

    req.user = { id: decoded._id };
      console.log(req.user,'user..........');
      
    next();
  } catch (error) {
    console.log(error,"error..........")
    res.status(401).json({ message: 'Token is not valid', error });
  }
};




export const checkUserStatus = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'blocked') { // Assuming 'status' field in the user document indicates whether the user is blocked
      return res.status(403).json({ message: 'User is blocked' });
    }

    next(); // Proceed if the user is active
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
