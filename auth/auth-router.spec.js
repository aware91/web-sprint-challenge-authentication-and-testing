const request = require("supertest");
const server = require("../api/server.js");
const db = require("../database/dbConfig.js");


const testUser = {
    username: "tester",
    password: "1234"
};
module.exports = testUser;

describe("Auth Router", () => {
    describe("POST /api/auth/register", () => {
        db("users").truncate();

        let res = {};
        beforeAll(async () => {
            const [truncate, response] = await Promise.all([
                db("users").truncate(),
                request(server).post("/api/auth/register").send(testUser)
            ]);
            res = response
        });

        test("should return status 201 Created", () => {
            expect(res.status).toBe(201);
        });

        test("should return an object with a token property", () => {
            expect(res.body).toHaveProperty("token");
        });    

        test("should return message saying missing username and password", async () => {
            const res = await request(server).post("/api/auth/register");
            expect(res.body.message).toEqual("Missing username and/or password");
        });

        test("should return status 500", async () => {
            const res = await request(server).post("/api/auth/register").send(testUser);
            expect(res.status).toBe(500);
            expect(res.body.message.toLowerCase()).toBe("error creating user");
        });
    });

    describe("POST /api/auth/login", () => {
        let res = {};
        beforeAll(async () => {
            res = await request(server).post("/api/auth/login")
                .send(testUser);
        });

        test("should return status 200 OK", () => {
            expect(res.status).toBe(200);
        });

        test("should return an object with a token property", () => {
            expect(res.body).toHaveProperty("token");
        });
    });
});