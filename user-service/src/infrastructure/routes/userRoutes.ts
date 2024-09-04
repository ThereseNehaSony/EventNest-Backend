import { Router } from "express";
import { authenticate } from "../../middleware/authMiddleware";
import { getUserDetails } from "../../presentation/controllers/userDetails";
import { controllers } from "../../presentation/controllers";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { walletPayment } from "../../presentation/controllers/wallet";
export const userRoutes = (dependencies: IDependencies) => {
  
  const { listUsers, updateStatus, listHosts, updateUser } = controllers(dependencies);
  
  const router = Router();

 
  // router.use(authenticate);

  router.route("/listUsers").get(listUsers);
  router.route("/listHosts").get(listHosts);
  router.route("/updateStatus").post(updateStatus);
  router.route("/updateUser").post(updateUser);

  
  router.get('/details', getUserDetails);

  router.post('/wallet/payment',walletPayment)
  return router;
};
