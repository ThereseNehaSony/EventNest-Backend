import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { Host } from "../../infrastructure/database/mongoDB/models/hostModel";

export const updateHostController = (dependencies: IDependencies) =>{

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
          const {id, phone,address,aadharNumber,bankAccountNumber} = req.body
          
          const response = await Host.findByIdAndUpdate(id,{phone,address, aadharNumber, bankAccountNumber}, {new:true})
          console.log("🚀 ~ file: updateUser.ts:11 ~ return ~ response:", response)
          res.json({
            success: true,
            data: response,
            message: " updated details successfully"
          })
       
          console.log("blocked calld.......")
          
        } catch (error) {
            next(error)
        }
    }
}