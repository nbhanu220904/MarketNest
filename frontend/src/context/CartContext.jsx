import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data } = await API.get("/cart");
            setCart(data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const { data } = await API.post("/cart", { productId, quantity });
            setCart(data);
            return { success: true };
        } catch (error) {
            console.error("Error adding to cart:", error);
            return { success: false, message: error.response?.data?.message || "Failed to add to cart" };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const { data } = await API.put(`/cart/${productId}`, { quantity });
            setCart(data);
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const { data } = await API.delete(`/cart/${productId}`);
            setCart(data);
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    const cartTotal = cart?.items?.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0;

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            cartCount,
            cartTotal,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
