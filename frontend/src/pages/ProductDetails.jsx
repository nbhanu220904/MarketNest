import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, ShoppingBag, Loader2, Tag, ShieldCheck, CircleCheck } from "lucide-react";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [activeImage, setActiveImage] = useState(0);

    console.log("ProductDetails rendered, product state:", product);

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        setAdding(true);
        const result = await addToCart(product._id, 1);
        if (result.success) {
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
        setAdding(false);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            console.log("Fetching product with ID:", id);
            try {
                const { data } = await API.get(`/products/${id}`);
                console.log("Product data received:", data);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchProduct();
        } else {
            console.warn("No product ID found in params");
        }
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-[70vh]">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
        </div>
    );

    if (!product) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold">Product not found.</h2>
            <Link to="/" className="text-black underline mt-4 inline-block">Back to Home</Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-10 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                        <img
                            src={product.images[activeImage]?.url || "https://perfumesreal.com/wp-content/uploads/2023/12/no-image-available.png"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex space-x-4 overflow-x-auto py-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? "border-black ring-2 ring-black ring-offset-2" : "border-transparent opacity-70 hover:opacity-100"}`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col">
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 uppercase tracking-widest mb-4">
                            <Tag className="w-3 h-3 mr-1" /> {product.category}
                        </span>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                        <p className="text-lg text-gray-500">by <span className="text-black font-semibold">{product.brand?.name}</span></p>
                        <p className="mt-6 text-4xl font-black text-black">${product.price}</p>
                    </div>

                    <div className="mb-10 flex-grow">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-4 pt-10 border-t border-gray-100">
                        <button
                            onClick={handleAddToCart}
                            disabled={user?.role === "BRAND" || adding}
                            className={`w-full btn py-4 text-lg font-bold flex items-center justify-center transition-all ${
                                added ? "bg-green-600 text-white" : "btn-primary"
                            } ${user?.role === "BRAND" ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {adding ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                            ) : added ? (
                                <CircleCheck className="w-5 h-5 mr-3" />
                            ) : (
                                <ShoppingBag className="w-5 h-5 mr-3" />
                            )}
                            {added ? "Added to Bag" : user?.role === "BRAND" ? "Login as Customer to Buy" : "Add to Cart"}
                        </button>
                        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 py-4">
                            <div className="flex items-center">
                                <ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Secure Payment
                            </div>
                            <div className="flex items-center">
                                <ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Premium Quality
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
