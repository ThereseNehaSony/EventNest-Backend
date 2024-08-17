import { Router } from "express";
import {authenticateJWT} from '../../middleware/authMiddleware';
import { IDependencies } from "../../application/interfaces/IDependencies";
import { controllers } from "../../presentation/controllers";
import {refreshTokenController, requestOtp, resetPassword, verifyOtp, changePassword,resendOtpController  } from "../../presentation/controllers/authController";
//const { forgotPassword, verifyOtp, resetPassword } = require('../../presentation/controllers/);
export const authRoutes = (dependencies: IDependencies) => {
    const { signup,login,
           isExist,
           logout,
           updateUser } = controllers(dependencies);

    const router = Router();

    router.route("/signup")
        .post(signup);

    router.route("/login")
        .post(login);

    router.route("/isExist")
        .get(isExist)

    router.route("/updateUser")
         .post(updateUser)

    router.route("/logout")
        .get(logout)

    router.route("/request-otp")
        .post(requestOtp)

    router.post('/verify-otp', verifyOtp);
    router.post('/reset-password', resetPassword);

    router.post('/change-password',authenticateJWT, changePassword);

    router.post("/send-otp", resendOtpController(dependencies));
    router.post('/refresh-token', refreshTokenController);
    return router;
}