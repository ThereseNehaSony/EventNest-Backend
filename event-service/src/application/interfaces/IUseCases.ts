
import { IGetAllCategoriesUseCase } from "../../domain/IUseCases/IGetAllCategoriesUseCse";
import { IAddEventUseCase } from "../../domain/IUseCases/IAddEventUseCase";
import { IGetAllEventsUseCase } from "../../domain/IUseCases/IGetAllEventsUseCase";
import { IDependencies } from "./IDependencies";
export interface IUseCases {
 
  addEventUseCase :(dependencies:IDependencies) => IAddEventUseCase;
  getAllCategoriesUseCase: (dependencies: IDependencies) => IGetAllCategoriesUseCase;
  getAllEventsUseCase: (dependencies: IDependencies) => IGetAllEventsUseCase;
}