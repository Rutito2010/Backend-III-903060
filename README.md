# ShipNow API

API de ShipNow con Node.js, Express y MongoDB.

## Requisitos

- Node.js 18+
- MongoDB en local

## Instalación

```bash
npm install
npm run dev
```

La app se conecta a `mongodb://localhost:27017/shipnow` (valor en `src/server.js`) y escucha en el puerto `8080`.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET/POST | `/api/users` | Listar / crear usuarios |
| GET/PUT/DELETE | `/api/users/:id` | Obtener / actualizar / eliminar |
| GET | `/api/products` | Listar productos con stock (`?all=true` incluye sin stock) |
| POST | `/api/products` | Crear producto |
| GET/PUT/DELETE | `/api/products/:id` | Obtener / actualizar / eliminar |
| GET | `/api/products/:id/shipping-cost` | Cotizar el envío de un producto |


## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desarrollo con nodemon |
| `npm start` | Producción |
