import { IDependencies } from "../interfaces/IDependencies";

export const getAllEventsUseCase = (dependencies: IDependencies) => {
  const {repositories: {getAllEvents}} = dependencies;

  return{
    execute: async( {page, limit}: any) => {
      try {
        return await getAllEvents({page, limit})
      } catch (error: any) {
        throw new Error(error.message)
      }
    }
  }
} 