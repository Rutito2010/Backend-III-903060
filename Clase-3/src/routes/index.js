import { Router } from 'express';
import usersRouter from './users.router.js';
import ordersRouter from './orders.router.js';
import deliveriesRouter from './deliveries.router.js';
const router = Router();

router.use('/users', usersRouter);
router.use('/orders', ordersRouter);
router.use('/deliveries', deliveriesRouter);

export default router;
