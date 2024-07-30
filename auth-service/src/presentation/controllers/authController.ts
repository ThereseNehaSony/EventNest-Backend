import { Request, Response } from 'express';
import {User} from '../../infrastructure/database/mongoDB/models/loginCredentials'; // Assume you have a User model
//import { sendOtpEmail, verifyOtp } from '../services/otpService'; // You need to implement these functions
// import nodemailer from 'nodemailer';
import { generateOtp } from "../../utils/otp/generateOtp";
import { Otp } from "../../infrastructure/database/mongoDB/models/otp";
import { sendOtp } from "../../utils/otp/sendOtp";
import { hashPassword } from "../../utils/bcrypt/hashPassword";



// Request OTP
export const requestOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log(user,"user..............")
    const otp = await generateOtp();
    await sendOtp(email,otp)
    let emailExist = await Otp.findOne({ email: email });
    let dbOtp;
    if (emailExist) {
      dbOtp = await Otp.findOneAndUpdate(
        { email:email },
        { $set: { otp, createdAt: new Date() } }
      );
    } else {
      dbOtp = await Otp.create({ email: email, otp });
    }
    
    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error requesting OTP', error });
  }
};




export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const dbOtp = await Otp.findOne({ email });
    if (dbOtp && otp === dbOtp.otp) {
      res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
};


// export const verifyOtp = async (req: Request, res: Response) => {
//   const { email, otp } = req.body;

//   try {
//     const isOtpValid = await verifyOtpCode(email, otp);
//     if (isOtpValid) {
//       res.status(200).json({ success: true, message: 'OTP verified successfully' });
//     } else {
//       res.status(400).json({ success: false, message: 'Invalid OTP' });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error verifying OTP' });
//   }
// };

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  console.log(req.body,"body..........")
  try {
    // const isValidOtp = await verifyOtp(email, otp); 
    // if (!isValidOtp) {
    //   return res.status(400).json({ success: false, message: 'Invalid OTP' });
    // }
    const user = await User.findOne({ email });
    console.log(user,"user.......")
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.password = await hashPassword(newPassword);

    // user.password = newPassword; 
    console.log("changed......") 
    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password', error });
  }
};
