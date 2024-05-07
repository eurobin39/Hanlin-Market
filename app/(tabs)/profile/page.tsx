
import getSession from "@/lib/session";
import db from "@/lib/db";
import { notFound,useRouter } from "next/navigation";
import Image from "next/image";
import logout from "./action";



export async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: { id: session.id, },
            select: {
                reputationScore: true,
                username: true,
                avatar: true,
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
    const logoutFunction = async () => {
        logout();
    }
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
        <div className="p-4 bg-gray-500 mt-20 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                {user.avatar ? (
                    <Image src={user.avatar} alt={user.username} width={100} height={100} className="rounded-full" />
                ) : (
                    <Image src="/default-avatar.jpg" alt="Default Avatar" width={100} height={100} className="rounded-full" />
                )}
                <div className="flex-1">
                    <h1 className="text-xl font-bold">{user.username}</h1>
                    <div className="text-sm text-gray-200">
                        Reputation Value: {user.reputationScore}
                    </div>
                    <div className="w-1/2 h-5 bg-gray-300 rounded-full overflow-hidden mt-3">
                        <div className={`h-full ${gaugeClass} rounded-l-full transition-all duration-300`} style={{width: `${scorePercentage}%`}}></div>
                    </div>
                </div>
            </div>
            <button onClick={logoutFunction} className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600">
                Log Out
            </button>
        </div>
    );
}