import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { Plus, Edit, Trash2, Loader2, Package, Archive, CheckCircle, Clock } from "lucide-react";

const BrandDashboard = () => {
    const [products, setProducts] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, summaryRes] = await Promise.all([
                API.get("/products/brand/my-products"),
                API.get("/products/brand/summary")
            ]);
            setProducts(productsRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error("Error fetching brand data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to archive this product?")) {
            try {
                await API.delete(`/products/${id}`);
                fetchData();
            } catch (error) {
                alert("Failed to delete product");
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[70vh]">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Brand Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your storefront and product catalog</p>
                </div>
                <Link to="/brand/create" className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" /> Add New Product
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="card p-6 border-l-4 border-black">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-100 rounded-lg"><Package className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Products</p>
                            <h3 className="text-2xl font-bold">{summary?.total || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="card p-6 border-l-4 border-green-500">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Published</p>
                            <h3 className="text-2xl font-bold">{summary?.published || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="card p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600"><Clock className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Drafts</p>
                            <h3 className="text-2xl font-bold">{summary?.draft || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="card p-6 border-l-4 border-red-500">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-red-50 rounded-lg text-red-600"><Archive className="w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Archived</p>
                            <h3 className="text-2xl font-bold">{summary?.archived || 0}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length > 0 ? products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                                <img src={product.images[0]?.url || ""} alt="" className="h-full w-full object-cover" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-700">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-tighter ${product.status === "PUBLISHED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            <Link to={`/brand/edit/${product._id}`} className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all shadow-sm">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No products found. Start by adding a new one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BrandDashboard;
