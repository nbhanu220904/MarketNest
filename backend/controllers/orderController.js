import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;
        
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const totalPrice = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

        const order = await Order.create({
            user: req.user._id,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            shippingAddress,
            totalPrice
        });

        // Clear cart after order creation
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product")
            .sort("-createdAt");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get orders for a brand
// @route   GET /api/orders/brand-orders
// @access  Private (Brand only)
export const getBrandOrders = async (req, res) => {
    try {
        // Find all products owned by this brand
        const brandProducts = await Product.find({ brand: req.user._id }).select("_id");
        const productIds = brandProducts.map(p => p._id);

        // Find orders containing any of these products
        const orders = await Order.find({
            "items.product": { $in: productIds }
        })
        .populate("user", "name email")
        .populate("items.product")
        .sort("-createdAt");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Brand only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Verify that the brand actually has a product in this order
        const brandProducts = await Product.find({ brand: req.user._id }).select("_id");
        const productIds = brandProducts.map(p => p._id.toString());
        
        const hasBrandProduct = order.items.some(item => productIds.includes(item.product.toString()));

        if (!hasBrandProduct && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Not authorized to update this order" });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
