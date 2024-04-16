'use server';

import db from "@/lib/db";
import getSession from "@/lib/session";

async function getIsOwner(userId: number, productId: number): Promise<boolean> {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { userId: true },
  });
  return userId === product?.userId;
}

export default async function createOrJoinChatRoom(productId: number): Promise<string | null> {
  const session = await getSession();
  const buyerId = session?.id; // 구매자 ID, 즉 현재 세션의 사용자 ID

  if (!buyerId) {
    console.log('사용자가 로그인하지 않았습니다.');
    return null;
  }

  // productId 인자를 사용하여 상품 주인의 userId를 얻습니다.
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { userId: true },
  });

  if (!product) {
    console.log('제품을 찾을 수 없습니다.');
    return null;
  }

  const sellerId = product.userId; // 판매자 ID, 즉 상품 주인의 userId

  const existingRoom = await db.chatRoom.findFirst({
    where: { productId: productId, users: { some: { id: buyerId } } },
    select: { id: true },
  });

  if (existingRoom) {
    return `/chats/${existingRoom.id}`;
  }

  // 새 채팅방 생성 시 구매자와 판매자 모두를 사용자로 연결합니다.
  const newRoom = await db.chatRoom.create({
    data: {
      productId: productId,
      users: {
        connect: [{ id: buyerId }, { id: sellerId }], // 구매자와 판매자 모두 연결
      },
    },
    select: { id: true },
  });

  return `/chats/${newRoom.id}`;
}
