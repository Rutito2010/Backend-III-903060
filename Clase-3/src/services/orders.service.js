import ordersRepo from '../repositories/orders.repo.js';
import usersRepo from '../repositories/users.repo.js';
import AppError from '../utils/errors.js';
import config from '../config/index.js';
import { ORDER_STATUS, DELIVERY_PRIORITY } from '../constants/index.js';

export function calculateShippingCost({ isProduction, shipmentValue, apiKey }) {
  if (!apiKey) {
    throw new AppError('Configuración inválida: falta API Key', 500);
  }

  if (isProduction) {
    return 50 + shipmentValue * 0.01;
  }

  return 10;
}
class OrdersService {
  async findAll(filter = {}) {
    return ordersRepo.findAll(filter);
  }

  async findById(id) {
    const order = await ordersRepo.findById(id);
    if (!order) {
      throw new AppError('Pedido no encontrado', 404);
    }
    return order;
  }

  async create(orderData) {
    const customer = await usersRepo.findById(orderData.customer);
    if (!customer) {
      throw new AppError('El cliente especificado no existe', 400);
    }
    if (!orderData.items || orderData.items.length === 0) {
      throw new AppError('El pedido debe tener al menos un item', 400);
    }
    const itemsTotal = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    const declaredValue = orderData.declaredValue || itemsTotal;
    const shippingCost = calculateShippingCost({
      isProduction: config.nodeEnv === 'production',
      shipmentValue: declaredValue,
      apiKey: config.jwtSecret
    });

    const newOrder = await ordersRepo.create({
      ...orderData,
      declaredValue,
      shippingCost,
      total: itemsTotal + shippingCost,
      status: ORDER_STATUS.CREATED,
      priority: orderData.priority || DELIVERY_PRIORITY.NORMAL
    });

    return newOrder;
  }

  async update(id, orderData) {
    const updatedOrder = await ordersRepo.update(id, orderData);
    if (!updatedOrder) {
      throw new AppError('Pedido no encontrado', 404);
    }
    return updatedOrder;
  }

  async delete(id) {
    const deletedOrder = await ordersRepo.delete(id);
    if (!deletedOrder) {
      throw new AppError('Pedido no encontrado', 404);
    }
    return deletedOrder;
  }
}

export default new OrdersService();
