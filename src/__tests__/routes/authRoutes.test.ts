import request from "supertest";
import app from "../../index";

describe("Auth Routes", () => {
  describe("POST /api/auth/login", () => {
    it("should return a token for valid login", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "admin",
        password: "adminpass",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return 401 for invalid login", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "admin",
        password: "wrongpass",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid username or password");
    });
  });
});
