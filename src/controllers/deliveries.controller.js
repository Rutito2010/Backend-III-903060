import deliveriesService from '../services/deliveries.service.js';
class DeliveriesController {
  async findAll(req, res, next) {
    try {
      const deliveries = await deliveriesService.findAll();
      res.json({ status: 'success', payload: deliveries });
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const delivery = await deliveriesService.findById(req.params.id);
      res.json({ status: 'success', payload: delivery });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const newDelivery = await deliveriesService.create(req.body);
      res.status(201).json({ status: 'success', payload: newDelivery });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updatedDelivery = await deliveriesService.update(req.params.id, req.body);
      res.json({ status: 'success', payload: updatedDelivery });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await deliveriesService.delete(req.params.id);
      res.json({ status: 'success', message: 'Entrega eliminada' });
    } catch (error) {
      next(error);
    }
  }
}

export default new DeliveriesController();
