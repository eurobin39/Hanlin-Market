
"use client";

import { useEffect, useRef, useState } from "react";
import ListProduct from "./list-products";
import { InitialCategoryProducts } from "@/app/category/[id]/page";
import { getMoreCategoryProducts } from "@/app/category/[id]/actions";
import CategoryListProduct from "./categoryListProduct";

interface ProductListProps {
    initialCategoryProducts: InitialCategoryProducts;
    categoryId?: number; // Added categoryId here
}

export default function CategoryProductList({ initialCategoryProducts, categoryId }: ProductListProps) {
    const [products, setProducts] = useState<InitialCategoryProducts>(initialCategoryProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const trigger = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries) => {
                const element = entries[0];
                if (element.isIntersecting && !isLastPage) {
                    observer.unobserve(trigger.current!);
                    setIsLoading(true);
                    const newProducts = await getMoreCategoryProducts(page + 1, categoryId); // Now includes categoryId

                    if (newProducts && newProducts.length > 0) {
                        setProducts(prev => [...prev, ...newProducts]);
                        setPage(prev => prev + 1);
                    } else {
                        setIsLastPage(true);
                    }
                    setIsLoading(false);
                    observer.observe(trigger.current!);
                }
            },
            { threshold: 0.1 }
        );

        if (trigger.current) {
            observer.observe(trigger.current);
        }

        return () => observer.disconnect();
    }, [page, isLastPage, categoryId]); // Added categoryId to the dependencies array

    return (
        <div className="p-2 flex flex-col gap-5">
            {products.map((product) => (
                <CategoryListProduct key={product.id} {...product} />
            ))}
            {!isLastPage && (
                <span ref={trigger} className="mb-30 text-sm font-semibold bg-emerald-400 w-fit mx-auto px-3 py-2 rounded-md hover:bg-emerald-500 cursor-pointer">
                    {isLoading ? "Loading..." : "Load More"}
                </span>
            )}
        </div>
    );
}
