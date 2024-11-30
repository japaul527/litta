// import request from "supertest";
// import app from "../../index"; 
// import { orders, products } from "../../utils/db";
// import net from "net"; 

// const PORT = 3000; // Port where the app runs
// let server: any; // To store the server instance

// describe("Order Routes", () => {
//   let token: string;
//   let productIdn: string;
//   const isPortInUse = (port: number): Promise<boolean> => {
//     return new Promise((resolve) => {
//       const tester = net
//         .createServer()
//         .once("error", (err: any) => {
//           if (err.code === "EADDRINUSE") resolve(true);
//           else resolve(false);
//         })
//         .once("listening", () => {
//           tester.close(() => resolve(false));
//         })
//         .listen(port);
//     });
//   };
//   beforeAll(async () => {
//     const portInUse = await isPortInUse(PORT);

//     if (!portInUse) {
//       server = app.listen(PORT, () => {
//         console.log(`Test server running on port ${PORT}`);
//       });
//     }
//     const response = await request(app).post("/api/auth/login").send({
//       username: "admin",
//       password: "adminpass",
//     });
//     token = response.body.token;
//     // Pre-populate products for testing
//     products.push(
//       { id: "1", name: "Test Product 1", price: 100, description:"test description 1",stock:30},
//       { id: "2", name: "Test Product 2", price: 200, description:"test description 2",stock:50 }
//     );
//     orders.push(
//       {
//         id:"5",products: [{ productId: "1", quantity: 2 }],totalPrice:200,
//       }
//     )
//     // const response2 = await request(app)
//     //   .post("/api/products")
//     //   .set("Authorization", `Bearer ${token}`)
//     //   .send({
//     //     "name": "Laptop",
//     //     "price": 1000,
//     //     "description": "A high-performance laptop",
//     //     "stock": 10
//     //   });
//     // productIdn=response2.body.id
//     // console.log("productID++++++",productIdn)
//   });

//   it("should create a new order", async () => {
//     const response = await request(app)
//       .post("/api/orders")
//       // .set("Authorization", `Bearer ${token}`)
//       .send({
//         // "products": [{ "productId": "1", "quantity": 2 }],
//         id:"7",products: [{ productId: "1", quantity: 2 }],totalPrice:200,

//       });
//     console.log("+++++++++++++++++++++++",response.body)
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id");
//   });

//   it("should get all orders", async () => {
//     const response = await request(app).get("/api/orders");
//     expect(response.status).toBe(200);
//   });

//   it("should get a single order by ID", async () => {
//     const response = await request(app).get("/api/orders/1");
//     expect(response.status).toBe(200);
//   });

//   it("should return 404 for a non-existent order", async () => {
//     const response = await request(app).get("/api/orders/999");
//     expect(response.status).toBe(404);
//   });
// });
import request from "supertest";
import app from "../../index";
import { products, orders } from "../../utils/db";
import { productSchema, orderSchema } from "../../utils/validation";
import { v4 as uuid } from "uuid";
import net from "net";

const PORT = 3000;
let server: any;

describe("Order Routes", () => {
  let token: string;

  const isPortInUse = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const tester = net
        .createServer()
        .once("error", (err: any) => {
          if (err.code === "EADDRINUSE") resolve(true);
          else resolve(false);
        })
        .once("listening", () => {
          tester.close(() => resolve(false));
        })
        .listen(port);
    });
  };

  beforeAll(async () => {
    // Check if server is running
    const portInUse = await isPortInUse(PORT);

    if (!portInUse) {
      server = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
      });
    }

    // Authenticate and retrieve token
    const response = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "adminpass",
    });
    token = response.body.token;

    // Pre-populate products using schema validation
    const validProduct = productSchema.parse({
      name: "Test Product",
      description: "A test product",
      price: 100,
      stock: 30,
    });

    products.push({ id: uuid(), ...validProduct });

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

    if (server) {
      server.close(() => {
        console.log(`Test server closed on port ${PORT}`);
      });
    }
  });

  it("should create a new order", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        products: [{ productId: products[0].id, quantity: 3 }],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.totalPrice).toBe(300); // 100 * 3
  });

  it("should get all orders", async () => {
    const response = await request(app).get("/api/orders");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should get a single order by ID", async () => {
    const orderId = orders[0].id;
    const response = await request(app).get(`/api/orders/${orderId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", orderId);
  });

  it("should return 404 for a non-existent order", async () => {
    const response = await request(app).get(`/api/orders/${uuid()}`);
    expect(response.status).toBe(404);
  });
});
