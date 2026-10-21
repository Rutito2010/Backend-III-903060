import { Router } from 'express';
import mockController from '../controllers/mockController.js';

const router = Router();

router.get('/user', mockController.getUser);
router.get('/users', mockController.getUsers);
// router.post('/user', mockController.createUsers);

export default router;
