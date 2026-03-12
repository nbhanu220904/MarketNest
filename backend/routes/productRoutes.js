import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getDashboardSummary,
    getMyProducts
} from "../controllers/productController.js";
import { protect, authorize } from "../middlewares/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Routes (Locked for all logged-in users)
router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);

// Protected Brand routes
router.get("/brand/summary", protect, authorize("BRAND"), getDashboardSummary);
router.get("/brand/my-products", protect, authorize("BRAND"), getMyProducts);
router.post("/", protect, authorize("BRAND"), upload.array("images", 5), createProduct);
router.put("/:id", protect, authorize("BRAND"), upload.array("images", 5), updateProduct);
router.delete("/:id", protect, authorize("BRAND"), deleteProduct);

export default router;
