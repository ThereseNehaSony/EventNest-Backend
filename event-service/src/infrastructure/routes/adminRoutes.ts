
import { Request, Response, Router } from "express";
import { authenticate } from "../../middleware/authMiddleware";
import { controllers } from "../../presentation/controllers";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { getCategories, addCategory ,updateCategoryStatus,getActiveCategories} from '../../presentation/controllers/categoryController';
import { getEventsByHostName } from "../../presentation/controllers/getEvents";
import upload from "../../utils/uploadMiddleware";
import { getEventById ,updateEventStatus} from "../../presentation/controllers/event";
export const adminRoutes = (dependencies: IDependencies) => {

    const {
       getAllCategories,
       addEvent,
       getAllEvents,
    } = controllers(dependencies);

    const router = Router();

    router.get('/show-categories', getActiveCategories);
    
    router.route('/get-categories').get(getAllCategories)
    router.post('/add-event', upload.single('image'), addEvent)
    router.route("/getAllEvents").get(getAllEvents);
    router.get('/:eventId', getEventById);

    router.post('/add-category',  addCategory);
    router.get('/get-categories', getCategories);
    router.post('/update-category-status', updateCategoryStatus);
    router.get('/host/:hostName', getEventsByHostName);
    router.post('/:eventId/:action', updateEventStatus);

     
    return router;
}