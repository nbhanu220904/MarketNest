import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { Search, Filter, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ["Menswear", "Womenswear", "Accessories", "Footwear", "Kids"];

    const fetchProducts = async () => {
        setLoading(true);
        console.log("Fetching products with params:", { searchTerm, category, page });
        try {
            const { data } = await API.get(`/products?name=${searchTerm}&category=${category}&page=${page}`);
            console.log("Marketplace data received:", data);
            setProducts(data.products || []);
            setTotalPages(data.pages || 1);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, category, page]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Explore Collections</h1>
                    <p className="text-lg text-gray-500">Discover the latest trends from your favorite brands.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="input pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            className="input pl-10 appearance-none bg-white pr-10"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-black" />
                </div>
            ) : products.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link key={product._id} to={`/product/${product._id}`} className="group h-full">
                                <div className="card h-full flex flex-col group-hover:transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300">
                                    <div className="aspect-square w-full overflow-hidden bg-gray-200">
                                        <img
                                            src={product.images[0]?.url || "https://perfumesreal.com/wp-content/uploads/2023/12/no-image-available.png"}
                                            alt={product.name}
                                            className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity"
                                        />
                                    </div>
                                    <div className="p-5 flex-grow flex flex-col justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-black line-clamp-1">{product.name}</h3>
                                            <p className="mt-1 text-sm text-gray-500 font-medium">by {product.brand?.name}</p>
                                        </div>
                                        <p className="mt-4 text-xl font-extrabold text-black">${product.price}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center space-x-4">
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="p-2 rounded-full border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                                Page <span className="font-bold text-black">{page}</span> of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className="p-2 rounded-full border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-xl text-gray-500 font-medium">No products found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
