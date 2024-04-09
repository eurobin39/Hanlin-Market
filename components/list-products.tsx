import Link from "next/link";
import Image from "next/image";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";

interface ListProductsProps {
    title: string;
    price: number;
    created_At: Date;
    photo: string;
    id: number;
}

export default function ListProduct({
    title, price, created_At, photo, id,
}: ListProductsProps) {
    return (
        <div className="">
            <Link href={`/products/${id}`} className="flex gap-5 border-b pb-5  w-full border-gray-600">
                <div className="relative size-32 rounded-md overflow-hidden" >
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

        </div>

    )
}