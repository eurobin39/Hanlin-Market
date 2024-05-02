'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function ChatTypeButton() {

    const pathname = usePathname();

    return (
        <div className="flex flex-col">

            <div className="pt-20 pb-5 px-4 container mx-auto max-w-screen-sm">
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/chats/product-chat">
                        <div className="flex items-center justify-center bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded border-b-2 border-gray-400">
                            PRODUCT
                        </div>
                    </Link>
                   
                    <Link href="/chats/property-chat">
                        <div className="flex items-center justify-center bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded border-b-2 border-gray-400">
                            PROPERTY
                        </div>
                    </Link>
                </div>
            </div>
            
        </div>
    );
}
