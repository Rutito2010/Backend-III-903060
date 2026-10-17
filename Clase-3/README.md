# ShipNow API

API de logística con Node.js, Express y MongoDB (Backend III — Coderhouse).

Arquitectura por capas y módulo de **mocking** para users, orders y deliveries
(base lista para seguir evolucionando el proyecto).

## Requisitos

- Node.js 18+
- MongoDB local o remoto

## Instalación

```bash
npm install
cp .env.example .env
```

Editá `.env` y levantá:

```bash
npm run dev
```

Servidor en `http://localhost:8080` (salvo que cambies `PORT`).

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto (default `8080`) |
| `MONGODB_URI` | Conexión a MongoDB |
| `JWT_SECRET` | Secreto JWT / config interna |
| `NODE_ENV` | `development` \| `test` \| `production` |
| `LOG_LEVEL` | Nivel de logs |

Los endpoints de mocking **no** se montan si `NODE_ENV=production`.

## Arquitectura

```
Request → Router → Controller → Service → Repository → Model
```

La generación de datos vive en `src/mocks/`. El service valida `qty`, orquesta
bcrypt/insert y el repository persiste. El router no conoce Mongoose.

## Mocking

| Método | Ruta | Qué hace |
| --- | --- | --- |
| `GET` | `/api/mocks/users?qty=N` | Genera N users sin persistir |
| `GET` | `/api/mocks/orders?qty=N` | Preview de orders |
| `GET` | `/api/mocks/deliveries?qty=N` | Preview de deliveries |
| `POST` | `/api/mocks/seed/users?qty=N` | Inserta users (password hasheada) |
| `POST` | `/api/mocks/seed/orders?qty=N` | Inserta orders (requiere customers) |
| `POST` | `/api/mocks/seed/deliveries?qty=N` | Inserta deliveries (requiere orders) |
| `POST` | `/api/mocks/seed?qty=N` | Seed encadenado users → orders → deliveries |

- `qty` default: `10`. Mínimo `1`, máximo `100`.
- Password de seeds de users: `coder123` (bcrypt en DB).

## Otros endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| CRUD | `/api/users` | Usuarios |
| CRUD | `/api/orders` | Pedidos |
| CRUD | `/api/deliveries` | Entregas |

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desarrollo |
| `npm start` | Producción |

## Postman

Importá `postman/ShipNow-Clase-3.postman_collection.json` y
`postman/ShipNow-Clase-3.postman_environment.json`, y seleccioná el environment
`ShipNow Clase-3 Local`.
