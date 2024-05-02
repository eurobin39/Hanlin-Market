'use server'

import ChatProductList from "@/app/(tabs)/chats/product-chat/components/chat-Product-List";
import ChatTypeButton from "@/components/chat-type-button";
import db from "@/lib/db";
import getSession from "@/lib/session"; // 세션 정보를 가져오는 데 사용되는 함수
import { Prisma } from "@prisma/client";


export async function getChatInitialProducts(userId: number) {
  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      product: true,
    },
  });

  // 찾은 채팅방에서 상품 정보와 채팅방 ID를 추출하고, 상품 정보에 채팅방 ID를 추가합니다.
  const chatProductsWithRoomId = chatRooms.map(chatRoom => ({
    ...chatRoom.product,
    chatRoomId: chatRoom.id // 채팅방 ID를 상품 정보 객체에 추가
  })).filter(product => product !== null);

  return chatProductsWithRoomId;
}



export async function getChatRoomIdsFromProduct(productId: number) {
  const chatRooms = await db.chatRoom.findMany({
    where: {
      productId: productId, // Product ID로 ChatRoom을 찾습니다.
    },
    select: {
      id: true, // ChatRoom의 ID만 선택하여 가져옵니다.
    },
  });

  // ChatRoom ID들을 추출합니다.
  const chatRoomIds = chatRooms.map(chatRoom => chatRoom.id);
  /*
      // 연결된 ChatRoom의 수에 따라 다르게 처리합니다.
      if (chatRoomIds.length > 1) {
          // 한 개 이상의 ChatRoom이 연결된 경우
          console.log("여러 개의 ChatRoom이 연결되어 있습니다:", chatRoomIds);
      } else if (chatRoomIds.length === 1) {
          // 정확히 한 개의 ChatRoom만 연결된 경우
          console.log("한 개의 ChatRoom이 연결되어 있습니다:", chatRoomIds[0]);
      } else {
          // 연결된 ChatRoom이 없는 경우
          console.log("연결된 ChatRoom이 없습니다.");
      }
  */

  return chatRoomIds; // ChatRoom ID들을 반환합니다.
}

export async function countChatRoom(productId: number){
  
  const numberOfChatRoom = await db.chatRoom.count({
    where: {
      productId: productId,
    }
  })
  return numberOfChatRoom
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

  // 각 상품에 대해 연결된 채팅방 ID를 조회하고, 그에 따라 처리합니다.
  const chatProductsWithRoomIds = await Promise.all(chatInitialProducts.map(async (product) => {
    const chatRoomIds = await getChatRoomIdsFromProduct(product.id!);
    const numberOfChatRoom = await countChatRoom(product.id!);
    return {
      ...product,
      chatRoomIds, // 상품 정보에 채팅방 ID 정보 추가
      numberOfChatRoom,
    };
  }));

  //console.log(chatInitialProducts);
  /*<ChatTypeButton />*/
  return (

    <div className="mt-20 mb-20">
      <ChatProductList initialChatProducts={chatProductsWithRoomIds} />
    </div>
  );
}