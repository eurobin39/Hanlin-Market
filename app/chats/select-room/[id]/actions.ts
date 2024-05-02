import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function selectRoom(productId: number) {
  const session = await getSession();
  const userId = session?.id;

  if (!userId) {
    console.log('사용자가 로그인하지 않았습니다.');
    return [];
  }

  try {
    const chatRooms = await db.chatRoom.findMany({
      where: {
        productId: productId,
        AND: {
          OR: [
            { deletedByUserId: null },
            { deletedByUserId: { not: userId } }
          ]
        },
      },
      include: {
        users: true,
        RoomUserStates: {
          where: { userId: userId },
        },
        messages: {
          orderBy: { created_At: 'desc' },
          take: 1,
          include: { user: true },
        }
      },
    });

    // 각 채팅방에 대해 읽지 않은 메시지 수 계산
    const chatRoomDetails = await Promise.all(chatRooms.map(async (room) => {
      const lastReadAt = room.RoomUserStates[0]?.lastReadAt || new Date(0);
     
      
      // 읽지 않은 메시지의 총 수를 계산
      const unreadCount = await db.message.count({
        where: {
          chatRoomId: room.id,
          created_At: { gt: lastReadAt },
          userId: { not: userId }
        }
      });

      return {
        roomId: room.id,
        isDeleted: room.deletedByUserId ? true : false,
        participants: room.users.filter(user => user.id !== userId).map(user => ({
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        })),
        latestMessage: room.messages[0] ? `${room.messages[0].user.username}: ${room.messages[0].payload}` : 'No messages yet',
        unreadCount: unreadCount
      };
    }));

    return chatRoomDetails;
  } catch (error) {
    console.error('서버에서 채팅방 정보를 가져오는 중 오류가 발생했습니다.', error);
    throw new Error('Failed to fetch chat rooms');
  }
}
