import { IDependencies } from "../interfaces/IDependencies";

export const checkUserEmailUseCase = (dependencies: IDependencies) => {
    const {repositories: {checkEmail} } = dependencies;

    return {
        execute: async (email: string) => {
            try {
                return await checkEmail(email);
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