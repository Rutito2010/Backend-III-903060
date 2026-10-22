import { Router } from 'express';
import ordersController from '../controllers/orders.controller.js';
const router = Router();

router.get('/', ordersController.findAll);
router.get('/:id', ordersController.findById);
router.post('/', ordersController.create);
router.put('/:id', ordersController.update);
router.delete('/:id', ordersController.delete);

export default router;
