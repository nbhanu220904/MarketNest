import express from "express";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../controllers/cartController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect); // All cart routes are protected

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);

export default router;
