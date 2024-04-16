'use server'

import ChatProductList from "@/components/chat-Product-List";
import db from "@/lib/db";
import getSession from "@/lib/session"; // 세션 정보를 가져오는 데 사용되는 함수
import { Prisma } from "@prisma/client";



export async function getIsOwner(userId: number) {
    const session = await getSession();
    return session.id ? session.id === userId : false;
}


export async function getChatInitialProducts(userId: number) {
    // 사용자가 속한 채팅방을 찾습니다.
    const chatRooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: userId,
                },
            },
        },
        include: {
            product: true, // 채팅방 모델과 연결된 Product 모델을 포함하여 조회합니다.
        },
    });

    // 찾은 채팅방에서 상품 정보만 추출합니다.
    const chatProducts = chatRooms.map((chatRoom) => chatRoom.product).filter((product) => product !== null);

    return chatProducts;
}

export type InitialchatProducts = Prisma.PromiseReturnType<typeof getChatInitialProducts>;

export default async function Products() {
    
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
        // 사용자가 로그인하지 않았다면, 적절한 처리를 합니다.
        console.error('사용자가 로그인하지 않았습니다.');
        return;
    }

    const chatInitialProducts = await getChatInitialProducts(userId);

   //console.log(chatInitialProducts);

    return (
       
        <div>
            <ChatProductList initialChatProducts={chatInitialProducts} />
        </div>
    );
}