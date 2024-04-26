import db from "@/lib/db"

import ProductList from "@/components/product-list";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";



  
export async function getInitialProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_At: true,
            photo: true,
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
        <div >
            <ProductList initialProducts={initialProducts} />
            <div className="fixed bottom-32 w-full mx-auto max-w-screen-sm flex items-center
             justify-centerpx-5 py-3">
                <Link href="/products/add" className="bg-emerald-500 flex items-center justify-center
            rounded-full size-16 absolute right-12 text-white transition-colors hover:bg-emerald-400 ">
                <PlusIcon className="size-10" />
                </Link>
            </div>

        </div>

    )
}