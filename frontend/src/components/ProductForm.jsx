import React, { useState, useEffect } from "react";
import { X, Upload, Loader2, Save } from "lucide-react";

const ProductForm = ({ initialData, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Menswear",
        status: "DRAFT"
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [removeImages, setRemoveImages] = useState([]);

    const categories = ["Menswear", "Womenswear", "Accessories", "Footwear", "Kids"];

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                price: initialData.price,
                category: initialData.category,
                status: initialData.status
            });
            setPreviewImages(initialData.images || []);
        }
    }, [initialData]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            isNew: true
        }));
        setPreviewImages([...previewImages, ...newPreviews]);
    };

    const removePreview = (idx, isNew, public_id) => {
        if (isNew) {
            const newImages = [...images];
            newImages.splice(idx - (previewImages.length - images.length), 1);
            setImages(newImages);
        } else {
            setRemoveImages([...removeImages, public_id]);
        }
        
        const newPreviews = [...previewImages];
        newPreviews.splice(idx, 1);
        setPreviewImages(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        images.forEach(image => data.append("images", image));
        if (removeImages.length > 0) {
            removeImages.forEach(id => data.append("removeImages[]", id));
        }
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-3xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Product Name</label>
                        <input
                            type="text"
                            required
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Description</label>
                        <textarea
                            required
                            rows="5"
                            className="input"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Price ($)</label>
                            <input
                                type="number"
                                required
                                className="input"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Category</label>
                            <select
                                className="input"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Status</label>
                        <div className="flex space-x-4">
                            {["DRAFT", "PUBLISHED"].map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    className={`py-2 px-6 rounded-full text-xs font-bold transition-all ${formData.status === s ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                                    onClick={() => setFormData({ ...formData, status: s })}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Product Images</label>
                    <div className="grid grid-cols-3 gap-4">
                        {previewImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removePreview(idx, img.isNew, img.public_id)}
                                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 shadow-sm hover:bg-white"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {previewImages.length < 5 && (
                            <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 cursor-pointer transition-all">
                                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Upload</span>
                                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        )}
                    </div>
                    <p className="text-xs text-gray-400">You can upload up to 5 images. High-quality JPG/PNG preferred.</p>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn btn-primary py-4 font-bold flex items-center justify-center text-lg shadow-lg shadow-black/10"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <><Save className="w-5 h-5 mr-3" /> {initialData ? "Update Product" : "Publish Product"}</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
