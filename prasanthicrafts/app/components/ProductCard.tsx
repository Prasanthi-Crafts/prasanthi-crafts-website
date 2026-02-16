"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

interface Product {
    id: number;
    name: string;
    price: number;
    image: string; // url
    category: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <a href="#" className="block relative h-64 overflow-hidden rounded-t-lg bg-gray-100 group">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 group-hover:bg-gray-300 transition-colors">
                    {/* Placeholder for product image */}
                    <span className="text-lg font-medium">{product.name} Image</span>
                </div>
                {/*
        <Image 
            className="p-8 rounded-t-lg object-contain" 
            src={product.image} 
            alt={product.name} 
            fill
        />
        */}
            </a>
            <div className="px-5 py-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">{product.category}</span>
                </div>
                <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2 truncate">
                        {product.name}
                    </h5>
                </a>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <button
                        onClick={addToCart}
                        className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300"
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
}
