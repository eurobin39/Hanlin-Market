import db from "@/lib/db"
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/20/solid";
import PropertyList from "@/components/home-list";
import SearchHome from "@/components/searchHome";




export async function getInitialProperties() {
    const properties = await db.home.findMany({
        select: {
            title: true,
            price: true,
            contractEnd: true,
            contractStart: true,
            location: true,
            photos: true,
            status: true,
            id: true,
            _count: {
                select: {
                    saved: true,
                }
            }
        },
        take: 1,
        orderBy: {
            created_At: "desc",
        }
    });
    return properties;

}

export type InitialProperties = Prisma.PromiseReturnType<typeof getInitialProperties>;

export default async function Properties() {
    const initialProperties = await getInitialProperties();

    return (
        <div >
            <div className="fixed top-0 w-full mx-auto max-w-screen-sm flex items-center
              px-5 py-3 z-50">
                <div className="absolute mt-4 pt-1 right-3">
                    <SearchHome />
                </div>
            </div>

            <PropertyList initialProperties={initialProperties} />
            <div className="fixed bottom-32 w-full mx-auto max-w-screen-sm flex items-center
             justify-centerpx-5 py-3">
                <Link href="/properties/add" className="bg-emerald-500 flex items-center justify-center
            rounded-full size-16 absolute right-12 text-white transition-colors hover:bg-emerald-400 ">
                    <PlusIcon className="size-10" />
                </Link>
            </div>

        </div>

    )
}