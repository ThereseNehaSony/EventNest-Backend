import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { dependencies } from "../../config/dependencies";
import { HttpStatusCode } from "../../utils/statusCodes/httpStatusCode";



export const addEventController = (dependencies:IDependencies)=>{
   const { 
    useCases :{addEventUseCase},
   } = dependencies

   return async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const data = req.body;
        console.log(data,"data from frntend...")
        console.log(req.body,"body.........")
        const event = await addEventUseCase(dependencies).execute(data)
        res.status(HttpStatusCode.OK).json({
            success:true,
            event:event,
            messages: "Event Added"
        })
    } catch (error:any) {
        next(error)
    }
   }
}

