// import { randomInt } from "crypto"

// export const generateOtp = async () => {
//     const value = await randomInt(1000, 10000)
//     console.log(value,"otp..........")
//     return value
// }

import { randomInt } from "crypto";

export const generateOtp = async (): Promise<string> => {
  const value = await randomInt(1000, 10000);
  console.log(value, "otp..........");
  return value.toString(); 
};