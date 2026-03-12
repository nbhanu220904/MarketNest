import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";

const CartPage = () => {
    const { cart, loading, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    if (loading && !cart) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-black" />
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="bg-gray-50 rounded-3xl p-12 border border-dashed border-gray-200">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our collections and find something you love!</p>
                    <Link to="/" className="btn btn-primary px-8">
                        Browse Product
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-10">Shopping Bag ({cartCount})</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="lg:w-2/3 space-y-6">
                    {cart.items.map((item) => (
                        <div key={item.product._id} className="card p-6 flex flex-col sm:flex-row gap-6 items-center">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={item.product.images[0]?.url || "https://perfumesreal.com/wp-content/uploads/2023/12/no-image-available.png"}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-grow text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                    <div>
                                        <p className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-1">{item.product.category}</p>
                                        <Link to={`/product/${item.product._id}`} className="text-xl font-bold text-gray-900 hover:underline">
                                            {item.product.name}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">by {item.product.brand?.name}</p>
                                    </div>
                                    <p className="text-xl font-extrabold text-black">${item.product.price}</p>
                                </div>

                                <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-between gap-4">
                                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                            className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-bold text-gray-900">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                            className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.product._id)}
                                        className="flex items-center text-red-500 hover:text-red-600 text-sm font-bold transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:w-1/3">
                    <div className="card p-8 bg-gray-50 border-none sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="pt-4 border-t border-gray-200 flex justify-between">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-extrabold text-black">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate("/checkout")}
                            className="w-full btn btn-primary py-4 group flex items-center justify-center"
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-6 text-center">
                            <Link to="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
