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

// import express from 'express';
// import { getCategories, addCategory ,updateCategoryStatus,getActiveCategories} from '../../presentation/controllers/categoryController';


// const router = express.Router();

// router.post('/add-category',  addCategory);
// router.get('/get-categories', getCategories);
// router.put('/update-category-status', updateCategoryStatus);
// router.get('/show-categories', getActiveCategories);

// export default router;

import { Request, Response, Router } from "express";
import { controllers } from "../../presentation/controllers";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { getCategories, addCategory ,updateCategoryStatus,getActiveCategories} from '../../presentation/controllers/categoryController';
export const adminRoutes = (dependencies: IDependencies) => {
    const {
       getAllCategories
    } = controllers(dependencies);

    const router = Router();
    router.route('/get-categories').get(getAllCategories)

    router.post('/add-category',  addCategory);
 router.get('/get-categories', getCategories);
 router.post('/update-category-status', updateCategoryStatus);
router.get('/show-categories', getActiveCategories);
    return router;
}