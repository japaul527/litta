import request from "supertest";
import app from "../../index"; // Your Express app
import { orders, products } from "../../utils/db";

describe("Order Controller", () => {
  let token: string;

  beforeAll(async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "adminpass",
    });
    token = response.body.token;

    // Pre-populate products for testing
    products.push(
      { id: "1", name: "Test Product 1", price: 100, description:"test description 1",stock:30},
      { id: "2", name: "Test Product 2", price: 200, description:"test description 2",stock:50 }
    );
  });

  afterAll(() => {
    // Clean up test data
    products.length = 0;
    orders.length = 0;
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
    expect(response.body.totalPrice).toBe(200); // 100 * 2
  });

  it("should return all orders", async () => {
    const response = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); // One order created
  });

  it("should return an order by ID", async () => {
    const orderId = orders[0].id;
    const response = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", orderId);
  });

  it("should return 404 for non-existent order", async () => {
    const response = await request(app)
      .get("/api/orders/999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should delete an order", async () => {
    const orderId = orders[0].id;
    const response = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Order deleted");
  });
});
