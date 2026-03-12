import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { Package, Truck, Clock, CircleCheck, XCircle, Loader2, User, Mail, MapPin, ExternalLink } from "lucide-react";

const BrandOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    const fetchOrders = async () => {
        try {
            const { data } = await API.get("/orders/brand-orders");
            setOrders(data);
        } catch (error) {
            console.error("Error fetching brand orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingStatus(orderId);
        try {
            await API.put(`/orders/${orderId}/status`, { status: newStatus });
            await fetchOrders(); // Refresh list
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
            case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
            case "SHIPPED": return "bg-blue-100 text-blue-700 border-blue-200";
            case "PROCESSING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[70vh]">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-black">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight">Order Management</h1>
                <p className="text-gray-500 mt-2 text-lg">Manage and track customer orders for your premium products.</p>
            </div>

            {orders.length === 0 ? (
                <div className="card p-20 text-center border-dashed">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Package className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No orders received yet</h2>
                    <p className="text-gray-500 max-w-md mx-auto">Once customers start purchasing your products, their orders will appear here for management.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {orders.map((order) => (
                        <div key={order._id} className="card overflow-hidden hover:shadow-xl transition-all duration-300 border-none bg-white shadow-md">
                            <div className="flex flex-col lg:flex-row">
                                {/* Order Sidebar / Customer Info */}
                                <div className="lg:w-1/3 bg-gray-50 p-8 border-r border-gray-100">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Order ID</p>
                                            <p className="text-sm font-bold flex items-center">
                                                #{order._id.slice(-8).toUpperCase()}
                                                <ExternalLink className="w-3 h-3 ml-2 text-gray-400 hover:text-black cursor-pointer" />
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Customer Information</p>
                                            <div className="space-y-3">
                                                <div className="flex items-center text-sm">
                                                    <User className="w-4 h-4 mr-3 text-gray-400" />
                                                    <span className="font-medium">{order.user?.name}</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                                                    <span className="text-gray-600">{order.user?.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Shipping Address</p>
                                            <div className="flex items-start text-sm">
                                                <MapPin className="w-4 h-4 mr-3 mt-0.5 text-gray-400" />
                                                <div className="text-gray-600 leading-relaxed">
                                                    <p>{order.shippingAddress.address}</p>
                                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                                    <p className="uppercase font-bold text-[10px] mt-1 text-gray-400 tracking-wider font-sans">{order.shippingAddress.country}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Main Content */}
                                <div className="lg:w-2/3 p-8">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Order Date</p>
                                            <p className="text-lg font-bold">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 text-right">Total Payout</p>
                                            <p className="text-2xl font-black text-black">${order.totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Ordered Items</p>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 group transition-all duration-300 hover:border-black">
                                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg overflow-hidden shrink-0 shadow-sm">
                                                    <img
                                                        src={item.product?.images?.[0]?.url || "https://perfumesreal.com/wp-content/uploads/2023/12/no-image-available.png"}
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="grow">
                                                    <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.product?.name}</h4>
                                                    <p className="text-xs text-black font-semibold mt-0.5 opacity-60">QTY: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-black">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-100 pt-8 mt-auto">
                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Update Order Progress</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleUpdateStatus(order._id, status)}
                                                            disabled={updatingStatus === order._id || order.status === status}
                                                            className={`text-[10px] font-bold px-4 py-2 rounded-full border transition-all duration-300 tracking-widest ${
                                                                order.status === status
                                                                    ? "bg-black border-black text-white cursor-default"
                                                                    : "bg-white border-gray-200 text-gray-500 hover:border-black hover:text-black"
                                                            } ${updatingStatus === order._id ? "opacity-30 cursor-wait" : ""}`}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {updatingStatus === order._id && (
                                                <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">
                                                    <Loader2 className="w-3 h-3 mr-2 animate-spin" /> Updating...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrandOrders;
