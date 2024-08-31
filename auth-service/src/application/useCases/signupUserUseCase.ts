import { UserEntity } from "../../domain/entities";
import { IDependencies } from "../interfaces/IDependencies";

export const signupUserUseCase = (dependencies: IDependencies) => {
    const {repositories: {signup} } = dependencies;

    return {
        execute: async (data: UserEntity) => {
            try {
                return await signup(data);
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