import request from "supertest";
import app from "../../index"; 
import net from "net"; 

const PORT = 3000; // Port where the app runs
let server: any; // To store the server instance

describe("Product Routes", () => {
  let token: string;
  let productId: string;
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
    const portInUse = await isPortInUse(PORT);

    if (!portInUse) {
      server = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
      });
    }

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
        "name": "Laptop",
        "price": 1000,
        "description": "A high-performance laptop",
        "stock": 10
      });
    productId=response.body.id
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should get all products", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
  });

  it("should get a single product by ID", async () => {
    const response = await request(app).get("/api/products/"+productId);
    expect(response.status).toBe(200);
  });

  it("should return 404 for a non-existent product", async () => {
    const response = await request(app).get("/api/products/999");
    expect(response.status).toBe(404);
  });

  it("should update the product", async () => {
    const response = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Laptop",
        price: 1200,
        description: "An updated high-performance laptop",
        stock: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Laptop");
    expect(response.body.price).toBe(1200);
  });

  it("should delete the product", async () => {
    const response = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product deleted");
  });
});
