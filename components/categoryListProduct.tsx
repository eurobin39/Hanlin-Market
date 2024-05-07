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
    status: string;
    _count: {
        like: number;
    }
}

export default function CategoryListProduct({
    title, price, created_At, photo, id, status, _count
}: ListProductsProps) {

    let displayStatus;
    switch (status) {
        case "ACTIVE":
            displayStatus = "판매중";
            break;
        case "RESERVED":
            displayStatus = "예약중";
            break;
        case "COMPLETED":
            displayStatus = "판매완료";
            break;
        default:
            displayStatus = "판매중"; // 이외의 상태에 대한 기본 값
    }

    
    const isCompleted = status === "COMPLETED";

    return (
        <div className={`p-4 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative ${isCompleted ? "bg-gray-400 " : ""}`}>
            {isCompleted ? (
                <Link href={`/products/${id}`}>
                    <div className="flex gap-5 py-2 w-full">
                        <div className="relative size-24 rounded-md overflow-hidden">
                            <Image
                                src={`${photo}/avatar`}
                                layout="fill"
                                className="object-cover"
                                alt={title}
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-1 text-white">
                            <span className="font-bold">{title}</span>
                            <span>{formatToTimeAgo(created_At.toString())}</span>
                            <span>€{formatToWon(price)}</span>
                        </div>
                    </div>
                </Link>
            ) : (
                <Link href={`/products/${id}`}>
                    <div className="flex gap-5 py-2 w-full">
                        <div className="relative size-24 rounded-md overflow-hidden">
                            <Image
                                src={`${photo}/avatar`}
                                layout="fill"
                                className="object-cover"
                                alt={title}
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-1 text-white">
                            <span className="font-bold">{title}</span>
                            <span>{formatToTimeAgo(created_At.toString())}</span>
                            <span>€{formatToWon(price)}</span>
                        </div>
                    </div>
                </Link>
            )}

            <div className="absolute bottom-16 right-6 flex items-center space-x-2">
                <span className="text-white font-semibold">{displayStatus}</span>
            </div>

            <div className="absolute bottom-6 right-6 flex items-center space-x-2">
                <HeartIcon className="h-6 w-6 text-red-500" />
                <span className="text-white font-semibold">{_count.like}</span>
            </div>
        </div>
    );
}

//