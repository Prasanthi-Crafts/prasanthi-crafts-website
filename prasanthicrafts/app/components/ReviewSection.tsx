"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Review = {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    products: { name: string } | null;
};

export default function ReviewSection() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        async function fetchReviews() {
            const { data } = await supabase
                .from("reviews")
                .select("*, products(name)")
                .order("created_at", { ascending: false })
                .limit(6);
            setReviews(data || []);
        }
        fetchReviews();
    }, []);

    if (reviews.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50" id="reviews">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Testimonials</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">What Our Customers Say</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Comment */}
                            <p className="text-gray-600 leading-relaxed mb-5 italic">
                                &ldquo;{review.comment}&rdquo;
                            </p>

                            {/* Reviewer */}
                            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                                    {review.user_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{review.user_name}</p>
                                    {review.products?.name && (
                                        <p className="text-xs text-gray-400">Purchased: {review.products.name}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
