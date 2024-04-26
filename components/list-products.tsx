import Link from "next/link";
import Image from "next/image";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import { HeartIcon } from "@heroicons/react/20/solid";

interface ListProductsProps {
    title: string;
    price: number;
    created_At: Date;
    photo: string;
    id: number;
    _count: {
        like: number;
    }
}

export default function ListProduct({
    title, price, created_At, photo, id, _count
}: ListProductsProps) {
    return (
        <div className="p-4 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative">

            <Link href={`/products/${id}`} className="flex gap-5 py-2 w-full">
                <div className="relative size-24 rounded-md overflow-hidden">
                    <Image
                        fill
                        src={`${photo}/avatar`}
                        className="object-cover"
                        alt={title}
                    />
                </div>
                <div className="flex flex-col justify-center gap-1 text-white">
                    <span className="font-bold">{title}</span>
                    <span>{formatToTimeAgo(created_At.toString())}</span>
                    <span>€{formatToWon(price)}</span>
                </div>
            </Link>

            
            <div className="absolute bottom-6 right-6 flex items-center space-x-2">
                <HeartIcon className="h-6 w-6 text-red-500" />
                <span className="text-white">{_count.like}</span>
            </div>
        </div>
    )
}
