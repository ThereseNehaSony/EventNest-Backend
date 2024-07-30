
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.user_jwt;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));
    (req as any).user = decoded; // Attach decoded user to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

export default authenticateJWT;

