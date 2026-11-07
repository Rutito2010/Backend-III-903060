# Clase 6 — Testing de APIs con Mocha, Chai y Supertest

Guía para dar la clase en vivo sobre ShipNow, partiendo del proyecto sin nada de testing.

Cada paso sigue el mismo formato:

- **Decir:** la idea para explicar.
- **Hacer:** lo que se escribe o se ejecuta en pantalla.
- **Esperado:** lo que tiene que aparecer.
- **Ojo:** lo que te puede sorprender en vivo.

## Mapa de la clase

| Bloque | Tema | Archivos que se tocan | `npm test` al terminar |
| --- | --- | --- | --- |
| 1 | Por qué testear | ninguno (el cambio del demo se revierte) | no existe todavía |
| 2 | Herramientas y anatomía de un test | ninguno | no existe todavía |
| 3 | Preparar el proyecto | `package.json`, `package-lock.json`, `.mocharc.json`, `.env.test`, `.gitignore`, `src/config/index.js`, `test/setup.js`, `src/utils/logger.js` | `No test files found` |
| 4 | Pruebas generales | `test/app.test.js` | 4 passing |
| 5 | Tests de usuarios | `test/users.test.js` | 16 passing |
| 6 | Errores reales | `test/users.test.js`, `src/repositories/users.repo.js` | 16 passing + 1 failing, y con el fix 17 passing |
| 7 | Swagger vs tests | `src/docs/user.yaml`, `test/users.test.js` (opcional) | 17 passing |
| 8 | Cierre | ninguno | 17 passing |

---

## Antes de la clase

### 1. Reset seguro

> **Ojo:** `git reset --hard` y `git restore` no borran los archivos sin trackear, así que `test/`, `.env.test` y `.mocharc.json` seguirían ahí. Y **no uses `git clean`**: también borraría esta guía y `Test Arq.png`, que tampoco están trackeados.

Desde la raíz del proyecto:

```bash
# 1) Backup afuera del repo (compose.yaml queda afuera a propósito, ver Anexo A)
mkdir -p ../clase6-backup
cp -r clase6.md "Test Arq.png" .env.test .mocharc.json test ../clase6-backup/
git diff -- . ':!compose.yaml' > ../clase6-backup/cambios-tracked.diff

# 2) Volver los archivos trackeados al último commit
git restore .

# 3) Borrar solo lo que se va a crear en vivo
rm -rf test .mocharc.json .env.test

# 4) Sacar mocha, chai, supertest y cross-env de node_modules
npm ci
```

Verificación:

```bash
git status --short   # solo debe mostrar "Test Arq.png" y clase6.md
npm test             # debe decir: Missing script: "test"
```

### 2. Elegir la base de test

Se usa la misma configuración de código con cualquiera de las dos opciones. Solo cambia la URI del Paso 7.

| | Opción A: Mongo local | Opción B: Atlas |
| --- | --- | --- |
| Password en pantalla | No | **Sí, si abrís `.env.test`** |
| Depende de internet durante los tests | No | Sí |
| Estado | Probada en una copia del proyecto | La que tenías funcionando |

**Recomendación para proyectar: Opción A.** Para levantarla:

```bash
docker run -d --rm --name mongo-clase -p 27017:27017 mongo:7
```

> **Ojo:** tiene que ser `mongo:7`. `mongo:8` no arranca en esta máquina: se cierra con `MongoDB cannot start: Linux kernel versions 6.19 and newer has a known incompatibility`. Por eso tampoco funciona el servicio `mongo` de `compose.yaml`.

Con la Opción B, no muestres el archivo: copialo con `cp ../clase6-backup/.env.test .` y explicá la plantilla del Paso 7.

### 3. Checklist antes de empezar

- [ ] Reset hecho y verificado.
- [ ] Backup en `../clase6-backup/`.
- [ ] Docker Compose detenido, porque no se usa en esta clase: `docker compose stop`.
- [ ] `npm run dev` muestra `MongoDB conectado (development)` y `Servidor en puerto 8080`.
- [ ] Mongo local levantado (Opción A) o IP habilitada en Atlas (Opción B).
- [ ] Tu `API_KEY` de `.env` a mano, sin mostrarla, para el demo del Paso 1.
- [ ] Node 20.19+ o 22.12+. Avisales a los alumnos: Mocha 12 declara esas versiones como requisito, aunque el README diga Node 18+.

---

# Bloque 1 — Por qué testear

## Paso 1. Un cambio que nadie ve

**Decir:** un cambio en un endpoint puede romper a quien lo consume sin que el servidor se queje.

**Hacer:** con `npm run dev` corriendo, en `src/controllers/users.controller.js`, dentro de `findAll`:

```javascript
// antes
res.json({ status: 'success', payload: users });
// después
res.json({ status: 'success', users: users });
```

Guardar y consultar el endpoint, desde Swagger (`http://localhost:8080/api/docs`) o con:

```bash
curl -H 'x-api-key: TU_API_KEY' http://localhost:8080/api/users
```

**Esperado:** status 200, nodemon reinicia sin errores y la respuesta trae `users` en vez de `payload`. Nada avisa, pero un frontend que lee `payload` ya está roto.

**Hacer:** revertir el cambio. Este mismo demo vuelve en el Paso 20, ya con tests.

## Paso 2. Test unitario vs test funcional

**Decir:** usamos `src/services/orders.service.js` como ejemplo de los dos tipos.

| | Unitario | Funcional |
| --- | --- | --- |
| Ejemplo | `calculateShippingCost()` | `POST /api/orders` |
| Qué prueba | Una función aislada | El flujo completo |
| Necesita HTTP o base | No | Sí |
| Velocidad | Muy rápido | Más lento |

**Mostrar** `calculateShippingCost`: recibe datos, devuelve un número y no toca nada externo.

| Entrada | Resultado |
| --- | --- |
| `{ isProduction: false, shipmentValue: 1000, apiKey: 'x' }` | `10` |
| `{ isProduction: true, shipmentValue: 1000, apiKey: 'x' }` | `60` |
| `{ isProduction: true, shipmentValue: 1000 }` | lanza `Configuración inválida: falta API Key` |

**Mostrar** `POST /api/orders`: pasa por router, controller, service, repository y base. En esta clase vamos a escribir tests funcionales.

---

# Bloque 2 — Herramientas

## Paso 3. Mocha, Chai y Supertest

| Herramienta | Rol |
| --- | --- |
| **Mocha** | Organiza y ejecuta los tests |
| **Chai** | Valida los resultados |
| **Supertest** | Simula requests HTTP |

**Mostrar:** `Test Arq.png`.

> **Ojo:** la imagen dice `tests/setup.js`, pero la carpeta real es `test/` (singular), que además es la que Mocha busca por defecto. Aclaralo al mostrarla.

## Paso 4. Anatomía de un test

Este código solo se muestra, todavía no se escribe:

```javascript
describe('Users API', () => {
  it('debería devolver la lista de usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('x-api-key', API_KEY);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.an('array');
  });
});
```

| Parte | Viene de | Qué hace |
| --- | --- | --- |
| `describe(descripcion, callback)` | Mocha | Agrupa tests relacionados en una *test suite*. Se puede anidar. |
| `it(descripcion, callback)` | Mocha | Define un *test case*. Misma sintaxis que `describe`. |
| `request(app).get(...)` | Supertest | Hace la petición directo a la app, sin levantar un servidor. |
| `expect(...).to.equal(...)` | Chai | Compara el resultado con lo esperado. |

**Decir:** se lee casi como una frase porque está basado en BDD: "debería devolver la lista de usuarios".

---

# Bloque 3 — Preparar el proyecto

## Paso 5. Instalar dependencias

```bash
npm install -D mocha chai supertest cross-env
```

**Decir:** van con `-D` porque solo se usan en desarrollo. `cross-env` permite definir `NODE_ENV` igual en Windows, Mac y Linux.

**Esperado:** aparecen en `devDependencies`. Versiones probadas: mocha 12.0.3, chai 6.3.0, supertest 7.3.1 y cross-env 10.1.0.

## Paso 6. Script de test y configuración de Mocha

**Hacer:** en `package.json`, dentro de `scripts`, agregar `test`:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "test": "cross-env NODE_ENV=test mocha"
}
```

**Hacer:** crear `.mocharc.json` en la raíz:

```json
{
  "spec": "test/**/*.test.js",
  "require": ["test/setup.js"],
  "timeout": 10000
}
```

| Opción | Para qué sirve |
| --- | --- |
| `spec` | Dónde están los tests y cómo se llaman |
| `require` | Archivo que se carga antes de los tests |
| `timeout` | Tiempo máximo de cada test, en milisegundos |

> **Ojo:** no corras `npm test` todavía. `test/setup.js` no existe y Mocha falla con `ERR_MODULE_NOT_FOUND`.

## Paso 7. Variables de entorno de test

**Decir:** los tests crean y borran datos, así que nunca pueden usar la base de desarrollo.

**Hacer:** crear `.env.test` en la raíz.

Opción A, Mongo local:

```bash
MONGODB_URI=mongodb://localhost:27017/shipnow-test
NODE_ENV=test
JWT_SECRET=test_secret
API_KEY=test-api-key
```

Opción B, Atlas (plantilla, sin datos reales):

```bash
MONGODB_URI="mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/shipnow-test"
NODE_ENV=test
JWT_SECRET=test_secret
API_KEY=test-api-key
```

**Decir:** `PORT` no hace falta, porque Supertest no levanta un servidor. Lo importante es que el nombre de la base termine en `shipnow-test`.

**Hacer:** abrir `.gitignore` y agregar `.env.test` debajo de `.env`:

```text
.env
.env.test
```

> **Ojo:** el patrón `.env` no cubre `.env.test`, así que sin esta línea `git add .` subiría las credenciales. Hacelo desde el editor: `.gitignore` no termina en salto de línea, y `echo ".env.test" >> .gitignore` lo pegaría a la última línea.

**Verificar:**

```bash
git check-ignore .env.test   # debe imprimir: .env.test
```

## Paso 8. Hacer que la app cargue `.env.test`

**Decir:** crear el archivo no alcanza, porque la app sigue leyendo `.env`. Si no cambiamos esto, los tests irían contra la base de desarrollo.

**Hacer:** en `src/config/index.js`, reemplazar `dotenv.config();` por:

```javascript
// en test cargamos .env.test, en cualquier otro caso .env
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });
```

**Decir:** `NODE_ENV=test` llega desde el script de `package.json`, gracias a `cross-env`.

## Paso 9. Conectar, proteger y limpiar

**Decir:** este archivo corre una vez antes y una vez después de toda la suite. Se conecta a la base, verifica que sea la de test y la borra al terminar.

**Hacer:** crear `test/setup.js`:

```javascript
import mongoose from 'mongoose';
import config from '../src/config/index.js';

export const mochaHooks = {
  async beforeAll() {
    // Chequeamos que estamos trabajando en la base de test y no en otra.
    // Sin esta validación nos podríamos mandar una macana bastante grande.
    if (config.nodeEnv !== 'test' || !config.mongoUri.includes('test')) {
      throw new Error(
        `Tests abortados: NODE_ENV=${config.nodeEnv} y MONGODB_URI no parece de test`
      );
    }

    await mongoose.connect(config.mongoUri);
  },

  async afterAll() {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
};
```

**Decir:** el `dropDatabase` del final es justamente por lo que necesitamos esa validación. La vamos a ver funcionando en el Paso 15.

**Hacer:** correr `npm test`.

**Esperado:** `Error: No test files found: "test/**/*.test.js"`. Es correcto: la configuración funciona y solo faltan los tests.

## Paso 10. Silenciar los logs

**Decir:** en test no queremos ruido en la consola.

**Hacer:** en `src/utils/logger.js`, agregar la línea `silent`:

```javascript
const logger = winston.createLogger({
  level: "debug",
  // en test no queremos ruido en la consola
  silent: process.env.NODE_ENV === "test",
  format: winston.format.simple(),
  // ...transports igual que antes
});
```

> **Alternativa:** dejá este paso para después del Paso 12. Así los alumnos ven primero `info: api health endpoint` mezclado con los resultados y entienden por qué se silencia.

## Paso 11. Dos avisos antes de los tests

**Separación de app y server.** Mostrar `src/app.js` y `src/server.js`:

- `app.js` arma Express y lo exporta, sin `listen`.
- `server.js` conecta la base y hace `listen`.

**Decir:** gracias a esa separación, Supertest importa la app sin levantar un servidor. Ya estaba hecho, no hay que cambiar nada. La conexión a la base de los tests la maneja `test/setup.js`.

**Endpoint de logger.** Avisar que vamos a testear `/api/loggerTest`, que **nunca se escribió** en el proyecto. El test va a fallar a propósito.

---

# Bloque 4 — Pruebas generales sobre el sistema

## Paso 12. Primer test: health

**Hacer:** crear `test/app.test.js`:

```javascript
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import config from '../src/config/index.js';

describe('App: endpoints de soporte', () => {
  it('GET /api/health debería responder 200 con status ok', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'ok');
    expect(response.body).to.have.property('timestamp');
  });

  // Paso 13: los próximos tests van acá adentro
});
```

**Hacer:** `npm test`.

**Esperado:**

```text
  App: endpoints de soporte
    ✔ GET /api/health debería responder 200 con status ok

  1 passing
```

## Paso 13. Logger y Swagger

**Decir:** este endpoint no está escrito, así que va a dar error. Ya tenemos un test que señala algo que **no** hicimos y que deberíamos corregir.

**Hacer:** agregar dentro del mismo `describe`:

```javascript
  it('GET /api/loggerTest debería responder 200 y confirmar los logs', async () => {
    const response = await request(app)
      .get('/api/loggerTest')
      .set('x-api-key', config.apiKey);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('Logs generados correctamente');
  });

  it('GET /api/docs/ debería servir Swagger UI', async () => {
    const response = await request(app).get('/api/docs/');

    expect(response.status).to.be.oneOf([200, 301, 302]);
    expect(response.headers['content-type']).to.include('text/html');
  });
```

**Esperado:** 2 passing, 1 failing, con `AssertionError: expected 404 to equal 200`.

> **Ojo:** el test necesita el header `x-api-key`. Sin él falla igual, pero con un 401 en lugar del 404, y el mensaje confunde.

**Decidir en vivo:**

- **Opción 1, comentar el test.** Es como estaba tu proyecto y es la que siguen los números de esta guía.
- **Opción 2, implementar el endpoint.** Sumá 1 passing a todos los resultados que siguen. En `src/app.js`, entre `app.use('/api', apiKey);` y `app.use('/api', apiRouter);`:

```javascript
app.get('/api/loggerTest', (req, res) => {
  logger.debug('loggerTest: debug');
  logger.info('loggerTest: info');
  logger.warn('loggerTest: warn');
  logger.error('loggerTest: error');
  res.json({ status: 'success', message: 'Logs generados correctamente' });
});
```

## Paso 14. API key

**Hacer:** agregar al final de `test/app.test.js`, fuera del `describe` anterior:

```javascript
describe('App: API key', () => {
  it('debería responder 401 API_KEY_MISSING si no se envía x-api-key', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).to.equal(401);
    expect(response.body.status).to.equal('error');
    expect(response.body.code).to.equal('API_KEY_MISSING');
  });

  it('debería responder 401 API_KEY_INVALID si la key es incorrecta', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('x-api-key', 'una-key-cualquiera');

    expect(response.status).to.equal(401);
    expect(response.body.code).to.equal('API_KEY_INVALID');
  });
});
```

**Esperado:** 4 passing.

> **Ojo:** desde acá aparecen líneas como `Falta el header x-api-key` entre los resultados. No son fallas: vienen del `console.log(err.message)` en `src/middlewares/errorHandler.js:4`, que el `silent` de Winston no cubre. Si te preguntan, cambiarlo por `logger.error(err.message)` (importando el logger) deja la salida limpia.

## Paso 15. Ver la protección funcionando

**Decir:** ¿qué pasa si alguien corre Mocha sin `NODE_ENV=test`? Se cargaría `.env`, la base de desarrollo, y al final se ejecutaría `dropDatabase`.

**Hacer:**

```bash
npx mocha
```

**Esperado**, después de unos 10 segundos:

```text
  0 passing
  2 failing

  1) "before all" hook: beforeAll in "{root}":
     Error: Tests abortados: NODE_ENV=development y MONGODB_URI no parece de test

  2) "after all" hook: afterAll in "{root}":
     MongooseError: Connection operation buffering timed out after 10000ms
```

**Decir:** el error 1 es la protección, que frenó todo antes de conectarse. El error 2 es esperable: Mocha ejecuta `afterAll` igual, pero como nunca hubo conexión, `dropDatabase` no tiene dónde ejecutarse y se agota el tiempo. No se borró nada.

---

# Bloque 5 — Tests sobre usuarios

**Decir:** este es el núcleo de la clase. ¿Qué pasa si dos tests crean el mismo usuario? El segundo falla. **Cada test tiene que ser independiente y no debería afectar a otros.** Para asegurarlo usamos `beforeEach`.

## Paso 16. GET /api/users

**Hacer:** crear `test/users.test.js`:

```javascript
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import config from '../src/config/index.js';
import User from '../src/models/user.model.js';
import { generateMockUser } from '../src/mocks/users.mock.js';
import { USER_ROLES } from '../src/constants/index.js';

const API_KEY = config.apiKey;

describe('Users API', () => {
  // cada test arranca con la colección vacía: tests independientes y repetibles
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('GET /api/users', () => {
    it('debería devolver un array vacío si no hay usuarios', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('x-api-key', API_KEY);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.payload).to.be.an('array').that.is.empty;
    });

    it('debería devolver los usuarios existentes', async () => {
      await User.insertMany([generateMockUser(), generateMockUser()]);

      const response = await request(app)
        .get('/api/users')
        .set('x-api-key', API_KEY);

      expect(response.status).to.equal(200);
      expect(response.body.payload).to.have.lengthOf(2);
      expect(response.body.payload[0]).to.include.all.keys(
        '_id', 'firstName', 'lastName', 'email', 'role'
      );
    });
  });

  // Pasos 18 a 20: los próximos describe van acá adentro
});
```

**Esperado:** 6 passing.

## Paso 17. Demo de independencia (opcional)

> **Ojo:** comentar el `beforeEach` por sí solo **no rompe nada**: con la suite completa siguen todos en verde. Para que se vea el problema hacen falta dos tests que choquen.

**Hacer:** agregar temporalmente, justo después del `beforeEach`:

```javascript
  describe('DEMO independencia', () => {
    const ana = generateMockUser({ email: 'ana@demo.com' });

    it('test A: crea a Ana', async () => {
      const response = await request(app).post('/api/users').set('x-api-key', API_KEY).send(ana);
      expect(response.status).to.equal(201);
    });

    it('test B: también crea a Ana', async () => {
      const response = await request(app).post('/api/users').set('x-api-key', API_KEY).send(ana);
      expect(response.status).to.equal(201);
    });
  });
```

**Esperado con `beforeEach`:** todo en verde.

**Hacer:** comentar la línea `await User.deleteMany({});` y correr `npm test`.

**Esperado sin `beforeEach`:** 3 failing.

- `test B` falla con `expected 409 to equal 201`.
- Los dos tests de `GET /api/users` fallan por los usuarios que quedaron de antes.

**Decir:** tests que no tocamos se rompieron por culpa de otro. Eso es falta de independencia.

**Hacer:** descomentar la línea y borrar el `describe` de demo.

## Paso 18. POST /api/users

**Decir:** vamos a recorrer cinco casos:

1. Camino feliz.
2. Validación de datos obligatorios.
3. Email único.
4. Intento de crear un admin.
5. JSON roto.

**Hacer:** agregar dentro de `describe('Users API')`:

```javascript
  describe('POST /api/users', () => {
    it('debería crear un usuario y responder 201', async () => {
      const newUser = generateMockUser({ role: USER_ROLES.CUSTOMER });

      const response = await request(app)
        .post('/api/users')
        .set('x-api-key', API_KEY)
        .send(newUser);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('success');
      expect(response.body.payload).to.have.property('_id');
      expect(response.body.payload.email).to.equal(newUser.email);
      expect(response.body.payload.role).to.equal(USER_ROLES.CUSTOMER);

      // no alcanza con la respuesta: verificamos que quedó persistido
      const inDb = await User.findById(response.body.payload._id);
      expect(inDb).to.not.be.null;
    });

    it('debería responder 400 VALIDATION_ERROR si faltan datos obligatorios', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('x-api-key', API_KEY)
        .send({ firstName: 'Solo nombre' });

      expect(response.status).to.equal(400);
      expect(response.body).to.include({ status: 'error', code: 'VALIDATION_ERROR' });
      expect(response.body).to.have.property('message');
    });

    it('debería responder 409 EMAIL_ALREADY_EXIST si el email ya existe', async () => {
      const existing = generateMockUser();
      await User.create(existing);

      const response = await request(app)
        .post('/api/users')
        .set('x-api-key', API_KEY)
        .send(generateMockUser({ email: existing.email }));

      expect(response.status).to.equal(409);
      expect(response.body.code).to.equal('EMAIL_ALREADY_EXIST');
    });

    it('debería responder 403 ADMIN_CREATION_FORBIDDEN si se intenta crear un admin', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('x-api-key', API_KEY)
        .send(generateMockUser({ role: USER_ROLES.ADMIN }));

      expect(response.status).to.equal(403);
      expect(response.body.code).to.equal('ADMIN_CREATION_FORBIDDEN');
    });

    it('debería responder 400 INVALID_JSON si el body está mal formado', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('x-api-key', API_KEY)
        .set('Content-Type', 'application/json')
        .send('{"firstName": "Ana",');

      expect(response.status).to.equal(400);
      expect(response.body.code).to.equal('INVALID_JSON');
    });
  });
```

**Esperado:** 11 passing.

## Paso 19. GET /api/users/:id

**Decir:** 404 significa que el id es válido pero no existe. 400 significa que el id ni siquiera tiene formato válido.

**Hacer:** agregar dentro de `describe('Users API')`:

```javascript
  describe('GET /api/users/:id', () => {
    it('debería devolver el usuario si existe', async () => {
      const user = await User.create(generateMockUser());

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('x-api-key', API_KEY);

      expect(response.status).to.equal(200);
      expect(response.body.payload._id).to.equal(user._id.toString());
      expect(response.body.payload.email).to.equal(user.email);
    });

    it('debería responder 404 USER_NOT_FOUND si el usuario no existe', async () => {
      const fakeId = '665f4d0a8f9a1b001234abcd'; // ObjectId válido, pero no existe

      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('x-api-key', API_KEY);

      expect(response.status).to.equal(404);
      expect(response.body).to.include({ status: 'error', code: 'USER_NOT_FOUND' });
    });

    it('debería responder 400 INVALID_ID si el id no es un ObjectId', async () => {
      const response = await request(app)
        .get('/api/users/no-soy-un-id')
        .set('x-api-key', API_KEY);

      expect(response.status).to.equal(400);
      expect(response.body.code).to.equal('INVALID_ID');
    });
  });
```

**Esperado:** 14 passing.

## Paso 20. PUT, DELETE y cerrar el círculo

**Hacer:** agregar dentro de `describe('Users API')`:

```javascript
  describe('PUT /api/users/:id', () => {
    it('debería actualizar el usuario', async () => {
      const user = await User.create(generateMockUser());

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('x-api-key', API_KEY)
        .send({ firstName: 'Actualizado' });

      expect(response.status).to.equal(200);
      expect(response.body.payload.firstName).to.equal('Actualizado');
    });

    // Paso 21: el test del rol inválido va acá
  });

  describe('DELETE /api/users/:id', () => {
    it('debería eliminar el usuario', async () => {
      const user = await User.create(generateMockUser());

      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('x-api-key', API_KEY);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Usuario eliminado');
      expect(await User.findById(user._id)).to.be.null;
    });
  });
```

**Esperado:** 16 passing.

**Hacer:** repetir el cambio del Paso 1 (`payload: users` por `users: users` en `findAll`) y correr `npm test`.

**Esperado:** 2 failing, los dos de `GET /api/users`, con `expected undefined to be an array`.

**Decir:** es exactamente el mismo cambio que en el Paso 1 no vio nadie. Ahora lo atrapamos en segundos.

**Hacer:** revertir el cambio.

---

# Bloque 6 — Aparecen errores reales

## Paso 21. El test que encuentra un bug

**Decir:** hasta ahora todo pasó. Probemos algo que el modelo debería rechazar: un rol que no existe.

**Hacer:** agregar dentro de `describe('PUT /api/users/:id')`:

```javascript
    it('debería responder 400 VALIDATION_ERROR si el rol es inválido', async () => {
      const user = await User.create(generateMockUser());

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('x-api-key', API_KEY)
        .send({ role: 'superheroe' });

      expect(response.status).to.equal(400);
      expect(response.body.code).to.equal('VALIDATION_ERROR');
    });
```

**Esperado:** 16 passing, 1 failing:

```text
AssertionError: expected 200 to equal 400
```

**Decir:** el test está bien, el bug está en la app. La API aceptó un rol inválido.

## Paso 22. Encontrar la causa y corregirla

**Decir:** el modelo tiene `enum` en `role`, y en `POST` funciona porque `User.create()` corre las validaciones. `findByIdAndUpdate` **no las corre por defecto**.

**Hacer:** en `src/repositories/users.repo.js`, línea 28:

```javascript
// antes
return User.findByIdAndUpdate(id, userData, { new: true });
// después
return User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
```

**Esperado:** 17 passing.

**Decir:** el test queda como protección. Si alguien saca `runValidators`, vuelve a dar rojo.

> **Ojo:** el código responde bien, pero el mensaje dice `Faltan datos obligatorios` aunque el problema sea un rol inválido, porque `VALIDATION_ERROR` tiene un texto fijo. El test solo valida `code`.

## Extras: más bugs reales (si sobra tiempo o como tarea)

Estos comportamientos están comprobados contra la API. Los tests de abajo quedan **en rojo** porque los bugs siguen en el código. Si querés cerrar en verde, usá `it.skip` o no los agregues.

| Caso | Hoy responde | Debería responder |
| --- | --- | --- |
| `PUT` con `role: 'admin'` | 200, el usuario pasa a ser admin | 403, igual que en `POST` |
| `PUT` con un email que ya existe | 500 `INTERNAL_SERVER_ERROR` | 409 `EMAIL_ALREADY_EXIST` |
| `POST` y `GET` de usuarios | Devuelven `password`, guardada en texto plano | No devolverla y guardarla hasheada |

```javascript
    it('no debería permitir ascender a admin por PUT', async () => {
      const user = await User.create(generateMockUser({ role: USER_ROLES.CUSTOMER }));

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('x-api-key', API_KEY)
        .send({ role: USER_ROLES.ADMIN });

      expect(response.status).to.equal(403);
    });

    it('debería responder 409 si el email ya lo usa otro usuario', async () => {
      const first = await User.create(generateMockUser());
      const second = await User.create(generateMockUser());

      const response = await request(app)
        .put(`/api/users/${second._id}`)
        .set('x-api-key', API_KEY)
        .send({ email: first.email });

      expect(response.status).to.equal(409);
    });

    it('no debería exponer la password', async () => {
      const user = await User.create(generateMockUser());

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('x-api-key', API_KEY);

      expect(response.body.payload).to.not.have.property('password');
    });
```

También como tarea: `src/repositories/orders.repo.js:24` y `src/repositories/deliveries.repo.js:24` tienen el mismo `findByIdAndUpdate` sin `runValidators`.

---

# Bloque 7 — Swagger vs tests

**Decir:** Swagger **describe** cómo debería comportarse la API. Los tests **comprueban** cómo se comporta. La documentación puede quedar vieja sin que nada falle; un test no.

**Hacer:** abrir `http://localhost:8080/api/docs` y comparar con los tests que escribimos.

| Tema | Swagger dice | Los tests muestran |
| --- | --- | --- |
| `GET /api/users/{id}` | `payload` es un **array** (`src/docs/user.yaml:99`) | `payload` es un **objeto** (`payload._id`) |
| API key | No documenta ningún 401 | Los tests del Paso 14 prueban los dos |
| `PUT` y `DELETE` | No están documentados | Funcionan y están testeados |

**Hacer (opcional):** corregir el primer caso en `src/docs/user.yaml`, en la respuesta 200 de `GET /api/users/{id}`:

```yaml
# antes
payload:
  type: array
  items:
    $ref: "#/components/schemas/User"
# después
payload:
  $ref: "#/components/schemas/User"
```

> **Ojo:** nodemon no vigila archivos `.yaml`. Escribí `rs` y Enter en la terminal de `npm run dev` para ver el cambio.

**Hacer (opcional):** fijar ese contrato en el test `debería devolver el usuario si existe`:

```javascript
expect(response.body.payload).to.be.an('object');
```

**Esperado:** 17 passing.

---

# Bloque 8 — Cierre

**Hacer:** correr `npm test` por última vez y después `git status`, para repasar todo lo que se agregó.

**Decir:**

1. Un cambio puede romper la API sin que nadie lo note (Paso 1), y un test lo detecta en segundos (Paso 20).
2. Mocha organiza, Chai valida y Supertest hace las peticiones.
3. Los tests usan su propia base, y una protección impide correrlos contra otra.
4. Cada test es independiente gracias a `beforeEach`.
5. Un test en rojo no siempre es un test mal escrito: en el Bloque 6 encontró un bug real.
6. Swagger y los tests se complementan: uno describe y el otro comprueba.

**Tarea sugerida:** resolver los extras del Bloque 6 y escribir tests para `orders`.

---

# Anexo A — Todos los cambios del proyecto

| Archivo | Cambio | Paso |
| --- | --- | --- |
| `package.json`, `package-lock.json` | Dependencias y script `test` | 5 y 6 |
| `.mocharc.json` | Nuevo | 6 |
| `.env.test` | Nuevo, no se sube a git | 7 |
| `.gitignore` | Agrega `.env.test` | 7 |
| `src/config/index.js` | Carga `.env.test` en test | 8 |
| `test/setup.js` | Nuevo | 9 |
| `src/utils/logger.js` | Agrega `silent` | 10 |
| `test/app.test.js` | Nuevo | 12 a 14 |
| `test/users.test.js` | Nuevo | 16 a 21 |
| `src/repositories/users.repo.js` | Agrega `runValidators` | 22 |
| `src/app.js` | Solo si implementás `loggerTest` | 13 |
| `src/docs/user.yaml` | Opcional | Bloque 7 |

**`compose.yaml` no se cambia en clase.** En tu versión previa al reset, `PORT` estaba en `8081`, pero el mapeo es `3000:8080`, así que el puerto 3000 no llegaba a la app. Los tests no lo necesitan, y por eso queda afuera del backup.

# Anexo B — Problemas frecuentes

| Síntoma | Causa | Solución |
| --- | --- | --- |
| `Missing script: "test"` | Falta el script | Paso 6 |
| `ERR_MODULE_NOT_FOUND` con `test/setup.js` | `.mocharc.json` existe pero `setup.js` no | Paso 9 |
| `No test files found` | No hay archivos `*.test.js` en `test/` | Normal hasta el Paso 12. Revisá que la carpeta sea `test/` y no `tests/` |
| `Tests abortados: NODE_ENV=test y MONGODB_URI no parece de test` | La app sigue leyendo `.env` | Paso 8 |
| `Tests abortados: NODE_ENV=development...` | Se corrió `npx mocha` en vez de `npm test` | Usar `npm test` |
| Error de `afterAll` con `buffering timed out` | `afterAll` corre aunque `beforeAll` haya fallado | Mirar el primer error, que es el real |
| Timeout en `before all` | No se llega a la base | Revisar el contenedor `mongo-clase` o la IP en Atlas |
| `info: api health endpoint` entre los resultados | Falta el `silent` | Paso 10 |
| Mensajes de error entre tests que pasan | `console.log` en `errorHandler.js:4` | Es normal, ver Paso 14 |
| `expected 401 to equal 200` en `loggerTest` | Falta el header `x-api-key` | Paso 13 |
| `MongoDB cannot start: Linux kernel versions 6.19...` | `mongo:8` en este kernel | Usar `mongo:7` |
| `getaddrinfo EAI_AGAIN mongo` en Docker | El contenedor `mongo` de compose no arrancó | Usar `npm run dev` en la máquina |

# Anexo C — Plan de rescate

Si algo se traba en vivo y necesitás volver al estado completo. **Esto descarta lo que hiciste en la clase:**

```bash
git restore .
cp -r ../clase6-backup/test ../clase6-backup/.mocharc.json ../clase6-backup/.env.test .
git apply ../clase6-backup/cambios-tracked.diff
npm ci
npm test
```

**Esperado:** 16 passing, 1 failing (el rol inválido). Desde ahí seguís en el Paso 22.

> **Ojo:** el `.env.test` del backup tiene las credenciales reales de Atlas y `.gitignore` vuelve a su versión del commit si hiciste `git restore .`. Agregá `.env.test` de nuevo antes de cualquier `git add`.
