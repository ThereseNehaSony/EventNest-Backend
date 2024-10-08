import nodemailer from "nodemailer";
import { EMAIL, PASSWORD } from "../../config/envConfg/config";

export const sendOtp = async (email: string, otp: number | string) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    service: "Gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
    secure: true,
  });

  const message = "Enter This OTP to Continue";
  const mailData = {
    from: "impressinthatstyle@gmail.com",
    to: email,
    subject: "OTP FROM EVENTNEST",
    html: `<p>${message}</p> <p style="color: tomato; font-size: 25px; letter-spacing: 2px;"><b>${otp}</b></p><p>This Code <b>expires in ${1} minutes(s)</b>.</p>`,
  };

  const result = transporter.sendMail(mailData, (error) => {
    return new Promise((resolve, reject) => {
      if (error) {
        console.log("Error occurred while sending the",error);
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};