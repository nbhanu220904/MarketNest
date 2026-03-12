import express from "express";
import { createOrder, getMyOrders, getBrandOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/brand-orders", authorize("BRAND"), getBrandOrders);
router.put("/:id/status", authorize("BRAND"), updateOrderStatus);

export default router;
