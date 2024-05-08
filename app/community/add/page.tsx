"use client"

import Button from "@/components/button";
import Input from "@/components/input";
import React, { useState, useEffect } from "react";
import { getCategories , uploadProduct } from "./actions";
import { useFormState } from "react-dom";

export default function AddProduct() {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            const categoryData = await getCategories();
            setCategories(categoryData);
        }
        fetchCategories();
    }, []);

    const handleCategorySelect = (id: number, name: string) => {
        console.log("Selected category ID:", id); // 로그 확인
        setSelectedCategoryId(id.toString());
        setDropdownOpen(false);
    };
    


    const interceptAction = async (_: any, formData: FormData) => {
        formData.set("categoryId", selectedCategoryId);
        
        return uploadProduct(_, formData);
    };

    const [state, action] = useFormState(interceptAction, null);

    return (
        <div>
            <form action={action} className="flex flex-col gap-5">

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

                <Input name="title" required placeholder="Title" type="text" errors={state?.fieldErrors.title} />
                <Input name="description" required placeholder="Description" type="text" errors={state?.fieldErrors.description} />
                <Button text="Upload" />
            </form >
        </div >
    )
}