import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { generateOtp } from "../../utils/otp/generateOtp";
import { Otp } from "../../infrastructure/database/mongoDB/models/otp";
import { sendOtp } from "../../utils/otp/sendOtp";
//import { dependencies } from "../../config/dependencies";
import { HttpStatusCode } from "../../utils/statusCodes/httpStatusCodes";

export const sendOtpController = (dependencies: IDependencies) => {
  const {
    useCases: { checkUserEmailUseCase, verifyOtpUseCase },
  } = dependencies;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCredentials = req.body;
      const userExist = await checkUserEmailUseCase(dependencies).execute(req.body.email);

      if (!userExist) {
        console.log(userExist, "no user found");
        return res.status(HttpStatusCode.CONFLICT).json({ message: "No user found" });
      }

      if (!userCredentials.otp) {
        const otp = await generateOtp();
        const emailExist = await Otp.findOne({ email: userCredentials.email });
        let dbOtp;
        if (emailExist) {
          dbOtp = await Otp.findOneAndUpdate(
            { email: userCredentials.email },
            { $set: { otp, createdAt: new Date() } }
          );
        } else {
          dbOtp = await Otp.create({ email: userCredentials.email, otp });
        }

        if (dbOtp) {
          await sendOtp(userCredentials.email, otp);
          return res.status(HttpStatusCode.CREATED).json({ message: "An OTP has been sent to your email" });
          
        }
      } else {
        const otpVerified = await verifyOtpUseCase(dependencies).execute(
          userCredentials.email,
          userCredentials.otp
        );

        if (!otpVerified) {
          console.log("OTP is incorrect");
          return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Otp is not verified" });
        }

        return res.status(HttpStatusCode.OK).json({ message: "Otp is verified" });
      }
    } catch (error) {
      next(error);
    }
  };
};
