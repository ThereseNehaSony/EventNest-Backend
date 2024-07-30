import { randomInt } from "crypto"

export const generateOtp = async () => {
    const value = await randomInt(1000, 10000)
    console.log(value,"otp..........")
    return value
}