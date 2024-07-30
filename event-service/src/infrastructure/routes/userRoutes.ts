// import { Router } from "express";
// import { controllers } from "../../presentation/controllers";
// import { IDependencies } from "../../application/interfaces/IDependencies";
// import { getCategories, addCategory } from '../../presentation/controllers/categoryController';
// export const userRoutes = (dependencies: IDependencies) => {
//   const {listUsers,updateStatus,listHosts,updateUser} = controllers(dependencies);
  

//   const router = Router();

//   router.route("/listUsers").get(listUsers);
//   router.route("/listHosts").get(listHosts);
//   router.route("/updateStatus").post(updateStatus);
//   router.route("/updateUser").post(updateUser);


//   router.get('/get-categories', getCategories);
//   router.post('/add-category', addCategory);

//   return router;
// };

import express from 'express';
import { getCategories, addCategory ,updateCategoryStatus} from '../../presentation/controllers/categoryController';
import multer from 'multer';

const router = express.Router();
const upload = multer(); // You can configure multer options if needed

// Route for adding a category
router.post('/add-category', upload.single('image'), addCategory);
router.get('/get-categories', getCategories);
router.put('/update-category-status', updateCategoryStatus);

export default router;

