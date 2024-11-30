import { Router } from "express";
import { 
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    partialUpdateOrder,
    deleteOrder

 } from "../controllers/orderController";

import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

// router.post("/",  authenticate, authorize(["admin","user"]),createOrder);

router.post("/",createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.patch("/:id", partialUpdateOrder);
router.delete("/:id", deleteOrder);

export default router;
