import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'API_KEY'];

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
  apiKey: process.env.API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'debug'
};

export default config;
