"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Category = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
};

export default function CategorySection() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from("categories").select("*").order("created_at", { ascending: true });
            setCategories(data || []);
        }
        fetchCategories();
    }, []);

    if (categories.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50" id="categories">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Browse</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Shop by Category</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <a
                            key={category.id}
                            href={`#category-${category.slug}`}
                            id={`category-${category.slug}`}
                            className="group relative h-52 md:h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Background */}
                            {category.image_url ? (
                                <img
                                    src={category.image_url}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                            {/* Label */}
                            <div className="absolute inset-0 flex items-end p-5">
                                <div>
                                    <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-yellow-300 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/60 text-xs mt-1 group-hover:text-white/80 transition-colors">
                                        Explore →
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
