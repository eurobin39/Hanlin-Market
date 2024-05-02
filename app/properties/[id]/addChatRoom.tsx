'use server';

import db from "@/lib/db";
import getSession from "@/lib/session";
import propertyDetail from "./page";

async function getIsOwner(userId: number, propertyId: number): Promise<boolean> {
  const property = await db.home.findUnique({
    where: { id: propertyId },
    select: { userId: true },
  });
  return userId === property?.userId;
}

export default async function createOrJoinHomeChatRoom(propertyId: number): Promise<string | null> {
  const session = await getSession();
  const buyerId = session?.id; // 구매자 ID, 즉 현재 세션의 사용자 ID

  if (!buyerId) {
    console.log('사용자가 로그인하지 않았습니다.');
    return null;
  }


  const property = await db.home.findUnique({
    where: { id: propertyId },
    select: { userId: true },
  });

  if (!property) {
    console.log('제품을 찾을 수 없습니다.');
    return null;
  }

  const sellerId = property.userId; // 판매자 ID, 즉 상품 주인의 userId

  const existingHomeRoom = await db.chatHomeRoom.findFirst({
    where: { homeId: propertyId, users: { some: { id: buyerId } } },
    select: { id: true },
  });

  if (existingHomeRoom) {
    return `/chats/${existingHomeRoom.id}/properties-chat`;
  }

  // 새 채팅방 생성 시 구매자와 판매자 모두를 사용자로 연결합니다.
  const newHomeRoom = await db.chatHomeRoom.create({
    data: {
      home: {
        connect: {
          id: propertyId
        }
      },
      users: {
        connect: [
          { id: buyerId },
          { id: sellerId }
        ]
      }
    },
    select: {
      id: true
    }
  });

  return `/chats/${newHomeRoom.id}/properties-chat`;
}
