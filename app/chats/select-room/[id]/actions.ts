import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function selectRoom(productId: number) {
  const session = await getSession();
  const userId = session?.id;  // 현재 세션의 사용자 ID

  if (!userId) {
    console.log('사용자가 로그인하지 않았습니다.');
    return [];
  }

  const chatRooms = await db.chatRoom.findMany({
    where: {
      productId: productId,
      AND: [
        {
          OR: [
            { deletedByUserId: null },
            { deletedByUserId: { not: userId } }
          ]
        }
      ],
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

   const chatRoomDetails = await Promise.all(chatRooms.map(async (room) => {
    const latestMessage = await db.message.findFirst({
      where: { chatRoomId: room.id },
      orderBy: { created_At: 'desc' },
      include: { user: true },
    });

    // 채팅방 삭제 상태 추가
    const isDeleted = room.deletedByUserId ? true : false;

    return {
      roomId: room.id,
      isDeleted,  // 채팅방이 삭제되었는지 여부
      participants: room.users.filter(user => user.id !== userId).map(user => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      })),
      latestMessage: latestMessage ? `${latestMessage.user.username}: ${latestMessage.payload}` : '대화를 시작하세요',
    };
  }));

  return chatRoomDetails;
}
