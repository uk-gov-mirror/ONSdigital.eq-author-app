const request = require("supertest");
const { app } = require("./main");

describe("publish", () => {
  it("should return 200 on POST", done => {
    request(app)
      .post("/publish/1")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
