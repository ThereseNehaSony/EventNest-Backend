import { IUpdateStatusUseCase,IUpdateUserUseCase } from "../../domain/UseCaseInterface"
import { IDependencies } from "./IDependencies";

export interface IUseCases {
  updateStatusUseCase: (dependencies: IDependencies) => IUpdateStatusUseCase;
  updateUserUseCase: (dependencies: IDependencies) => IUpdateUserUseCase;
}