import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

import {User} from '../../infrastructure/database/mongoDB/models/loginCredentials';

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
  console.log(otp,"otp");
  
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    next(error);
  }
};

// Verify OTP and reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp, newPassword } = req.body;
  console.log(req.body,"body..........")

  try {
    const user = await User.findOne({
      email,
    //   resetPasswordToken: otp,
    //   resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Reset password
    user.password = newPassword;
    
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    next(error);
  }
};
