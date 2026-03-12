import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("userInfo");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Error parsing user info from localStorage:", error);
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            // If we have a token but no user object, we could optionally fetch profile here
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post("/auth/login", { email, password });
        setUser(data);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userInfo", JSON.stringify(data));
    };

    const register = async (userData) => {
        const { data } = await API.post("/auth/register", userData);
        setUser(data);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userInfo", JSON.stringify(data));
    };

    const logout = async () => {
        await API.post("/auth/logout");
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
