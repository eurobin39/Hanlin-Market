import db from "@/lib/db"

import ProductList from "@/components/product-list";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";
import CategoryList from "@/components/categoryList";
import SearchBar from "@/components/SearchBar";




export async function getInitialProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_At: true,
            photo: true,
            status: true,
            categoryId: true,
            id: true,
            _count: {
                select: {
                    like: true,
                }
            }
        },
        take: 1,
        orderBy: {
            created_At: "desc",
        }
    });
    return products;

}

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
    const initialProducts = await getInitialProducts();

    //console.log(initialProducts);
    return (
        <div className="mb-20 gap-1">

            <div className="flex mt-16 z-auto w-full gap-64 h-8">
                <div className="pt-2 w-32">
                    <CategoryList />
                </div>

                <div className="fixed top-0 w-full mx-auto max-w-screen-sm flex items-center
              px-5 py-3 z-50">
                    <div className="absolute mt-4 pt-1 right-3">
                        <SearchBar />
                    </div>
                </div>
            </div>




            <ProductList initialProducts={initialProducts} />

            <div className="fixed bottom-32 w-full mx-auto max-w-screen-sm flex items-center
             justify-centerpx-5 py-">
                <Link href="/products/add" className="bg-emerald-500 flex items-center justify-center
            rounded-full size-16 absolute right-12 text-white transition-colors hover:bg-emerald-400 ">
                    <PlusIcon className="size-10" />
                </Link>
            </div>

        </div>

    )
}