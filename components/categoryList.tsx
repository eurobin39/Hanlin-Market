"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/app/products/add/actions";

export default function CategoryList() {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchCategories() {
            try {
                const categoryData = await getCategories();
                setCategories(categoryData);
                console.log("Categories fetched:", categoryData);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        }
        fetchCategories();
    }, []);

    const handleCategorySelect = (id: number, name: string) => {
        console.log("Attempting to select category:", { id, name });
        setSelectedCategoryId(id.toString());
        setDropdownOpen(false);
        router.push(`/category/${id}`)
    };

    return (
        <div>
            <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-5">
                <div onClick={() => setDropdownOpen(!dropdownOpen)} className="relative cursor-pointer border-2 border-neutral-300 text-neutral-400 rounded-md p-2">
                    {selectedCategoryId ? categories.find(cat => cat.id.toString() === selectedCategoryId)?.name : "Select a category"}
                    <div className={`${dropdownOpen ? "block" : "hidden"} absolute w-full text-neutral-100 bg-neutral-700 border-neutral-300 shadow-md mt-1 max-h-60 overflow-auto z-50`}>
                        {categories.map((category) => (
                            <div key={category.id} onClick={(e) => {
                                e.stopPropagation();  // Important to stop propagation here
                                handleCategorySelect(category.id, category.name);
                            }}
                                className="p-2 hover:bg-gray-500">{category.name}</div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
}
