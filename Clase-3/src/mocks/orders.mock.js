import { faker } from '@faker-js/faker';
import { ORDER_STATUS, DELIVERY_PRIORITY, MOCK_LIMITS } from '../constants/index.js';

export const generateMockOrder = (customerId, overrides = {}) => {
  const items = overrides.items || [
    {
      name: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 5 }),
      price: Number(faker.commerce.price({ min: 5, max: 80 }))
    },
    {
      name: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 3 }),
      price: Number(faker.commerce.price({ min: 5, max: 50 }))
    }
  ];

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = overrides.shippingCost ?? 10;
  const declaredValue = overrides.declaredValue ?? itemsTotal;

  return {
    customer: customerId,
    items,
    deliveryAddress:
      overrides.deliveryAddress ||
      faker.location.streetAddress({ useFullAddress: true }),
    total: overrides.total ?? itemsTotal + shippingCost,
    shippingCost,
    declaredValue,
    status: overrides.status || ORDER_STATUS.CREATED,
    priority: overrides.priority || DELIVERY_PRIORITY.NORMAL,
    delivery: overrides.delivery ?? null
  };
};

export const generateMockOrders = (customerIds, qty = MOCK_LIMITS.DEFAULT_QTY) => {
  if (!customerIds?.length) return [];

  return Array.from({ length: qty }, () => {
    const customerId = faker.helpers.arrayElement(customerIds);
    return generateMockOrder(customerId);
  });
};
