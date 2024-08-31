import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { HttpStatusCode } from '../../utils/statusCodes/httpStatusCode';

export const getAllEventsController = (dependencies: IDependencies) => {
  const {useCases: {getAllEventsUseCase}} = dependencies;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //const page = Number(req.query?.page) || 1;
     // const limit = Number(req.query?.limit) || 5;
  
      const data = await getAllEventsUseCase(dependencies).execute()
      
    //   console.log(" getAllEvents:", data)
      res.status(HttpStatusCode.OK).json({
        success: true,
        data,
        message: "Events retrieved successfully",
      })
    } catch (error) {
      next(error)
    }
  }
}