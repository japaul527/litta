// import request from "supertest";
// import app from "../../index"; // Your Express app
// import { orders, products } from "../../utils/db";

// describe("Order Controller", () => {
//   let token: string;

//   beforeAll(async () => {
//     const response = await request(app).post("/api/auth/login").send({
//       username: "user" ,//"admin",
//       password: "userpass",//"adminpass",
//     });
//     token = response.body.token;

//     // Pre-populate products for testing
//     products.push(
//       { id: "1", name: "Test Product 1", price: 100, description:"test description 1",stock:30},
//       { id: "2", name: "Test Product 2", price: 200, description:"test description 2",stock:50 }
//     );
//     orders.push(
//       {
//         id:"5",products: [{ productId: "1", quantity: 3 }],totalPrice:300,

//       },
//       {id:"8",products: [{ productId: "1", quantity: 5 }],totalPrice:500,}

//     )
//   });

//   // afterAll(() => {
//   //   // Clean up test data
//   //   products.length = 0;
//   //   orders.length = 0;
//   // });

//   it("should create a new order", async () => {
//     const response = await request(app)
//       .post("/api/orders")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         // id:"7",products: [{ productId: "1", quantity: 2 }],totalPrice:200,

//         products: [{ productId: "1", quantity: 2 }],
//       });

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id");
//     expect(response.body.totalPrice).toBe(200); // 100 * 2
//   });

//   it("should return all orders", async () => {
//     const response = await request(app)
//       .get("/api/orders")
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveLength(1); // One order created
//   });

//   it("should return an order by ID", async () => {
//     // const orderId = orders[0].id;
//     const orderId="5"
//     const response = await request(app)
//       .get(`/api/orders/${orderId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("id", orderId);
//   });

//   it("should return 404 for non-existent order", async () => {
//     const response = await request(app)
//       .get("/api/orders/999")
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(404);
//   });

//   it("should delete an order", async () => {
//     const orderId = orders[0].id;
//     const response = await request(app)
//       .delete(`/api/orders/${orderId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("message", "Order deleted");
//   });
// });
// import request from "supertest";
// import app from "../../index"; // Your Express app
// import { orders, products } from "../../utils/db";

// describe("Order Controller", () => {
//   let token: string;

//   beforeAll(async () => {
//     // Authenticate and get a token
//     const response = await request(app).post("/api/auth/login").send({
//       username: "user",
//       password: "userpass",
//     });
//     token = response.body.token;

//     // Populate products for testing
//     products.length = 0; // Clear existing products
//     products.push(
//       { id: "1", name: "Test Product 1", price: 100, description: "Test 1", stock: 30 },
//       { id: "2", name: "Test Product 2", price: 200, description: "Test 2", stock: 50 }
//     );
//   });

//   afterEach(() => {
//     orders.length = 0; // Clear orders after each test
//   });

//   it("should create a new order", async () => {
//     const response = await request(app)
//       .post("/api/orders")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         products: [{ productId: "1", quantity: 2 }],
//       });

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id");
//     expect(response.body.totalPrice).toBe(200); // 100 * 2
//   });

//   it("should return all orders", async () => {
//     // Pre-create an order
//     orders.push({
//       id: "1",
//       products: [{ productId: "1", quantity: 2 }],
//       totalPrice: 200,
//     });

//     const response = await request(app)
//       .get("/api/orders")
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveLength(1);
//   });

//   it("should return an order by ID", async () => {
//     orders.push({
//       id: "1",
//       products: [{ productId: "1", quantity: 2 }],
//       totalPrice: 200,
//     });

//     const response = await request(app)
//       .get("/api/orders/1")
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("id", "1");
//   });

//   it("should return 404 for a non-existent order", async () => {
//     const response = await request(app)
//       .get("/api/orders/999")
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(404);
//   });

//   it("should delete an order", async () => {
//     orders.push({
//       id: "1",
//       products: [{ productId: "1", quantity: 2 }],
//       totalPrice: 200,
//     });

//     const response = await request(app)
//       .delete("/api/orders/1")
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("message", "Order deleted");
//     expect(orders).toHaveLength(0);
//   });
// });
import request from "supertest";
import app from "../../index"; // Your Express app
import { orders, products } from "../../utils/db";
import { productSchema, orderSchema } from "../../utils/validation";
import { v4 as uuid } from "uuid";

describe("Order Controller", () => {
  let token: string;

  beforeAll(async () => {
    // Authenticate and retrieve token
    const response = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "adminpass",
    });
    token = response.body.token;

    // Pre-populate products using schema validation
    const validProduct1 = productSchema.parse({
      name: "Test Product 1",
      description: "A test product",
      price: 100,
      stock: 30,
    });

    const validProduct2 = productSchema.parse({
      name: "Test Product 2",
      description: "Another test product",
      price: 200,
      stock: 50,
    });

    products.push({ id: uuid(), ...validProduct1 });
    products.push({ id: uuid(), ...validProduct2 });

    // Pre-populate orders using schema validation
    const validOrder = orderSchema.parse({
      products: [{ productId: products[0].id, quantity: 2 }],
    });

    orders.push({ id: uuid(), ...validOrder, totalPrice: 200 });
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
        products: [{ productId: products[1].id, quantity: 1 }],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.totalPrice).toBe(200); // 200 * 1
  });

  it("should return all orders", async () => {
    const response = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should return an order by ID", async () => {
    const orderId = orders[0].id; // Use existing order ID
    const response = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", orderId);
  });

  it("should return 404 for a non-existent order", async () => {
    const response = await request(app)
      .get(`/api/orders/${uuid()}`) // Non-existent ID
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should delete an order", async () => {
    const orderId = orders[0].id; // Use existing order ID
    const response = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Order deleted");
  });
});
