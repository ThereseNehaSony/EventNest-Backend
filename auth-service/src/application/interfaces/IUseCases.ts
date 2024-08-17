import { ICheckUserEmailUseCase, ILoginUserUseCase, ISignupUserUseCase, IVerifyOtpUseCase,IIsExistUseCase,IUpdateUserUseCase } from "../../domain/useCaseInterfaces";
import { User } from "../../infrastructure/database/mongoDB/models/loginCredentials";
import { IDependencies } from "./IDependencies";

export interface IUseCases {
    signupUserUseCase: (dependencies: IDependencies) => ISignupUserUseCase;
    checkUserEmailUseCase: (dependencies:IDependencies) => ICheckUserEmailUseCase;
    verifyOtpUseCase: (dependencies: IDependencies) => IVerifyOtpUseCase;
    loginUserUseCase: (dependencies: IDependencies) => ILoginUserUseCase;
    isExistUseCase: (dependencies: IDependencies) => IIsExistUseCase; 
    updateUserUseCase: (dependencies: IDependencies) => IUpdateUserUseCase;
}

