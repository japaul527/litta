import request from "supertest";
import app from "../../index"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Mock the user database for testing
jest.mock("../../src/utils/db", () => ({
  users: [
    {
      id: "1",
      username: "admin",
      password: bcrypt.hashSync("adminpass", 10), // Pre-hashed password
      role: "admin",
    },
    {
      id: "2",
      username: "user",
      password: bcrypt.hashSync("userpass", 10), // Pre-hashed password
      role: "user",
    },
  ],
}));

// Secret key for JWT
const JWT_SECRET = "your_secret_key";

describe("Auth Controller Tests", () => {
  describe("POST /api/auth/login", () => {
    it("should return a token for valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "admin", password: "adminpass" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");

      // Verify the token
      const decoded = jwt.verify(response.body.token, JWT_SECRET);
      expect(decoded).toHaveProperty("userId", "1");
      expect(decoded).toHaveProperty("role", "admin");
    });

    it("should return 401 for invalid username", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "wronguser", password: "adminpass" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid username or password");
    });

    it("should return 401 for invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "admin", password: "wrongpass" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid username or password");
    });

    it("should return 400 for missing username or password", async () => {
      const response = await request(app).post("/api/auth/login").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid input");
    });
  });
});
