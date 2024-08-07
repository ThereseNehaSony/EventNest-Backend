import { IDependencies } from "../../application/interfaces/IDependencies";
import { getAllCategoriesController } from "./getAllCategories";

export const controllers = (dependencies: IDependencies) => {
    return {
        getAllCategories: getAllCategoriesController(dependencies),
    }
}