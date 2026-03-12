import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../utils/api";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Loader2, CircleCheck } from "lucide-react";

const CheckoutPage = () => {
    const { cart, cartTotal, refreshCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        postalCode: "",
        country: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/orders", { shippingAddress: formData });
            setSuccess(true);
            await refreshCart();
            setTimeout(() => navigate("/"), 3000);
        } catch (error) {
            console.error("Order failed:", error);
            alert(error.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <CircleCheck className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-500 mb-8">Thank you for your purchase. We've received your order and are processing it. Redirecting you to the Home shortly...</p>
                    <Link to="/" className="btn btn-primary px-8">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
                <Link to="/" className="btn btn-primary px-8">Browse Home</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link to="/cart" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-10 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
            </Link>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-10">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Form */}
                <div className="lg:w-2/3">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="card p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Truck className="w-5 h-5 mr-3 text-[#d4af37]" /> Shipping Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="label">Street Address</label>
                                    <input
                                        name="address"
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="123 Fashion Blvd"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="label">City</label>
                                    <input
                                        name="city"
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="New York"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="label">Postal Code</label>
                                    <input
                                        name="postalCode"
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="10001"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="label">Country</label>
                                    <input
                                        name="country"
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="USA"
                                        value={formData.country}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card p-8 bg-gray-50 border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <CreditCard className="w-5 h-5 mr-3 text-[#d4af37]" /> Payment Method
                            </h2>
                            <p className="text-sm text-gray-500 mb-4 italic">Currently only Cash on Delivery is supported for this demo.</p>
                            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#d4af37]">
                                <div className="w-5 h-5 rounded-full border-4 border-[#d4af37]"></div>
                                <span className="font-bold text-gray-900">Cash on Delivery</span>
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn btn-primary py-4 text-lg font-bold flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : "Place Order Now"}
                        </button>
                    </form>
                </div>

                {/* Summary */}
                <div className="lg:w-1/3">
                    <div className="card p-8 bg-black text-white sticky top-24 border-none">
                        <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4">Order Summary</h2>
                        <div className="space-y-4 mb-8 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="flex justify-between items-start gap-4">
                                    <div className="flex-grow">
                                        <p className="text-sm font-bold text-white line-clamp-1">{item.product.name}</p>
                                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-gray-800">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Shipping</span>
                                <span className="text-green-500">FREE</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-4">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                            <div className="flex items-center justify-center text-xs text-gray-500 mb-2">
                                <ShieldCheck className="w-4 h-4 mr-2" /> 100% Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
