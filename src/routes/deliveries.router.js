import { Router } from 'express';
import deliveriesController from '../controllers/deliveries.controller.js';
const router = Router();

router.get('/', deliveriesController.findAll);
router.get('/:id', deliveriesController.findById);
router.post('/', deliveriesController.create);
router.put('/:id', deliveriesController.update);
router.delete('/:id', deliveriesController.delete);

export default router;
