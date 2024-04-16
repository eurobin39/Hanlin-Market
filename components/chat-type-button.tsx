'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export default function ChatTypeButton() {

    const pathname = usePathname();
    const [toBuyClicked, setToBuyClicked] = useState(false);
    const [toSellClicked, setToSellClicked] = useState(false);

    return (
        /* ${toSellClicked ? 'bg-green-900' : 'bg-gray-900'} ${toBuyClicked ? 'bg-orange-900' : 'bg-gray-900'} use for backgournd change */
        <div className="flex flex-col min-h-screen">

            <div className="pt-20 pb-20 px-4 container mx-auto max-w-screen-sm">
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        href="/chats/toBuyChats"
                        className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded  border-b-2 border-gray-400"
                        onClick={() => { setToBuyClicked(true); setToSellClicked(false); }}
                    >
                        To Buy
                    </Link>
                    {/* `To Sell` 버튼을 조건부로 숨기는 대신 여기에 유지하되, 전체 배경색 변경 로직에는 영향을 주지 않습니다. */}
                    <Link
                        href="/chats/toSellChats"
                        className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded border-b-2 border-gray-400"
                        onClick={() => { setToBuyClicked(false); setToSellClicked(true); }}
                    >
                        To Sell
                    </Link>
                </div>
            </div>

            {/* 상단과 하단 마진을 유지하며, 이 부분은 배경색 변경에서 제외됩니다. */}
            <div className="flex-1"></div>
        </div>
    );
}
