import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

// si falta algo crítico, mejor fallar acá
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(
      `Falta configurar la variable de entorno: ${envVar}\n` +
      `Revisá el archivo .env (copiado desde .env.example)`
    );
  }
});

const config = {
  port: parseInt(process.env.PORT, 10) || 8080,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'debug'
};

export default config;
