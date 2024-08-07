
import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { signupValidation } from "../../utils/validations/signupValidation";
import { hashPassword } from "../../utils/bcrypt/hashPassword";
import jwt from "jsonwebtoken";
import { generatePassword } from "../../utils/password/generatePassword";
import { generateOtp } from "../../utils/otp/generateOtp";
import { Otp } from "../../infrastructure/database/mongoDB/models/otp";
import { sendOtp } from "../../utils/otp/sendOtp";
import { publishUserCreated ,publishHostCreated} from "../../infrastructure/rabbitMQ/publisher";

export const signupController = (dependencies: IDependencies) => {
  const {
    useCases: { signupUserUseCase, checkUserEmailUseCase, verifyOtpUseCase },
  } = dependencies;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCredentials = req.body;
      const userExist = await checkUserEmailUseCase(dependencies).execute(
        req.body.email
      );

      if (userExist) {
        console.log(userExist,"userexist")
        return res.status(409).json({ message: "E-mail already in use" });
        
      }

      if (!userCredentials.otp && userCredentials.password) {
        const otp = await generateOtp();
        let emailExist = await Otp.findOne({ email: userCredentials.email });
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
          sendOtp(userCredentials.email, otp).then((response) => {
            return res
              .status(201)
              .json({ message: `An OTP has been sent to your email` });
          });
        }
      } else {
        try {
          let otpVerified = false;

        console.log(otpVerified);
      
          if (userCredentials.otp) {
            otpVerified = await verifyOtpUseCase(dependencies).execute(
              userCredentials.email,
              userCredentials.otp
            );
          }
         
         

          // to check if it is google signup
            if (!userCredentials.password) {
              userCredentials.password = await generatePassword();
              }
        
          if (!otpVerified && userCredentials.otp) {
            console.log("otp is incorrect");
            throw new Error("Otp is not verified");
           
            
          } else {
            delete userCredentials?.otp;
            const { value, error } = signupValidation.validate(req.body);
            if (error) {
              throw new Error(error.message);
            }

            value.password = await hashPassword(value.password);

            const result: any = await signupUserUseCase(dependencies).execute(
              value
            );

            if (!result) {
              throw new Error("User creation failed!");
            } else {

              // publishing via rabbitmq
              publishUserCreated(result)
              if(value.role ==='host'){
                publishHostCreated(result)
              }
             
              let payload = {
                _id: String(result?._id),
                email: result?.email!,
                role: result?.role!,
              };
              const accessToken = jwt.sign(
                payload,
                String(process.env.ACCESS_TOKEN_SECRET),
                { expiresIn: "1h" }
              );
              console.log(accessToken, "signup token");
              res.cookie("user_jwt", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
              });

              res.status(201).json({
                success: true,
                user: result,
                message: "User created!",
              });
              
            }
          }
        } catch (error: any) {
          return res.status(400).json({ message: error.message });
        }
      }
    } catch (error: any) {
      next(error);
    }
  };
};
