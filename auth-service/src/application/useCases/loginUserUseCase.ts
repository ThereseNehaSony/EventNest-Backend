//import { UserEntity } from "../../domain/entities";
import { UserLoginEntity } from "../../domain/entities/userLoginEntity";
import { IDependencies } from "../interfaces/IDependencies";

export const loginUserUseCase = (dependencies: IDependencies) => {
    const {repositories: {login} } = dependencies;

    return {
        execute: async (data: UserLoginEntity) => {
            try {
                return await login(data);
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

