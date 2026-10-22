import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

router.get('/users', mocksController.getUsers);
router.get('/orders', mocksController.getOrders);
router.get('/deliveries', mocksController.getDeliveries);

router.post('/seed/users', mocksController.seedUsers);
router.post('/seed/orders', mocksController.seedOrders);
router.post('/seed/deliveries', mocksController.seedDeliveries);
router.post('/seed', mocksController.seedAll);

export default router;
