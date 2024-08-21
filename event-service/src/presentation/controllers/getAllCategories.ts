import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { HttpStatusCode } from "../../utils/statusCodes/httpStatusCode";

export const getAllCategoriesController = (dependencies: IDependencies) => {
  const {useCases: {getAllCategoriesUseCase}} = dependencies;
console.log("called, categories........")
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query?.page) || 1;
      const limit = Number(req.query?.limit) || 5;
  console.log(page,limit,"page nd mlimit")
      const data = await getAllCategoriesUseCase(dependencies).execute({page,limit})
      console.log("🚀 ~ file: getAllCategories.ts:12 ~ return ~ data:", data)
      res.status(HttpStatusCode.OK).json({
        success: true,
        data,
        message: "Categories retrieved successfully",
      })
    } catch (error) {
      next(error)
    }
  }
}