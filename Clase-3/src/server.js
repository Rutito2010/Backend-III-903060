import mongoose from 'mongoose';
import app from './app.js';
import config from './config/index.js';

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`MongoDB conectado (${config.nodeEnv})`);

    app.listen(config.port, () => {
      console.log(`Servidor en puerto ${config.port}`);
    });
  } catch (error) {
    console.error('Error al iniciar:', error.message);
    process.exit(1);
  }
}

startServer();
