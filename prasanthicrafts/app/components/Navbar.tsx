"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Category = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
};

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from("categories").select("*");
            setCategories(data || []);
        }
        fetchCategories();
    }, []);

    return (
        <nav className="fixed w-full z-50 top-0 start-0 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold tracking-tight text-black">
                        Prasanthi<span className="text-yellow-500">Crafts</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors">
                        Home
                    </Link>

                    {/* Categories Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowCategories(true)}
                        onMouseLeave={() => setShowCategories(false)}
                    >
                        <button className="text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors flex items-center gap-1">
                            Categories
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showCategories && categories.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                {categories.map((cat) => (
                                    <a
                                        key={cat.id}
                                        href={`#category-${cat.slug}`}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                                    >
                                        {cat.image_url && (
                                            <img src={cat.image_url} alt={cat.name} className="w-6 h-6 rounded object-cover" />
                                        )}
                                        {cat.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <a href="#products" className="text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors">
                        Products
                    </a>
                    <a href="#reviews" className="text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors">
                        Reviews
                    </a>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
                    <Link href="/" className="block py-2.5 px-3 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-50">
                        Home
                    </Link>
                    <a href="#products" className="block py-2.5 px-3 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-50">
                        Products
                    </a>
                    {categories.length > 0 && (
                        <div className="py-2">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Categories</p>
                            {categories.map((cat) => (
                                <a
                                    key={cat.id}
                                    href={`#category-${cat.slug}`}
                                    className="block py-2 px-3 text-sm text-gray-700 rounded-lg hover:bg-yellow-50"
                                >
                                    {cat.name}
                                </a>
                            ))}
                        </div>
                    )}
                    <a href="#reviews" className="block py-2.5 px-3 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-50">
                        Reviews
                    </a>
                </div>
            )}
        </nav>
    );
}
