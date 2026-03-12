import Product from "../models/Product.js";
import { cloudinary } from "../config/cloudinary.js";

// @desc    Get all products (Customer browsing)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { name, category, page = 1, limit = 10 } = req.query;
        const query = { status: "PUBLISHED", isDeleted: false };

        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .populate("brand", "name")
            .sort("-createdAt")
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("brand", "name");

        if (!product || product.isDeleted || (product.status !== "PUBLISHED" && (!req.user || req.user._id.toString() !== product.brand.toString()))) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create product (Brand only)
// @route   POST /api/products
// @access  Private/Brand
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, status } = req.body;
        const images = req.files.map(file => ({
            url: file.path,
            public_id: file.filename
        }));

        const product = await Product.create({
            name,
            description,
            price,
            category,
            status,
            images,
            brand: req.user._id
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Edit product (Brand only, owner only)
// @route   PUT /api/products/:id
// @access  Private/Brand
export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product || product.isDeleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.brand.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this product" });
        }

        const { name, description, price, category, status, removeImages } = req.body;

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.status = status || product.status;

        // Handle image removal
        if (removeImages && Array.isArray(removeImages)) {
            for (const public_id of removeImages) {
                await cloudinary.uploader.destroy(public_id);
                product.images = product.images.filter(img => img.public_id !== public_id);
            }
        }

        // Handle new image additions
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: file.path,
                public_id: file.filename
            }));
            product.images = [...product.images, ...newImages];
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Soft delete product (Brand only, owner only)
// @route   DELETE /api/products/:id
// @access  Private/Brand
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || product.isDeleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.brand.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        product.isDeleted = true;
        await product.save();

        res.json({ message: "Product archived successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dashboard Summary (Brand only)
// @route   GET /api/products/summary
// @access  Private/Brand
export const getDashboardSummary = async (req, res) => {
    try {
        const products = await Product.find({ brand: req.user._id, isDeleted: false });

        const summary = {
            total: products.length,
            published: products.filter(p => p.status === "PUBLISHED").length,
            draft: products.filter(p => p.status === "DRAFT").length,
            archived: (await Product.countDocuments({ brand: req.user._id, isDeleted: true }))
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Brand Products
// @route   GET /api/products/brand/my-products
// @access  Private/Brand
export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ brand: req.user._id, isDeleted: false });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
