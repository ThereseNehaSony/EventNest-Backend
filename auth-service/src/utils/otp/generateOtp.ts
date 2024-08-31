import { randomInt } from "crypto";
import logger from "../logger/logger";

export const generateOtp = async (): Promise<string> => {
  const value = await randomInt(1000, 10000);
  logger.info(`genenrated otp is ${value} `)
  return value.toString(); 
};