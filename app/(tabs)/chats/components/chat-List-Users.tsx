import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ChatRoomListProps {
    id: string;
    productName: string;
    productPhoto: string;
    lastMessage: string;
    lastMessageTime: Date;
}

// 단일 채팅방 정보를 사용하여 화면에 렌더링합니다.
export default function ChatRoom({
        id, productName, productPhoto, lastMessage, lastMessageTime
    }: ChatRoomListProps) {

    return (
        <div className="p-2">
            <div className="border-b pb-5">
                <Link href={`/chats/${id}`}>
                    <a className="flex gap-5 items-center">
                        <div className="w-16 h-16 relative">
                            {/* Image 컴포넌트 사용 시 주의: 'layout="fill"' 사용 시 부모 div에 width와 height를 지정해야 합니다. */}
                            <Image src={productPhoto} alt={productName} layout="fill" objectFit="cover" className="rounded-md" />
                        </div>
                        <div>
                            <h2 className="font-bold">{productName}</h2>
                            <p className="text-sm">{lastMessage}</p>
                            <p className="text-xs text-gray-500">{lastMessageTime.toLocaleString()}</p>
                        </div>
                    </a>
                </Link>
            </div>
        </div>
    );
};
