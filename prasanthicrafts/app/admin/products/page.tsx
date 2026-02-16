"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { CldUploadWidget } from 'next-cloudinary';
import toast, { Toaster } from "react-hot-toast";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: string;
    image_url: string | null;
    images: string[];
    categories?: { name: string };
};

type Category = { id: string; name: string; };

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Omit<Product, 'id'>>();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    async function fetchProducts() {
        const { data } = await supabase.from("products").select("*, categories(name)").order('created_at', { ascending: false });
        setProducts(data || []);
    }

    async function fetchCategories() {
        const { data } = await supabase.from("categories").select("*");
        setCategories(data || []);
    }

    const onSubmit = async (data: any) => {
        try {
            if (isEditing) {
                const { error } = await supabase.from("products").update(data).eq('id', isEditing);
                if (error) throw error;
                toast.success("Product updated");
            } else {
                const { error } = await supabase.from("products").insert([data]);
                if (error) throw error;
                toast.success("Product created");
            }
            reset();
            setIsEditing(null);
            fetchProducts();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };

    const handleEdit = (product: Product) => {
        setIsEditing(product.id);
        setValue("name", product.name);
        setValue("description", product.description);
        setValue("price", product.price);
        setValue("stock", product.stock);
        setValue("category_id", product.category_id);
        setValue("image_url", product.image_url);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Product deleted");
            fetchProducts();
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your store products</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">{isEditing ? "Edit Product" : "New Product"}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="Product Name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea
                                {...register("description")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="Product description..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("price", { required: true, min: 0 })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                                <input
                                    type="number"
                                    {...register("stock", { required: true, min: 0 })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <select
                                {...register("category_id")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all bg-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Main Image</label>
                            <div className="flex gap-2">
                                <input
                                    {...register("image_url")}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                    placeholder="Image URL"
                                />
                                <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(result: any) => {
                                    setValue("image_url", result.info.secure_url);
                                }}>
                                    {({ open }) => (
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
                                        >
                                            Upload
                                        </button>
                                    )}
                                </CldUploadWidget>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                            >
                                {isEditing ? "Update" : "Create"}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => { reset(); setIsEditing(null); }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Product Cards */}
                <div className="lg:col-span-2">
                    {products.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <p className="text-gray-400">No products yet. Add one to get started.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-sm transition-all">
                                    <div className="h-44 bg-gray-50 relative">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-1.5">
                                            <button onClick={() => handleEdit(product)} className="bg-white p-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="bg-white p-2 rounded-lg shadow-sm hover:bg-red-50 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                        {product.categories?.name && (
                                            <span className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{product.categories.name}</span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate">{product.description}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="font-bold text-gray-900">${product.price}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
