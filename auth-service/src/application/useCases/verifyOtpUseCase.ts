import { IDependencies } from "../interfaces/IDependencies";

export const verifyOtpUseCase = (dependencies: IDependencies) => {
    const {repositories:{verifyOtp}} = dependencies;

    return {
        execute: async (email: string, otp: string) => {
            try {
                return await verifyOtp(email, otp);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                } else {
                    throw new Error('An unknown error occurred');
                }
            }
        }
    }
}