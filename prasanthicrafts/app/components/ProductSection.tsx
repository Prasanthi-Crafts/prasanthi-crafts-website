"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string | null;
    categories: { name: string } | null;
};

export default function ProductSection() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase
                .from("products")
                .select("*, categories(name)")
                .order("created_at", { ascending: false });
            setProducts(data || []);
        }
        fetchProducts();
    }, []);

    if (products.length === 0) {
        return (
            <section className="py-20 bg-white" id="products">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Our Store</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Featured Products</h2>
                    <p className="text-gray-400 text-lg">Products will appear here once added from the admin dashboard.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white" id="products">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Our Store</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Featured Products</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                        >
                            {/* Product Image */}
                            <div className="relative h-64 bg-gray-100 overflow-hidden">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Category badge */}
                                {product.categories?.name && (
                                    <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        {product.categories.name}
                                    </span>
                                )}
                                {/* Stock badge */}
                                {product.stock <= 0 && (
                                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-yellow-600 transition-colors">
                                    {product.name}
                                </h3>
                                {product.description && (
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                                )}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-2xl font-extrabold text-gray-900">
                                        ${product.price}
                                    </span>
                                    <button className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
