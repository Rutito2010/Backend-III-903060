import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import mocksRouter from './routes/mocks.router.js';
import config from './config/index.js';
import errorHandler from "./middlewares/errorHandler.js"
import routeNotFound from './middlewares/routNotFoundHandler.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

// mocks solo en desarrollo / test
if (config.nodeEnv !== 'production') {
  app.use('/api/mocks', mocksRouter);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(routeNotFound);

app.use(errorHandler);

export default app;
