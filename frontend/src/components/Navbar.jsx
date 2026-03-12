import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingBag, LogOut, LayoutDashboard, User, Package } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <ShoppingBag className="w-8 h-8 text-black" />
                            <span className="text-xl font-bold tracking-tight">MarketNest</span>
                        </Link>
                    </div>

                    <div className="hidden sm:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-black">Home</Link>
                        {user?.role === "BRAND" && (
                            <div className="flex items-center space-x-6">
                                <Link to="/brand/dashboard" className="text-sm font-medium text-gray-700 hover:text-black flex items-center">
                                    <LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard
                                </Link>
                                <Link to="/brand/orders" className="text-sm font-medium text-gray-700 hover:text-black flex items-center">
                                    <Package className="w-4 h-4 mr-1 text-[#d4af37]" /> Manage Orders
                                </Link>
                            </div>
                        )}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {user.role === "CUSTOMER" && (
                                    <div className="flex items-center space-x-2">
                                        <Link to="/orders" className="p-2 text-gray-600 hover:text-black transition-colors relative group">
                                            <Package className="w-6 h-6" />
                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                My Orders
                                            </span>
                                        </Link>
                                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-black transition-colors group">
                                            <ShoppingBag className="w-6 h-6" />
                                            {cartCount > 0 && (
                                                <span className="absolute top-0 right-0 -mt-1 -mr-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-[#d4af37] rounded-full border-2 border-white">
                                                    {cartCount}
                                                </span>
                                            )}
                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                My Cart
                                            </span>
                                        </Link>
                                    </div>
                                )}
                                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full">
                                    <User className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center"
                                >
                                    <LogOut className="w-4 h-4 mr-1 cursor-pointer" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-black">Login</Link>
                                <Link to="/signup" className="btn btn-primary px-4 py-2 text-sm">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
