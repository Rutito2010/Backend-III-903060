import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import mocksRouter from './routes/mocks.router.js';
import config from './config/index.js';
import errorHandler from "./middlewares/errorHandler.js"
import routeNotFound from './middlewares/routNotFoundHandler.js';
import logger from './utils/logger.js';
import swaggerSpecs from './docs/swagger.config.js';
import swaggerUi from "swagger-ui-express"
import apiKey from './middlewares/apiKey.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  swaggerOptions: { persistAuthorization: true }
}));

app.get('/api/health', (req, res) => {
  logger.info('api health endpoint');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', apiKey);
app.use('/api', apiRouter);

// mocks solo en desarrollo / test
if (config.nodeEnv !== 'production') {
  app.use('/api/mocks', mocksRouter);
}

app.use(routeNotFound);

app.use(errorHandler);

export default app;
