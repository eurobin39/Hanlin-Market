'use server'

import getSession from "@/lib/session";
import db from "@/lib/db";
import { notFound, redirect, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";



export async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: { id: session.id, },
            select: {
                reputationScore: true,
                username: true,
                avatar: true,
                like: {
                    select: {
                        product: {
                            select: {
                                id: true,
                                photo: true,
                                title: true,
                                price: true,
                                status: true,
                            }
                        },
                    }
                },
                Saved: {
                    select: {
                        home: {
                            select: {
                                id: true,
                                photos: true,
                                title: true,
                                price: true,
                                status: true,
                            }
                        },
                    }
                },
            }

        });
        if (user) {
            return user;
        }
    }
    notFound();
}



export default async function Profile() {

    const user = await getUser();

    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy();
        redirect("/");
    };

    const scorePercentage = (user.reputationScore / 100) * 100;

    const getGaugeColor = (score: number) => {
        if (score >= 90) return "bg-gradient-to-r from-purple-500 via-blue-500 to-red-500 animate-pulse";
        if (score >= 70) return "bg-green-500";
        if (score >= 50) return "bg-yellow-500";
        if (score >= 30) return "bg-orange-500";
        return "bg-red-500";
    };

    const gaugeClass = getGaugeColor(user.reputationScore);

    return (
        <div className="p-4 my-20 rounded-lg shadow-md flex flex-col gap-2 items-center text-white">
            <div className="flex justify-between  bg-gray-700 rounded-lg items-center w-full p-4">
                <div className="flex items-center space-x-4">
                    {user.avatar ? (
                        <Image src={user.avatar} alt={user.username} width={100} height={100} className="rounded-full" />
                    ) : (
                        <Image src="/default-avatar.jpg" alt="Default Avatar" width={100} height={100} className="rounded-full" />
                    )}
                    <div className="flex-1">
                        <h1 className="text-xl font-bold">{user.username}</h1>
                        <div className="text-sm">
                            Reputation Value: {user.reputationScore}
                        </div>
                        <div className="w-32 h-3 bg-gray-300 rounded-full overflow-hidden mt-3">
                            <div className={`h-full ${gaugeClass} rounded-l-full transition-all duration-300`} style={{ width: `${scorePercentage}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Link href="/profile/edit"className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        프로필 수정
                    </Link>
                    <button onClick={logOut} className="p-2 bg-red-500 rounded hover:bg-red-600">
                        로그아웃
                    </button>
                </div>
            </div>
            <div className="rounded-lg bg-gray-700 p-4 mt-5 w-full">
                <h1 className="text-lg font-bold">좋아요 누른 품목</h1>
                <div className="flex overflow-x-auto py-2 space-x-4">
                    {user.like.map(({ product }) => {
                        let displayStatus;
                        let statusColor;
                        switch (product.status) {
                            case "ACTIVE":
                                displayStatus = "판매중";
                                statusColor = "bg-green-400"; // 연두색
                                break;
                            case "RESERVED":
                                displayStatus = "예약중";
                                statusColor = "bg-blue-400"; // 연파랑
                                break;
                            case "COMPLETED":
                                displayStatus = "판매완료";
                                statusColor = "bg-red-400"; // 연빨강
                                break;
                            default:
                                displayStatus = "판매중"; // 이외의 상태에 대한 기본 값
                                statusColor = "bg-green-400"; // 기본 색상도 연두색
                        }
                        return (
                            <Link key={product.id} href={`/products/${product.id}`}>
                                <div className="block min-w-[200px] h-[260px] bg-gray-600 rounded-lg shadow overflow-hidden *:text-white relative">
                                    <div className="flex justify-center items-center h-2/3 w-full overflow-hidden">
                                        <Image src={`${product.photo}/public`} alt={product.title} layout="intrinsic" width={200} height={160} objectFit="contain" className="bg-white" />
                                    </div>
                                    
                                    <div className="flex flex-col gap-4 p-2 h-1/3 border-t-2 border-neutral-400">
                                        <span className="text-xl font-bold">{product.title}</span>
                                        <span className="text-md font-semibold">€{product.price}</span>
                                    </div>
                                    <div className={`absolute bottom-2 right-2 px-2 py-1 ${statusColor} rounded-xl text-xs font-semibold`}>
                                        {displayStatus}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <div className="rounded-lg bg-gray-700 p-4 mt-5 w-full">
                <h1 className="text-lg font-bold">저장된 부동산</h1>
                <div className="flex overflow-x-auto py-2 space-x-4">
                    {user.Saved.map(({ home }) => {
                        let displayStatus;
                        let statusColor;
                        switch (home.status) {
                            case "ACTIVE":
                                displayStatus = "판매중";
                                statusColor = "bg-green-400"; // 연두색
                                break;
                            case "RESERVED":
                                displayStatus = "예약중";
                                statusColor = "bg-blue-400"; // 연파랑
                                break;
                            case "COMPLETED":
                                displayStatus = "판매완료";
                                statusColor = "bg-red-400"; // 연빨강
                                break;
                            default:
                                displayStatus = "판매중"; // 이외의 상태에 대한 기본 값
                                statusColor = "bg-green-400"; // 기본 색상도 연두색
                        }
                        return (
                            <Link key={home.id} href={`/properties/${home.id}`}>
                                <div className="block min-w-[400px] h-[260px] bg-gray-600 rounded-lg shadow overflow-hidden *:text-white relative">
                                    <div className="flex justify-center items-center h-2/3 w-full overflow-hidden">
                                        <Image src={`${home.photos[0]}/public`} alt={home.title} layout="intrinsic" width={200} height={160} objectFit="contain" className="bg-white" />
                                    </div>
                                    
                                    <div className="flex flex-col gap-4 p-2 h-1/3 border-t-2 border-neutral-400">
                                        <span className="text-xl font-bold">{home.title}</span>
                                        <span className="text-md font-semibold">€{home.price}</span>
                                    </div>
                                    <div className={`absolute bottom-2 right-2 px-2 py-1 ${statusColor} rounded-xl text-xs font-semibold`}>
                                        {displayStatus}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}