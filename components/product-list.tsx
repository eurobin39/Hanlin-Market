"use client"

import { useEffect, useRef, useState } from "react";
import ListProduct from "./list-products";
import { InitialProducts } from "@/app/(tabs)/home/page";
import { getMoreProducts } from "@/app/(tabs)/home/actions";

interface ProductListProps {
    initialProducts: InitialProducts;

}
export default function ProductList({ initialProducts }: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const trigger = useRef<HTMLSpanElement>(null);
    useEffect(() => {
      const observer = new IntersectionObserver(
        async (
          entries: IntersectionObserverEntry[],
          observer: IntersectionObserver
        ) => {
          const element = entries[0];
          if (element.isIntersecting && trigger.current) {
            observer.unobserve(trigger.current);
            setIsLoading(true);
            const newProducts = await getMoreProducts(page + 1);
            
            if (newProducts.length !== 0) {
              setProducts((prev) => [...prev, ...newProducts]);
              setPage((prev) => prev + 1);
            } else {
              setIsLastPage(true);
            }
            setIsLoading(false);
          }
        },
        {
          threshold: 1.0,
        }
      );
      if (trigger.current) {
        observer.observe(trigger.current);
      }
      return () => {
        observer.disconnect();
      };
    }, [page]);

    
    return (
        
        <div className="">
            <div className="p-2 flex flex-col gap-2">
                {products.map((product) => (<ListProduct key={product.id}
                    {...product} />))}
                    {!isLastPage ? ( <span
                    ref={trigger}
                    className="mb-30 text-sm font-semibold bg-emerald-400 w-fit mx-auto px-3 py-2 rounded-md hover:placeholder-opacity-90 active:scale-95">
                    {isLoading ? "Loading" : "Load More"}
                </span>) : null}   
            </div>
        </div>
    )
}