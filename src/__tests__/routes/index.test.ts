import request from "supertest";
import app from "../../index"; 

describe("Index Routes", () => {
  it("should include the auth routes", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "adminpass",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should include the product routes", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
  });

  it("should include the order routes", async () => {
    const response = await request(app).get("/api/orders");
    expect(response.status).toBe(200);
  });
});
