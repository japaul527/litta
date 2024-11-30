import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  partialUpdateProduct,
} from "../controllers/productController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, authorize(["admin"]), createProduct);
router.put("/:id", authenticate, authorize(["admin"]), updateProduct);
router.patch("/:id", authenticate, authorize(["admin"]), partialUpdateProduct);
router.delete("/:id", authenticate, authorize(["admin"]), deleteProduct);

export default router;
