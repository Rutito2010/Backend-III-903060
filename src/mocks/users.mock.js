import { faker } from '@faker-js/faker';
import { USER_ROLES, MOCK_LIMITS } from '../constants/index.js';

const MOCKABLE_ROLES = [
  USER_ROLES.CUSTOMER,
  USER_ROLES.DRIVER,
  USER_ROLES.STORE
];

// arma un user compatible con el modelo (no persiste)
export const generateMockUser = (overrides = {}) => {
  const role = overrides.role || faker.helpers.arrayElement(MOCKABLE_ROLES);
  const firstName = overrides.firstName || faker.person.firstName();
  const lastName = overrides.lastName || faker.person.lastName();

  return {
    firstName,
    lastName,
    email:
      overrides.email ||
      faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: overrides.password || MOCK_LIMITS.DEFAULT_PASSWORD,
    role,
    isAvailable:
      role === USER_ROLES.DRIVER
        ? overrides.isAvailable ?? faker.datatype.boolean()
        : true,
    documents: overrides.documents || []
  };
};

export const generateMockUsers = (qty = MOCK_LIMITS.DEFAULT_QTY) => {
  return Array.from({ length: qty }, () => generateMockUser());
};
