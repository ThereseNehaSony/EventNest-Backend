
import { Request, Response, Router } from "express";
import { authenticate } from "../../middleware/authMiddleware";
import { controllers } from "../../presentation/controllers";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { getCategories, addCategory ,updateCategoryStatus,getActiveCategories} from '../../presentation/controllers/categoryController';
import { getEventsByHostName } from "../../presentation/controllers/getEvents";
//import upload from "../../utils/uploadMiddleware";
import { getEventById ,publishEvent,updateEventStatus} from "../../presentation/controllers/event";
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
    router.post('/add-event', upload.single('image'), async (req, res) => {
        console.log(req.body)
        try {
            
            const file = req.file;
    
            
            const {  caption } = req.body;
    
            
            console.log('Form Data:', req.body);
            console.log('Uploaded File:', file);
    
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
    
    
        
            res.status(201).json({ message: 'Event created successfully' });
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(500).json({ error: 'Error creating event' });
        }
    });

    router.post('/add-post',  async (req, res) => {
        
        
        
      console.log(req.body,'body')
     
      
      
        
        res.status(201)
      })
      
    router.route("/getAllEvents").get(getAllEvents);
    router.get('/:eventId', getEventById);

    router.post('/add-category',  addCategory);
    router.get('/get-categories', getCategories);
    router.post('/update-category-status', updateCategoryStatus);
    router.get('/host/:hostName', getEventsByHostName);
    router.post('/:eventId/:action', updateEventStatus);

    router.patch('/:eventId/publish', publishEvent )
    return router;
}