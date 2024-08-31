// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const authenticate = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
//     req.user = decoded; 
//     next();
//   } catch (error) {
//     return res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// export default authenticate;
