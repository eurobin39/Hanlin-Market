import Link from "next/link";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import { HeartIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { BookmarkIcon } from "@heroicons/react/24/solid";

interface ListPropertiesProps {
    title: string;
    price: number;
    contractEnd: Date | null;
    contractStart: Date | null;
    location: string;
    photos: string[];
    status: string;
    id: number;
    _count: {
        saved: number;
    }
}

export default function ListProperties({
    title, price, location, contractEnd, contractStart, photos, id, _count, status
}: ListPropertiesProps) {

    let displayStatus;
    let statusColor;
    switch (status) {
        case "ACTIVE":
            displayStatus = "임대가능";
            statusColor = "bg-green-400"; // 연두색
            break;
        case "RESERVED":
            displayStatus = "계약중";
            statusColor = "bg-blue-400"; // 연파랑
            break;
        case "COMPLETED":
            displayStatus = "계약완료";
            statusColor = "bg-red-400"; // 연빨강
            break;
        default:
            displayStatus = "임대가능"; // 이외의 상태에 대한 기본 값
            statusColor = "bg-green-400"; // 기본 색상도 연두색
    }



    let imageUrl = photos?.length > 0 ? photos[0] : '/default-image.png';


    return (
        <div className="p-4 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative">
            <Link href={`/properties/${id}`} className="flex gap-5 py-2 w-full">
                <div className="relative size-24 rounded-md overflow-hidden">
                    <Image
                        fill
                        src={`${imageUrl}/avatar`}
                        className="object-cover"
                        alt={title}
                    />
                </div>
                <div className="flex flex-col justify-center gap-1 text-white">
                    <span className="font-bold">{title}</span>
                    <span>{location}</span>
                    <span>
                        {contractStart ? contractStart.toISOString().split('T')[0] : '계약 시작일 미정'} ~
                        {contractEnd ? contractEnd.toISOString().split('T')[0] : '계약 종료일 미정'}
                    </span>
                    <span>€{formatToWon(price)}</span>
                </div>

            </Link>
            <div className={`absolute bottom-14 right-6 flex items-center space-x-2 px-3 py-1 ${statusColor} rounded-xl`}>
                <span className="text-white font-semibold">{displayStatus}</span>
            </div>

            <div className="absolute bottom-6 right-6 flex items-center space-x-2">
                <BookmarkIcon className="h-6 w-6 text-red-500" />
                <span className="text-white">{_count.saved}</span>
            </div>
        </div>
    );
}
