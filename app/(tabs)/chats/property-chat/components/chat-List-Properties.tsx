import Link from "next/link";
import Image from "next/image";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";

interface ChatListPropertiesProps {
    title: string;
    price: number;
    created_At: Date;
    photos: string[];
    id: number;
    chatRoomId: string;
    numberOfChatRoom?: number;
}

export default function ChatListProperty({
    title, price, created_At, photos, id, numberOfChatRoom
}: ChatListPropertiesProps) {
    
    return (
        <div className="p-4 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link href={`/chats/select-room/properties-chat/${id}`} className="flex gap-5 items-center justify-between w-full py-2">
                <div className="flex gap-5 items-center">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                        <Image
                            layout="fill"
                            src={`${photos[0]}/avatar`}
                            objectFit="cover"
                            alt={title}
                        />
                    </div>
                    <div className="flex flex-col justify-center text-white gap-1">
                        <span className="font-bold">{title}</span>
                        <span>{formatToTimeAgo(created_At.toString())}</span>
                        <span>€{formatToWon(price)}</span>
                    </div>
                </div>
                <div className="text-white font-bold">
                    {numberOfChatRoom ? `Chat Rooms: ${numberOfChatRoom}` : 'No active chats'}
                </div>
            </Link>
        </div>
    );
}
