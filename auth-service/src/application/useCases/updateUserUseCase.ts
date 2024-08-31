import { IDependencies } from "../interfaces/IDependencies";

export const updateUserUseCase = (dependencies: IDependencies) => {
  const {repositories: {updateUser}} = dependencies;

  return {
    execute: async (id: string, username: string) => {
      try {
        return await updateUser(id, username);
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