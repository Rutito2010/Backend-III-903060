import bcrypt from 'bcrypt';
import usersRepo from '../repositories/users.repo.js';
import ordersRepo from '../repositories/orders.repo.js';
import deliveriesRepo from '../repositories/deliveries.repo.js';
import AppError from '../utils/errors.js';
import { MOCK_LIMITS, USER_ROLES } from '../constants/index.js';
import { generateMockUsers } from '../mocks/users.mock.js';
import { generateMockOrders } from '../mocks/orders.mock.js';
import { generateMockDeliveries } from '../mocks/deliveries.mock.js';

const parseQty = (rawQty) => {
  const qty = Number(rawQty ?? MOCK_LIMITS.DEFAULT_QTY);

  if (!Number.isInteger(qty)) {
    throw new AppError('qty debe ser un número entero', 400);
  }

  if (qty < MOCK_LIMITS.MIN_QTY) {
    throw new AppError(`qty mínimo: ${MOCK_LIMITS.MIN_QTY}`, 400);
  }

  if (qty > MOCK_LIMITS.MAX_QTY) {
    throw new AppError(`qty máximo: ${MOCK_LIMITS.MAX_QTY}`, 400);
  }

  return qty;
};

class MocksService {
  getUsers(rawQty) {
    const qty = parseQty(rawQty);
    return { qty, users: generateMockUsers(qty) };
  }

  getOrders(rawQty) {
    const qty = parseQty(rawQty);
    // preview sin DB: customer placeholder; el seed usa IDs reales
    const placeholderCustomer = '000000000000000000000001';
    return {
      qty,
      orders: generateMockOrders([placeholderCustomer], qty)
    };
  }

  getDeliveries(rawQty) {
    const qty = parseQty(rawQty);
    const placeholderOrder = '000000000000000000000002';
    return {
      qty,
      deliveries: generateMockDeliveries([placeholderOrder], [], qty)
    };
  }

  async seedUsers(rawQty) {
    const qty = parseQty(rawQty);
    const mocks = generateMockUsers(qty);

    const usersToInsert = await Promise.all(
      mocks.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    const inserted = await usersRepo.insertMany(usersToInsert);

    return {
      inserted: inserted.length,
      collection: 'users',
      users: inserted
    };
  }

  async seedOrders(rawQty) {
    const qty = parseQty(rawQty);
    const customers = await usersRepo.findByRole(USER_ROLES.CUSTOMER);

    if (!customers.length) {
      throw new AppError(
        'No hay customers en la base para generar pedidos. Seedé users primero.',
        400
      );
    }

    const customerIds = customers.map((user) => user._id);
    const ordersData = generateMockOrders(customerIds, qty);
    const inserted = await ordersRepo.insertMany(ordersData);

    return {
      inserted: inserted.length,
      collection: 'orders',
      orders: inserted
    };
  }

  async seedDeliveries(rawQty) {
    const qty = parseQty(rawQty);
    const orders = await ordersRepo.findAll();

    if (!orders.length) {
      throw new AppError(
        'No hay pedidos en la base para generar entregas. Seedé orders primero.',
        400
      );
    }

    const drivers = await usersRepo.findByRole(USER_ROLES.DRIVER);
    const availableDrivers = drivers.filter((driver) => driver.isAvailable);
    const orderIds = orders.map((order) => order._id);
    const driverIds = availableDrivers.map((driver) => driver._id);

    const deliveriesData = generateMockDeliveries(orderIds, driverIds, qty);
    const inserted = await deliveriesRepo.insertMany(deliveriesData);

    return {
      inserted: inserted.length,
      collection: 'deliveries',
      deliveries: inserted
    };
  }

  // users → orders → deliveries
  async seedAll(rawQty) {
    const users = await this.seedUsers(rawQty);
    const orders = await this.seedOrders(rawQty);
    const deliveries = await this.seedDeliveries(rawQty);

    return {
      users: { inserted: users.inserted, collection: users.collection },
      orders: { inserted: orders.inserted, collection: orders.collection },
      deliveries: {
        inserted: deliveries.inserted,
        collection: deliveries.collection
      }
    };
  }
}

export default new MocksService();
