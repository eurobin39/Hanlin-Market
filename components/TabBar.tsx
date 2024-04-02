"use client"
import Link from "next/link"
import { HomeIcon as HomeOutline } from "@heroicons/react/24/outline"
import { HomeIcon as HomeSolid } from "@heroicons/react/24/solid"
import { ClipboardDocumentCheckIcon as ClipOutline } from "@heroicons/react/24/outline"
import { ClipboardDocumentCheckIcon as Clipsolid } from "@heroicons/react/24/solid"
import { ChatBubbleLeftRightIcon as ChatOutline } from "@heroicons/react/24/outline"
import { ChatBubbleLeftRightIcon as ChatSolid } from "@heroicons/react/24/solid"
import { UserCircleIcon as UserOutline } from "@heroicons/react/24/outline"
import { UserCircleIcon as UserSolid } from "@heroicons/react/24/solid"
import { Bars3Icon } from "@heroicons/react/24/solid"
import { usePathname } from "next/navigation"

export default function TabBar() {
    const pathname = usePathname();
    return (
        <div className="*:bg-gray-900">
            <div className="fixed bottom-0 w-full mx-auto max-w-screen-md 
            grid grid-cols-4 border-neutral-600
            border-t px-5 py-3">
                <Link className="flex flex-col  border-neutral-600
            border-r items-center gap-px" href="/products">
                    {pathname === "/products" ? (
                        <HomeSolid className="w-7 h-7" />
                    ) : (<HomeOutline className="w-7 h-7" />)}
                    <span>HOME</span>
                </Link>
                <Link className="flex flex-col  border-neutral-600
            border-r items-center gap-px" href="/community">
                    {pathname === "/community" ? (
                        <Clipsolid className="w-7 h-7" />
                    ) : (<ClipOutline className="w-7 h-7" />)}
                    <span>COMMUNITY</span>
                </Link>
                <Link className="flex flex-col  border-neutral-600
            border-r items-center gap-px" href="/chats">
                    {pathname === "/chats" ? (
                        <ChatSolid className="w-7 h-7" />
                    ) : (<ChatOutline className="w-7 h-7" />)}
                    <span>CHAT</span>
                </Link>
                <Link className="flex flex-col  
             items-center gap-px" href="/profile">
                    {pathname === "/profile" ? (
                        <UserSolid className="w-7 h-7" />
                    ) : (<UserOutline className="w-7 h-7" />)}
                    <span>PROFILE</span>
                </Link>
            </div>
            
            <div className="fixed top-0 w-full mx-auto max-w-screen-md flex items-center
             justify-center border-t border-b border-neutral-600 px-5 py-3 ">
                
                <div className="absolute left-5" style={{ width: '24px', height: '24px' }}></div>
                <Link className="text-4xl font-bold" href="/products">
                    <span>HANLIN</span>
                </Link>
                <Link className="absolute right-5" href="/profile">
                    <Bars3Icon className="w-7 h-7" />
                </Link>
            </div> 
          

        </div>


    )
}
