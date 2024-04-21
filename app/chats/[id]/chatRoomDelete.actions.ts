'use server'

import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function deleteChatRoomAction(chatId: string) {
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
        return false;
    }

    // 먼저 상품 정보를 조회합니다.
    const chatRoom = await db.chatRoom.delete({
        where: {
            id: chatId,
        },
    });


    if (!chatRoom) {
        return false;
    }

    return true;
}
