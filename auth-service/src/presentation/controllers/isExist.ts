
import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { UserEntity } from "../../domain/entities";
import { HttpStatusCode } from "../../utils/statusCodes/httpStatusCodes";

export const isExistController = (dependencies: IDependencies) => {
    const { useCases: { isExistUseCase } } = dependencies;

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string | undefined = req.cookies.user_jwt;
            if (!token) {
                throw new Error('JWT must be provided');
            }
            console.log('JWT from cookie:', token);

            const user: UserEntity | null = await isExistUseCase(dependencies).execute(token);
            if (!user) {
                throw new Error('User not found');
            } else if (user.status === "blocked") {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ status: "ok", data: null });
            } else {
                return res.status(HttpStatusCode.OK).json({ status: "ok", data: user });
            }
        } catch (error) {
            console.error('Error in isExistController:', error);
            res.clearCookie("user_jwt", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });
            next(error);
        }
    }
}
