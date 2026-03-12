import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/api";
import ProductForm from "../components/ProductForm";
import { ArrowLeft, Loader2 } from "lucide-react";

const EditProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data);
            } catch (err) {
                setError("Failed to fetch product data");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (formData) => {
        setSubmitLoading(true);
        try {
            await API.put(`/products/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            navigate("/brand/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update product");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[70vh]">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-500 hover:text-black mb-10 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900">Edit Product</h1>
                <p className="text-gray-500 mt-1">Updates will be reflected instantly across Home Page.</p>
            </div>

            {error && <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm font-medium rounded-r-lg">{error}</div>}

            <ProductForm initialData={product} onSubmit={handleSubmit} loading={submitLoading} />
        </div>
    );
};

export default EditProduct;
