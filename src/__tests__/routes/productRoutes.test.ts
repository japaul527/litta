import request from "supertest";
import app from "../../index"; // Your Express app

describe("Product Routes", () => {
  let token: string;

  beforeAll(async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "adminpass",
    });
    token = response.body.token;
  });

  it("should create a new product", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        price: 100,
        category: "Test",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should get all products", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
  });

  it("should get a single product by ID", async () => {
    const response = await request(app).get("/api/products/1");
    expect(response.status).toBe(200);
  });

  it("should return 404 for a non-existent product", async () => {
    const response = await request(app).get("/api/products/999");
    expect(response.status).toBe(404);
  });
});
