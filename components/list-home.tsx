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
    id: number;
    _count: {
        saved: number;
    }
}

export default function ListProperties({
    title, price, location, contractEnd, contractStart, photos, id, _count
}: ListPropertiesProps) {

    let imageUrl = photos?.length > 0 ? photos[0] : '/default-image.png';

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

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

            <div className="absolute bottom-6 right-6 flex items-center space-x-2">
                <BookmarkIcon className="h-6 w-6 text-red-500" />
                <span className="text-white">{_count.saved}</span>
            </div>
        </div>
    );
}
