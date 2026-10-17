import mocksService from '../services/mocks.service.js';

class MocksController {
  getUsers(req, res, next) {
    try {
      const result = mocksService.getUsers(req.query.qty);
      res.json({ status: 'success', payload: result.users });
    } catch (error) {
      next(error);
    }
  }

  getOrders(req, res, next) {
    try {
      const result = mocksService.getOrders(req.query.qty);
      res.json({ status: 'success', payload: result.orders });
    } catch (error) {
      next(error);
    }
  }

  getDeliveries(req, res, next) {
    try {
      const result = mocksService.getDeliveries(req.query.qty);
      res.json({ status: 'success', payload: result.deliveries });
    } catch (error) {
      next(error);
    }
  }

  async seedUsers(req, res, next) {
    try {
      const qty = req.query.qty ?? req.body?.qty;
      const result = await mocksService.seedUsers(qty);

      res.status(201).json({
        status: 'success',
        payload: {
          inserted: result.inserted,
          collection: result.collection
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async seedOrders(req, res, next) {
    try {
      const qty = req.query.qty ?? req.body?.qty;
      const result = await mocksService.seedOrders(qty);

      res.status(201).json({
        status: 'success',
        payload: {
          inserted: result.inserted,
          collection: result.collection
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async seedDeliveries(req, res, next) {
    try {
      const qty = req.query.qty ?? req.body?.qty;
      const result = await mocksService.seedDeliveries(qty);

      res.status(201).json({
        status: 'success',
        payload: {
          inserted: result.inserted,
          collection: result.collection
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async seedAll(req, res, next) {
    try {
      const qty = req.query.qty ?? req.body?.qty;
      const result = await mocksService.seedAll(qty);

      res.status(201).json({
        status: 'success',
        payload: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MocksController();
