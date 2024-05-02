import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function selectRoom(productId: number) {
  const session = await getSession();
  const userId = session?.id;

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
      RoomUserStates: {
        where: { userId: userId },
        select: {
          lastReadAt: true,
        }
      }
    },
  });

  const chatRoomDetails = await Promise.all(chatRooms.map(async (room) => {
    // Update lastReadAt when the user enters the chat room
    const roomUserState = await db.roomUserState.upsert({
      where: {
        chatRoomId_userId: {
          chatRoomId: room.id,
          userId: userId
        },
      },
      update: {
        lastReadAt: new Date()
      },
      create: {
        chatRoomId: room.id,
        userId: userId,
        lastReadAt: new Date()
      }
    });

    const latestMessage = await db.message.findFirst({
      where: { chatRoomId: room.id },
      orderBy: { created_At: 'desc' },
      include: { user: true },
    });

    const lastReadAt = room.RoomUserStates[0]?.lastReadAt || new Date();

    const unreadCount = await db.message.count({
      where: {
        chatRoomId: room.id,
        created_At: { gt: lastReadAt },
        userId: { not: userId }
      }
    });

    const isDeleted = room.deletedByUserId ? true : false;



    return {
      roomId: room.id,
      isDeleted,
      participants: room.users.filter(user => user.id !== userId).map(user => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      })),
      latestMessage: latestMessage ? `${latestMessage.user.username}: ${latestMessage.payload}` : 'No messages yet',
      unreadCount,
    };
  }));

  return chatRoomDetails;
}


