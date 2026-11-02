import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

/**
 * @openapi
 * /api/mocks/users:
 *  get:
 *      summary: generar usuarios mock sin persistencia
 *      tags: [Mocks]
 *      parameters:
 *        - in: query
 *          name: qty
 *          schema:
 *              type: integer
 *              minimun: 1
 *              maximum: 100
 *              defautl: 10
 *      responses:
 *          200:
 *              description: mocks generados
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  example: success
 *                              payload:
 *                                  type: array
 *                                  items:
 *                                      $ref: "#/components/schemas/User"
 */
router.get('/users', mocksController.getUsers);
router.get('/orders', mocksController.getOrders);
router.get('/deliveries', mocksController.getDeliveries);

router.post('/seed/users', mocksController.seedUsers);
router.post('/seed/orders', mocksController.seedOrders);
router.post('/seed/deliveries', mocksController.seedDeliveries);
router.post('/seed', mocksController.seedAll);

export default router;
