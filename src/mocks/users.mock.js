import { USER_ROLES } from "../constants/constants.js";
import { faker } from "@faker-js/faker";

export const generateMockUser = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: USER_ROLES.USER,
});

export const generateMockUsers = () => {
  const allUsers = [];

  for (let i = 0; i < 20; i++) {
    let user = generateMockUser();
    allUsers.push(user);
  }

  return allUsers;
};
