import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { HttpStatusCode } from '../../utils/statusCodes/httpStatusCodes';
import {User} from '../../infrastructure/database/mongoDB/models/loginCredentials';
import logger from '../../utils/logger/logger';

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'User not found' });
    }

    const otp = crypto.randomInt(1000, 9999).toString();

   
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.AUTH_EMAIL, 
        pass: process.env.AUTH_PASS, 
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.AUTH_EMAIL,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`otp is ${otp}`)
  
    res.status(HttpStatusCode.OK).json({ message: 'OTP sent to email' });
  } catch (error) {
    next(error);
  }
};

// Verify OTP and reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, newPassword } = req.body;
  console.log(req.body,"body..........")

  try {
    const user = await User.findOne({
      email,
    
    });

    if (!user) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Invalid or expired OTP' });
    }

    // Reset password
    user.password = newPassword;
    
    await user.save();

    res.status(HttpStatusCode.OK).json({ message: 'Password has been reset' });
  } catch (error) {
    next(error);
  }
};
