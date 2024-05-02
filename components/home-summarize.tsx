import Link from "next/link";
import Image from "next/image";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import ChatDeleteButton from "@/app/chats/[id]/chatRoomDeleteButton";

interface ChatListSumPropertyProps {
    title: string;
    price: number;
    photos: string[];
    id: number;
    chatroomId: string;

}

export default function PropertySummarize({
    title, price, photos, id, chatroomId
}: ChatListSumPropertyProps) {

    return (
        // sticky 속성을 추가하여 위치 고정
        <div className="flex gap-3 items-center border-b p-2 w-full border-gray-600 sticky top-0 z-10 bg-gray-900">
            <Link href={`/chats/select-room/${id}`}
                className="flex items-center justify-center h-10 w-10 rounded-full">
                <ChevronLeftIcon className="size-12 text-gray-600" />
            </Link>

            <Link href={`/products/${id}`} className="flex gap-5 p-2 w-full border-gray-600">
                <div className="relative size-16 rounded-md overflow-hidden" >
                    <div>
                        <Image
                            fill
                            src={`${photos[0]}/avatar`}
                            className="object-cover"
                            alt={title}
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-1 *:text-white">
                    <span className="font-bold">{title}</span>
                    <span>€{formatToWon(price)}</span>
                </div>
            </Link>
            <ChatDeleteButton chatId={chatroomId} />
        </div>
    )
}
