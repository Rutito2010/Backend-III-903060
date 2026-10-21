import { config } from "dotenv";
import userMockRepository from "./repositories/user.mock.repository";
import userRepository from "./repositories/user.repository";

const enviroment = config.nodeEnv;
let servicio;

if (enviroment === "development") {
  servicio = new usersService(userMockRepository);
} else {
  servicio = new usersService(userRepository);
}

export { servicio };
