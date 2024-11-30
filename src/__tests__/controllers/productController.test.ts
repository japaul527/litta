import request from "supertest";
import app from "../../index"; 
import { products } from "../../utils/db";

describe("Product Controller", () => {
  let token: string;

  beforeAll(async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "adminpass",
    });
    token = response.body.token;
  });

  afterAll(() => {
    // Clean up test data
    products.length = 0;
  });

  it("should create a new product", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        "name": "Laptop",
        "price": 1000,
        "description": "A high-performance laptop",
        "stock": 10
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should return all products", async () => {
    const response = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); // One product created
  });

  it("should return a product by ID", async () => {
    const productId = products[0].id;
    const response = await request(app)
      .get(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", productId);
  });

  it("should update a product", async () => {
    const productId = products[0].id;
    const response = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Product",
        price: 150,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Updated Product");
    expect(response.body).toHaveProperty("price", 150);
  });

  it("should delete a product", async () => {
    const productId = products[0].id;
    const response = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Product deleted");
  });
});
