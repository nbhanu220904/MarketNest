import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus } from "lucide-react";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER"
    });
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to signup");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join MarketNest today
                    </p>
                </div>
                {error && <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">{error}</div>}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <input
                            type="email"
                            required
                            className="input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                            <button
                                type="button"
                                className={`py-2 px-4 text-sm font-medium rounded-md border ${formData.role === "CUSTOMER" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                                onClick={() => setFormData({ ...formData, role: "CUSTOMER" })}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-4 text-sm font-medium rounded-md border ${formData.role === "BRAND" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                                onClick={() => setFormData({ ...formData, role: "BRAND" })}
                            >
                                Brand / Seller
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full btn btn-primary py-3">
                            <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-black hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
