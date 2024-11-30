import { Router } from "express";
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";
import authRoutes from "./authRoutes";


const router = Router();
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

export default router;
