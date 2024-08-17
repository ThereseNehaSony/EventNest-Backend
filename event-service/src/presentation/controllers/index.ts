import { IDependencies } from "../../application/interfaces/IDependencies";
import { getAllCategoriesController } from "./getAllCategories";
import { addEventController } from "./addEvent";
import { getAllEventsController } from "./getAllEvents";

export const controllers = (dependencies: IDependencies) => {
    return {
        addEvent:addEventController(dependencies),
        getAllCategories: getAllCategoriesController(dependencies),
        getAllEvents: getAllEventsController(dependencies),
    }
}