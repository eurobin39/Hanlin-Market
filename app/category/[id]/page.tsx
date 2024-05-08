
import db from "@/lib/db"
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";
import CategoryList from "@/components/categoryList";


export async function getCategoryInitialProducts(categoryId?: number) {
    const categoryProducts = db.product.findMany({
        where: {
            categoryId: categoryId,
        },
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
        take: 10,
        orderBy: {
            created_At: "desc",
        }
    });

    return categoryProducts;
}


import CategoryProductList from "@/components/categoryProductList";

export type InitialCategoryProducts = Prisma.PromiseReturnType<typeof getCategoryInitialProducts>;

export default async function Products({ params
}: {
  params: { id: string };
}
) {
  const categoryId = Number(params.id);


    console.log(categoryId);
    // Fetch initial products based on categoryId
    const initialCategoryProducts = await getCategoryInitialProducts(categoryId);

    console.log(initialCategoryProducts);

    return (
        <div className="mb-20">
            <div className="mt-20 z-auto">
                <CategoryList/>
            </div>
            <CategoryProductList initialCategoryProducts={initialCategoryProducts} categoryId={categoryId}/>
            <div className="fixed bottom-32 w-full mx-auto max-w-screen-sm flex items-center
                justify-center px-5 py-3">
                <Link href="/products/add" className="bg-emerald-500 flex items-center justify-center
                rounded-full size-16 absolute right-12 text-white transition-colors hover:bg-emerald-400 ">
                    <PlusIcon className="size-10" />
                </Link>
            </div>
        </div>
    );
}
