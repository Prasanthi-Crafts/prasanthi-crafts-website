"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { CldUploadWidget } from 'next-cloudinary';
import toast, { Toaster } from "react-hot-toast";

type Category = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Omit<Category, 'id'>>();

    const nameValue = watch("name");

    useEffect(() => {
        fetchCategories();
    }, []);

    // Auto-generate slug from name
    useEffect(() => {
        if (nameValue && !isEditing) {
            const slug = nameValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setValue("slug", slug);
        }
    }, [nameValue, isEditing, setValue]);

    async function fetchCategories() {
        const { data, error } = await supabase.from("categories").select("*").order('created_at', { ascending: false });
        if (error) {
            toast.error("Failed to fetch categories");
        } else {
            setCategories(data || []);
        }
    }

    const onSubmit = async (data: any) => {
        try {
            if (isEditing) {
                const { error } = await supabase
                    .from("categories")
                    .update({ name: data.name, slug: data.slug, image_url: data.image_url })
                    .eq('id', isEditing);
                if (error) throw error;
                toast.success("Category updated");
            } else {
                const { error } = await supabase.from("categories").insert([data]);
                if (error) throw error;
                toast.success("Category created");
            }
            reset();
            setIsEditing(null);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };

    const handleEdit = (category: Category) => {
        setIsEditing(category.id);
        setValue("name", category.name);
        setValue("slug", category.slug);
        setValue("image_url", category.image_url);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Category deleted");
            fetchCategories();
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">{isEditing ? "Edit Category" : "New Category"}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="e.g. Home Decor"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                            <input
                                {...register("slug", { required: "Slug is required" })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm bg-gray-50 transition-all"
                                placeholder="auto-generated"
                            />
                            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message as string}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
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

                {/* List */}
                <div className="lg:col-span-2 space-y-3">
                    {categories.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <p className="text-gray-400">No categories yet. Create one to get started.</p>
                        </div>
                    ) : categories.map((cat) => (
                        <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                            {cat.image_url ? (
                                <img src={cat.image_url} alt={cat.name} className="w-14 h-14 rounded-xl object-cover" />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">/{cat.slug}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(cat)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit</button>
                                <button onClick={() => handleDelete(cat.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
