import { Router } from 'express';
import { listUsersController } from '../../presentation/controllers/listUsers';

const router = Router();

router.get('/users', listUsersController);


export default router;