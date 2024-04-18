

import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
  try{
    const room = await db.chatRoom.findUnique({
      where: {
        id,
      },
      include: {
        users: {
          select: { id: true },
        },
        product: { // 채팅방과 관련된 상품 정보도 함께 조회
          select: { userId: true }, // 상품의 소유자(판매자) ID
        },
      },
    });
    if (room) {
      const session = await getSession();
      const isParticipant = Boolean(room.users.find((user) => user.id === session.id));
      const isSeller = room.product?.userId === session.id; // 현재 사용자가 판매자인지 확인
      if (!isParticipant && !isSeller) {
        return null; // 참여자도 아니고 판매자도 아니면 null 반환
      }
    }
    return room;
  }catch(e){
    console.error("getRoom Function Error", e);
    throw e;
  }
  
}


async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_At: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }
  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar!}
      initialMessages={initialMessages}
    />
  );
}