import { IDependencies } from "../interfaces/IDependencies";

export const getAllEventsUseCase = (dependencies: IDependencies) => {
  const {repositories: {getAllEvents}} = dependencies;

  return{
    execute: async( ) => {
      try {
        return await getAllEvents()
      } catch (error: any) {
        throw new Error(error.message)
      }
    }
  }
} 