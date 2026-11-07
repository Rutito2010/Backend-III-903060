import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import config from "../src/config/index.js";
import User from "../src/models/user.model.js";
import { generateMockUser } from "../src/mocks/users.mock.js";
import { USER_ROLES } from "../src/constants/index.js";

const API_KEY = config.apiKey;

describe("Users API", () => {
  // cada test arranca con la colección vacía: tests independientes y repetibles
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("GET /api/users", () => {
    it("debería devolver un array vacío si no hay usuarios", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("x-api-key", API_KEY);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.be.an("array").that.is.empty;
    });

    it("debería devolver los usuarios existentes", async () => {
      await User.insertMany([generateMockUser(), generateMockUser()]);

      const response = await request(app)
        .get("/api/users")
        .set("x-api-key", API_KEY);

      expect(response.status).to.equal(200);
      expect(response.body.payload).to.have.lengthOf(2);
      expect(response.body.payload[0]).to.include.all.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "role",
      );
    });
  });

  describe("POST /api/users", () => {
    it("debería crear un usuario y responder 201", async () => {
      const newuser = generateMockUser({ role: USER_ROLES.CUSTOMER });

      const response = await request(app)
        .post("/api/users")
        .set("x-api-key", API_KEY)
        .send(newuser);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.have.property("_id");
      expect(response.body.payload.email).to.equal(newuser.email);
      expect(response.body.payload.role).to.equal(user_roles.customer);

      // no alcanza con la respuesta: verificamos que quedó persistido
      const indb = await user.findbyid(response.body.payload._id);
      expect(indb).to.not.be.null;
    });

    it("debería responder 400 VALIDATION_ERROR si faltan datos obligatorios", async () => {
      const response = await request(app)
        .post("/api/users")
        .set("x-api-key", API_KEY)
        .send({ firstName: "Solo nombre" });

      expect(response.status).to.equal(400);
      expect(response.body).to.include({
        status: "error",
        code: "VALIDATION_ERROR",
      });
      expect(response.body).to.have.property("message");
    });

    it("debería responder 409 EMAIL_ALREADY_EXIST si el email ya existe", async () => {
      const existing = generateMockUser();
      await User.create(existing);

      const response = await request(app)
        .post("/api/users")
        .set("x-api-key", API_KEY)
        .send(generateMockUser({ email: existing.email }));

      expect(response.status).to.equal(409);
      expect(response.body.code).to.equal("EMAIL_ALREADY_EXIST");
    });

    it("debería responder 403 ADMIN_CREATION_FORBIDDEN si se intenta crear un admin", async () => {
      const response = await request(app)
        .post("/api/users")
        .set("x-api-key", API_KEY)
        .send(generateMockUser({ role: USER_ROLES.ADMIN }));

      expect(response.status).to.equal(403);
      expect(response.body.code).to.equal("ADMIN_CREATION_FORBIDDEN");
    });

    it("debería responder 400 INVALID_JSON si el body está mal formado", async () => {
      const response = await request(app)
        .post("/api/users")
        .set("x-api-key", API_KEY)
        .set("Content-Type", "application/json")
        .send('{"firstName": "Ana",');

      expect(response.status).to.equal(400);
      expect(response.body.code).to.equal("INVALID_JSON");
    });
  });

  describe("PUT /api/users/:id", () => {
    it("debería actualizar el usuario", async () => {
      const user = await User.create(generateMockUser());

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set("x-api-key", API_KEY)
        .send({ firstName: "Actualizado" });

      expect(response.status).to.equal(200);
      expect(response.body.payload.firstName).to.equal("Actualizado");
    });

    it("debería responder 400 VALIDATION_ERROR si el rol es inválido", async () => {
      const user = await User.create(generateMockUser());

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set("x-api-key", API_KEY)
        .send({ role: "superheroe" });

      expect(response.status).to.equal(400);
      expect(response.body.code).to.equal("VALIDATION_ERROR");
    });
  });

});
