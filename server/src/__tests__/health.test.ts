import request from "supertest";
import app from "../app";

describe("Server health", () => {
  it("should respond with a running status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: expect.stringContaining("running"),
    });
  });
});
