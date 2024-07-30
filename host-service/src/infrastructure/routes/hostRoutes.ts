import { Router } from "express";
import { authenticate } from "../../middleware/authMiddleware";
//import { getUserDetails } from "../../presentation/controllers/userDetails";
import { controllers } from "../../presentation/controllers";
import { getUserDetails ,getHostDetails,updateHostStatus} from "../../presentation/controllers/HostDetails";
import { IDependencies } from "../../application/interfaces/IDependencies";
export const hostRoutes = (dependencies: IDependencies) => {
 
  const {updateHost} = controllers(dependencies);



  const router = Router();

 
  router.route("/updateHost").post(updateHost);
  router.get('/details',authenticate,getUserDetails);
  router.route('/hostDetails/:id').get(getHostDetails);

  router.post('/updateStatus', updateHostStatus);



  return router;
};