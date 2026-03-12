import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
const allowedOrigins = [
    "http://localhost:5173",
    "https://market-nest-frontend.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Log the incoming origin for debugging on Render
        console.log(`Incoming request from origin: ${origin}`);
        
        // Allow requests with no origin (like mobile apps/Postman)
        if (!origin) return callback(null, true);
        
        // Clean up URLs for matching (remove trailing slashes)
        const cleanOrigin = origin.replace(/\/$/, "");
        const cleanFrontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null;

        const isAllowed = 
            allowedOrigins.includes(cleanOrigin) || 
            (cleanFrontendUrl && cleanOrigin === cleanFrontendUrl);
        
        console.log(`Access ${isAllowed ? "GRANTED" : "DENIED"} for origin: ${origin}`);

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    credentials: true
}));

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
});

const port = process.env.PORT || 4000;

app.get("/", (req, res) =>
    res.send("<h1>Welcome to the MarketNest API</h1>")
);

// Explicitly log server start for verification
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});