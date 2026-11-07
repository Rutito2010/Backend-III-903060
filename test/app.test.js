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
