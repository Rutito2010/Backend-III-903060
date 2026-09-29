import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import {config} from "./config/config.js"
const app = express();

const PORT = config.port;
const JWT_SECRET = config.jwtSecret;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), secret: JWT_SECRET });
});

app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

mongoose.connect(config.mongoUri)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Servidor corriendo en puerto ' + PORT);
    });
  })
  .catch((error) => {
    console.log('Error de conexión', error);
  });
