

import { IDependencies } from "../interfaces/IDependencies";

export const updateHostUseCase = (dependencies: IDependencies) => {
  const {repositories: {updateHost}} = dependencies;

  return {
    execute: async (id: string, username: string) => {
      try {
        return await updateHost(id, username);
      } catch (error: any) {
        throw new Error(error?.message)
      }
    }
  }
}