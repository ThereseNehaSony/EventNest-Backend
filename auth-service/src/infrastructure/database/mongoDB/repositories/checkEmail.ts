import { User } from "../models/loginCredentials"

export const checkEmail = async (email: string)  => {
    try {
        const userExist = await User.findOne({email});
        return userExist  ? true : false;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}