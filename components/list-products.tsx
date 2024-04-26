import Link from "next/link";
import Image from "next/image";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";

interface ListProductsProps {
    title: string;
    price: number;
    created_At: Date;
    photo: string;
    id: number;
    like?: boolean;
}

export default function ListProduct({
    title, price, created_At, photo, id, like
}: ListProductsProps) {
    return (
        <div className="p-4 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        
            <Link href={`/products/${id}`} className="flex gap-5 py-2 w-full">
                <div className="relative size-24 rounded-md overflow-hidden" >
                    <div>
                        <Image
                            fill
                            src={`${photo}/avatar`}
                            className="object-cover"
                            alt={title}
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-1 *:text-white">
                    <span className="font-bold">{title}</span>
                    <span>{formatToTimeAgo(created_At.toString())}</span>
                    <span>€{formatToWon(price)}</span>
                </div>


            </Link>
            <div>
                like:{like};
            </div>

        </div>

    )
}