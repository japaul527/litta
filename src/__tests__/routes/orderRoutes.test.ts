import request from "supertest";
import app from "../../index"; // Your Express app

describe("Order Routes", () => {
  let token: string;

  beforeAll(async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "adminpass",
    });
    token = response.body.token;
  });

  it("should create a new order", async () => {
    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        products: [{ productId: "1", quantity: 2 }],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should get all orders", async () => {
    const response = await request(app).get("/api/orders");
    expect(response.status).toBe(200);
  });

  it("should get a single order by ID", async () => {
    const response = await request(app).get("/api/orders/1");
    expect(response.status).toBe(200);
  });

  it("should return 404 for a non-existent order", async () => {
    const response = await request(app).get("/api/orders/999");
    expect(response.status).toBe(404);
  });
});
