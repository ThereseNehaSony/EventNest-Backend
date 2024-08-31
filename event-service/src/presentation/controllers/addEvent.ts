import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { dependencies } from "../../config/dependencies";
import { HttpStatusCode } from "../../utils/statusCodes/httpStatusCode";
import logger from "../../utils/logger/logger";
import { success,error } from "../../utils/responseModel/responseModel";

export const addEventController = (dependencies:IDependencies)=>{
   const { 
    useCases :{addEventUseCase},
   } = dependencies

   return async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const data = req.body;
        logger.info(`${data},data from frontend`)
        
        
        const event = await addEventUseCase(dependencies).execute(data)
        res.status(HttpStatusCode.OK).json
        (success
            ("Event added successfully", 
            event, 
            HttpStatusCode.OK
        ));
    } catch (error:any) {
        next(error)
    }
   }
}

