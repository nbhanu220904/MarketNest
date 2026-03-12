import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import ProductForm from "../components/ProductForm";
import { ArrowLeft } from "lucide-react";

const CreateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await API.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            navigate("/brand/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-500 hover:text-black mb-10 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900">Add New Product</h1>
                <p className="text-gray-500 mt-1">Ready to showcase something new?</p>
            </div>

            {error && <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm font-medium rounded-r-lg">{error}</div>}

            <ProductForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
};

export default CreateProduct;
