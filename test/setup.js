import mongoose from "mongoose";
import config from "../src/config/index.js";

export const mochaHooks = {
  async beforeAll() {
    // poner un freno de mano para evitar borrar otra base que no sea testing
    if (config.nodeEnv !== "test" || !config.mongoUri.includes("test")) {
      throw new Error(
        `Testing abortado porque no estamos trabajando en la base de datos de test: nodeEnv=${config.nodeEnv}`,
      );
    }

    await mongoose.connect(config.mongoUri);
  },

  async afterAll() {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  },
};
