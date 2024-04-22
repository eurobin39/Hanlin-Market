'use server'

import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function deleteChatRoomAction(chatId: string) {
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
        return false;
    }

    // 채팅방에서 사용자를 제거합니다.
    try {
        const chatRoom = await db.chatRoom.update({
            where: {
                id: chatId,
            },
            data: {
                users: { 
                    disconnect: [{ id: userId }]
                },
                deletedByUserId: userId,
        },

        });

    return true; // 성공적으로 처리된 경우
} catch (error) {
    console.error("Failed to remove user from chat room:", error);
    return false; // 처리 중 오류 발생
}
}
