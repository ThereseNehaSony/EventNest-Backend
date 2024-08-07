
import { IGetAllCategoriesUseCase } from "../../domain/IUseCases/IGetAllCategoriesUseCse";
import { IDependencies } from "./IDependencies";
export interface IUseCases {
 
  getAllCategoriesUseCase: (dependencies: IDependencies) => IGetAllCategoriesUseCase;
}