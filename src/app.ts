import express from "express";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes"

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

export default app;
