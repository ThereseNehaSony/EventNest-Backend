// import { Request, Response } from 'express';
import {User} from '../../infrastructure/database/mongoDB/models/loginCredentials'; 
import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import jwt from "jsonwebtoken";
import { generateOtp } from "../../utils/otp/generateOtp";
import { Otp } from "../../infrastructure/database/mongoDB/models/otp";
import { sendOtp } from "../../utils/otp/sendOtp";
import { hashPassword } from "../../utils/bcrypt/hashPassword";

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}


const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: "15m" });
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const payload = jwt.verify(refreshToken, String(process.env.REFRESH_TOKEN_SECRET)) as { _id: string, email: string, role: string };

    const newAccessToken = generateAccessToken({ _id: payload._id, email: payload.email, role: payload.role });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

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


// Reset Password
export const changePassword = async (req: CustomRequest, res: Response) => {
  const { newPassword } = req.body;
  console.log(req.body, "body..........");
  
  try {
    const user = await User.findById(req.user?.id);
    console.log(user, "user.......");
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = await hashPassword(newPassword);
    console.log("changed......");

    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password', error });
  }
};


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

export const resendOtpController = (dependencies: IDependencies) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      console.log(email, "email.............");

      // Check if the email exists in the OTP collection
      let otpEntry = await Otp.findOne({ email });
      if (!otpEntry) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Generate new OTP
      const otp = await generateOtp();
      let dbOtp;

      // Update or create the OTP in the database
      dbOtp = await Otp.findOneAndUpdate(
        { email },
        { $set: { otp, createdAt: new Date() } },
        { new: true, upsert: true } // Ensure it creates if it doesn't exist
      );

      if (dbOtp) {
        await sendOtp(email, otp); // Send the OTP
        return res.status(200).json({ message: "OTP has been resent to your email" });
      } else {
        return res.status(500).json({ message: "Failed to generate OTP" });
      }
    } catch (error: any) {
      next(error);
    }
  };
};