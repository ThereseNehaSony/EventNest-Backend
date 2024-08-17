import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";

export const getAllEventsController = (dependencies: IDependencies) => {
  const {useCases: {getAllEventsUseCase}} = dependencies;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query?.page) || 1;
      const limit = Number(req.query?.limit) || 5;
  
      const data = await getAllEventsUseCase(dependencies).execute({page,limit})
      console.log("🚀 ~ file: getAllEvents.ts:12 ~ return ~ data:", data)
      res.status(200).json({
        success: true,
        data,
        message: "Events retrieved successfully",
      })
    } catch (error) {
      next(error)
    }
  }
}