
import { Request, Response, Router } from "express";
import { authenticate } from "../../middleware/authMiddleware";
import { controllers } from "../../presentation/controllers";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { getCategories, addCategory ,updateCategoryStatus,getActiveCategories} from '../../presentation/controllers/categoryController';
import { getEventsByHostName } from "../../presentation/controllers/getEvents";
//import upload from "../../utils/uploadMiddleware";
import { getEventById ,publishEvent,updateEventStatus,updateEvent,bookEvent,getUpcomingEvents, getBookingDetails, saveBooking, getPastEvents, cancelBooking, verifyPaymentController, getAttendees, savedOnlineBooking, searchEvents} from "../../presentation/controllers/event";
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

export const adminRoutes = (dependencies: IDependencies) => {

    const {
       getAllCategories,
       addEvent,
       getAllEvents,
    } = controllers(dependencies);

    const router = Router();

    router.get('/show-categories', getActiveCategories);
    
    router.route('/get-categories').get(getAllCategories)
    router.route('/add-event').post(addEvent)
   
    router.route("/getAllEvents").get(getAllEvents);
    router.get('/:eventId', getEventById);

    router.post('/add-category',  addCategory);
    router.get('/get-categories', getCategories);
    router.post('/update-category-status', updateCategoryStatus);
    router.get('/host/:hostName', getEventsByHostName);
    router.post('/admin/:eventId/:action', updateEventStatus);

    router.patch('/:eventId/publish', publishEvent )
    router.patch('/:eventId', updateEvent);
    router.post('/register',bookEvent)

    router.get('/get-upcoming-events/:userName',getUpcomingEvents)
    router.get('/get-past-events/:userName',getPastEvents)
   router.get('/booking/:bookingId',getBookingDetails)
   router.post('/booking/save-booking',saveBooking);
   router.post('/cancel/:bookingId',cancelBooking)
   router.get('/verify-payment', verifyPaymentController); 
   router.get('/:eventId/attendees',getAttendees);
   router.post('/booking/save-online',savedOnlineBooking)
   router.get('/search/event', searchEvents);

   return router;
}