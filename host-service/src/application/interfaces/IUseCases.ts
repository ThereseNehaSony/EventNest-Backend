import { IUpdateHostUseCase } from "../../domain/IUseCases"
import { IDependencies } from "./IDependencies";

export interface IUseCases {
 // updateStatusUseCase: (dependencies: IDependencies) => IUpdateStatusUseCase;
  updateHostUseCase: (dependencies: IDependencies) => IUpdateHostUseCase;
}