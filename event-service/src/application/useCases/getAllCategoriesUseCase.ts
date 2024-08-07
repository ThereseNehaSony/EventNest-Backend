import { IDependencies } from "../interfaces/IDependencies";

export const getAllCategoriesUseCase = (dependencies: IDependencies) => {
  const {repositories: {getAllCategories}} = dependencies;

  return{
    execute: async( {page, limit}: any) => {
      try {
        return await getAllCategories({page, limit})
      } catch (error: any) {
        throw new Error(error.message)
      }
    }
  }
} 