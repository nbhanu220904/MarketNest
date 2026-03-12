import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { Package, Truck, Clock, CircleCheck, XCircle, ArrowRight, Loader2, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get("/orders/my-orders");
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const toggleTrackOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const trackingSteps = [
        { status: "PENDING", label: "Ordered", icon: Package },
        { status: "PROCESSING", label: "Processing", icon: Clock },
        { status: "SHIPPED", label: "Shipped", icon: Truck },
        { status: "DELIVERED", label: "Delivered", icon: CircleCheck },
    ];

    const getStepStatus = (orderStatus, stepStatus) => {
        const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
        const currentIndex = statuses.indexOf(orderStatus === "CANCELLED" ? "PENDING" : orderStatus);
        const stepIndex = statuses.indexOf(stepStatus);

        if (orderStatus === "CANCELLED") {
            if (stepStatus === "ORDERED") return "completed";
            return "cancelled";
        }

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "active";
        return "upcoming";
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "DELIVERED": return <CircleCheck className="w-4 h-4 mr-1" />;
            case "CANCELLED": return <XCircle className="w-4 h-4 mr-1" />;
            case "SHIPPED": return <Truck className="w-4 h-4 mr-1" />;
            case "PROCESSING": return <Clock className="w-4 h-4 mr-1" />;
            default: return <Package className="w-4 h-4 mr-1" />;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[70vh]">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-black">
            <h1 className="text-4xl font-extrabold tracking-tight mb-10">Your Orders</h1>

            {orders.length === 0 ? (
                <div className="card p-12 text-center border-dashed">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Start browsing our premium collections and place your first order today!</p>
                    <Link to="/" className="btn btn-primary px-8">
                        Explore Home
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order._id} className="card overflow-hidden group hover:shadow-lg transition-all duration-300">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                                        <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                        <p className="text-sm font-bold">${order.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ship To</p>
                                        <p className="text-sm font-bold">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Order # {order._id.slice(-8).toUpperCase()}</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(order.status)} whitespace-nowrap`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-8 py-6">
                                <div className="divide-y divide-gray-100">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-6">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.product?.images?.[0]?.url || "https://perfumesreal.com/wp-content/uploads/2023/12/no-image-available.png"}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-gray-900 mb-1">{item.product?.name || "Product Unavailable"}</h3>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Footer / Track Order */}
                            <div className="bg-white px-8 py-4 border-t border-gray-50">
                                <button 
                                    onClick={() => toggleTrackOrder(order._id)}
                                    className="text-xs font-bold text-[#d4af37] hover:text-black transition-colors uppercase tracking-widest flex items-center ml-auto"
                                >
                                    {expandedOrder === order._id ? "Hide Details" : "Track Order"} 
                                    {expandedOrder === order._id ? <ChevronUp className="w-3 h-3 ml-2" /> : <ChevronDown className="w-3 h-3 ml-2" />}
                                </button>

                                {expandedOrder === order._id && (
                                    <div className="mt-10 mb-6 px-4 sm:px-10">
                                        <div className="relative">
                                            {/* Progress Line */}
                                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2"></div>
                                            
                                            <div className="relative flex justify-between items-center">
                                                {trackingSteps.map((step, idx) => {
                                                    const stepStatus = getStepStatus(order.status, step.status);
                                                    const StepIcon = step.icon;

                                                    return (
                                                        <div key={idx} className="flex flex-col items-center relative z-10 bg-white px-2">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                                                stepStatus === "completed" ? "bg-black border-black text-white" :
                                                                stepStatus === "active" ? "bg-white border-black text-black scale-110 shadow-lg" :
                                                                stepStatus === "cancelled" ? "bg-red-50 border-red-200 text-red-500 opacity-50" :
                                                                "bg-white border-gray-200 text-gray-300"
                                                            }`}>
                                                                <StepIcon className="w-6 h-6" />
                                                            </div>
                                                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-3 ${
                                                                stepStatus === "completed" || stepStatus === "active" ? "text-black" : "text-gray-400"
                                                            }`}>
                                                                {step.label}
                                                            </p>
                                                            {stepStatus === "active" && (
                                                                <span className="absolute -top-8 bg-black text-white text-[8px] px-2 py-1 rounded animate-bounce">
                                                                    Current Status
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {order.status === "CANCELLED" && (
                                            <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-700 text-sm">
                                                <XCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                                <p>This order was <strong>Cancelled</strong>. If this was a mistake, please contact our support team.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
