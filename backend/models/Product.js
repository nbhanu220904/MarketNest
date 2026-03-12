import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    price: {
        type: Number,
        required: [true, "Please add a price"]
    },
    category: {
        type: String,
        required: [true, "Please add a category"]
    },
    images: [{
        url: String,
        public_id: String
    }],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
        default: "DRAFT"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Middleware for soft delete
productSchema.pre("find", function() {
    this.where({ isDeleted: false });
});

productSchema.pre("findOne", function() {
    this.where({ isDeleted: false });
});

const Product = mongoose.model("Product", productSchema);

export default Product;
