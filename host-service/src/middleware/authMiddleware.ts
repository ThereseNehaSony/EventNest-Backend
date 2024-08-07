// userService/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

interface DecodedToken extends JwtPayload {
  id: string;
}

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.user_jwt;
  console.log(token,"token...")
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied host-service' });
  }

  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as unknown as DecodedToken;
    console.log("entered middleware...")
    console.log(decoded,"decoded.........");
    
    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: 'Invalid token, authorization denied host' });
    }

    req.user = { id: decoded._id };
      console.log(req.user,'user..........');
      
    next();
  } catch (error) {
    console.log(error,"error..........")
    res.status(401).json({ message: 'Token is not valid', error });
  }
};
