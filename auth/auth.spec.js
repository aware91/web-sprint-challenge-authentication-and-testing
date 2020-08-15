const request = require('supertest');
const server = require('../api/server.js');
const router = require('./auth-router.js');
const db = require('../database/dbConfig.js');

describe('server.js', () => {
  it('that the testing environment is set up', () => {
    expect(process.env.DB_ENV).toBe('testing');
  })
  describe('API up', () => {
    it('should return{api:"up"}', async () => {
      const res = await request(router).get('/');
      expect(res.body).toEqual({ api: 'up' })
    })
  })
})

describe("Auth Router", () => {
  describe("POST /api/auth/register", () => {
    let res = {};
    beforeAll(async () => {
      try {
        res = await request(router)
          .post("/api/auth/register")
            .send({
              "username": "aware",
              "password": "password"
            });
      } catch (err) {
        console.log(`Error ${err}`);
      }
    });
    test("should return a status 201 Created", () => {
      expect(res.status).toEqual(201);
    });
    test("should return an object that has the username of the user created", () => {
      expect(res.body.username).toEqual("aware");
    });
  });
  describe("POST /api/auth/login", () => {
    let res = {};
    beforeAll(async () => {
      try {
        res = await request(router)
          .post("/api/auth/login")
          .send({username: "aware", password: "password"});
      } catch (err) {
        console.log(`Error ${err}`);
      }
    });
    test("should return a status 200 OK", () => {
      expect(res.status).toEqual(200);
    });
    test("should return an object that has the username of the user logged on", () => {
      expect(res.body).toHaveProperty("username");
    });
    test("should fail with status 403 Forbidden", async () => {
      let res = await request(router).post("/api/auth/login")
        .send({username: "aware", password: "password"});
      expect(res.status).toEqual(403);
    });
    test("cleans out the database after all tests", async () => {
      await db("users").truncate();
    });
  });
})