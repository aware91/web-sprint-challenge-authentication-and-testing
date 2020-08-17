const request = require("supertest");
const server = require("../api/server.js");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoyLCJ1c2VybmFtZSI6ImF3YXJlMSIsImNyZWF0ZWRfYXQiOjE1OTc2MzM1NzA0NjYsImlhdCI6MTU5NzYzMzU3MCwiZXhwIjoxNTk3NjM3MTcwfQ.HMS62sJeDs2NkV_AhqurfauTth_kLpJc3m8Uoi3WKh0";

describe("Jokes Router", () => {
    describe("GET /api/jokes", () => {
        let res = {};
        beforeAll(async () => {
            res = (await request(server).get("/api/jokes").auth(token, {type: "bearer"}));
        });

        test("should return status 200 OK", () => {

            expect(res.status).toBe(200);
        });

        test("should return an array", () => {
            expect(res.body).toBeInstanceOf(Array);
        });
    })
});