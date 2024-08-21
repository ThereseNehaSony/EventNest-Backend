import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { HttpStatusCode } from "../../utils/statusCodes/httpStatusCodes";

export const logoutController = (dependencies: IDependencies) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("logged out...........")
            res.clearCookie("user_jwt",{
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });
            res.status(HttpStatusCode.OK).json({message:"Logged out"});
        } catch (error : any) {
            next(error)
        }
    }
}