import { faker } from '@faker-js/faker';
import { DELIVERY_STATUS, DELIVERY_PRIORITY, MOCK_LIMITS } from '../constants/index.js';

export const generateMockDelivery = (orderId, driverId = null, overrides = {}) => {
  const status =
    overrides.status ||
    (driverId ? DELIVERY_STATUS.ASSIGNED : DELIVERY_STATUS.PENDING);

  return {
    order: orderId,
    driver: driverId,
    status,
    priority: overrides.priority || DELIVERY_PRIORITY.NORMAL,
    assignedAt: driverId ? overrides.assignedAt ?? new Date() : null,
    deliveredAt: overrides.deliveredAt ?? null
  };
};

export const generateMockDeliveries = (
  orderIds,
  driverIds = [],
  qty = MOCK_LIMITS.DEFAULT_QTY
) => {
  if (!orderIds?.length) return [];

  const limitedQty = Math.min(qty, orderIds.length);

  return Array.from({ length: limitedQty }, (_, index) => {
    const orderId = orderIds[index];
    const driverId =
      driverIds.length > 0 ? faker.helpers.arrayElement(driverIds) : null;
    return generateMockDelivery(orderId, driverId);
  });
};
