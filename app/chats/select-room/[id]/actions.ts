// lib/selectRoom.ts

import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function selectRoom(productId: number) {
  const session = await getSession();
  const userId = session?.id; // 현재 세션의 사용자 ID

  if (!userId) {
    console.log('사용자가 로그인하지 않았습니다.');
    return [];
  }

  // productId에 연결된 모든 채팅방과 그 참여자들을 조회합니다.
  const chatRooms = await db.chatRoom.findMany({
    where: {
      productId: productId,
    },
    include: {
      users: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  // 각 채팅방에 대한 최근 메시지를 조회합니다.
  const chatRoomDetails = await Promise.all(chatRooms.map(async (room) => {
    const latestMessage = await db.message.findFirst({
      where: { chatRoomId: room.id },
      orderBy: { created_At: 'desc' },
      include: { user: true }, // 메시지를 보낸 사용자 정보를 포함하여 불러옵니다.
    });
  
    return {
      roomId: room.id,
      participants: room.users.filter(user => user.id !== userId).map(user => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      })),
      latestMessage: latestMessage ? `${latestMessage.user.username}: ${latestMessage.payload}` : '', // 보낸 사람의 이름과 메시지의 내용을 조합
    };
  }));

  return chatRoomDetails;
}
