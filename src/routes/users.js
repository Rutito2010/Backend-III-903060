import { Router } from 'express';
import usersContoller from '../controllers/usersContoller.js';

const router = Router();

router.get('/', usersContoller.findAll);

router.get('/:id',usersContoller.findById);

router.post('/', usersContoller.create);

router.put('/:id',usersContoller.update);

router.delete('/:id',usersContoller.delete);

export default router;
