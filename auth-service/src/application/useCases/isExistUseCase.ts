//import { UserEntity } from "../../domain/entities";
import { IDependencies } from "../interfaces/IDependencies";

export const isExistUseCase = ( dependencies: IDependencies) => {
    const {repositories: {isExist} } = dependencies;

    return {
        execute: async (token: string) =>  {
            try {
                return await isExist(token)
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