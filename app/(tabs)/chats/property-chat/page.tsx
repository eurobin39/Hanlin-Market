'use server'

import ChatProductList from "@/app/(tabs)/chats/product-chat/components/chat-Product-List";
import ChatTypeButton from "@/components/chat-type-button";
import db from "@/lib/db";
import getSession from "@/lib/session"; // 세션 정보를 가져오는 데 사용되는 함수
import { Prisma } from "@prisma/client";
import ChatPropertyList from "./components/chat-Property-List";


export async function getChatInitialProperties(userId: number) {
  const chatRooms = await db.chatHomeRoom.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      home: true,
    },
  });

  // 찾은 채팅방에서 상품 정보와 채팅방 ID를 추출하고, 상품 정보에 채팅방 ID를 추가합니다.
  const chatPropertiesWithRoomId = chatRooms.map(chatRoom => ({
    ...chatRoom.home,
    chatRoomId: chatRoom.id // 채팅방 ID를 상품 정보 객체에 추가
  })).filter(home => home !== null);

  return chatPropertiesWithRoomId;
}



export async function getChatHomeRoomIdsFromProperty(propertyId: number) {
  const chatRooms = await db.chatHomeRoom.findMany({
    where: {
      homeId: propertyId, 
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

export async function countChatRoom(propertyId: number){
  
  const numberOfChatRoom = await db.chatHomeRoom.count({
    where: {
      homeId: propertyId,
    }
  })
  return numberOfChatRoom
  }


export type InitialchatProperties = Prisma.PromiseReturnType<typeof getChatInitialProperties>;



export default async function Properties() {

  const session = await getSession();
  const userId = session.id;

  if (!userId) {
    // 사용자가 로그인하지 않았다면, 적절한 처리를 합니다.
    console.error('사용자가 로그인하지 않았습니다.');
    return;
  }

  const chatInitialProperties = await getChatInitialProperties(userId);

  // 각 상품에 대해 연결된 채팅방 ID를 조회하고, 그에 따라 처리합니다.
  const chatPropertiesWithRoomIds = await Promise.all(chatInitialProperties.map(async (home) => {
    const chatRoomIds = await getChatHomeRoomIdsFromProperty(home.id);
    const numberOfChatRoom = await countChatRoom(home.id);
    return {
      ...home,
      chatRoomIds, // 상품 정보에 채팅방 ID 정보 추가
      numberOfChatRoom,
    };
  }));

  //console.log(chatInitialProducts);
  /*<ChatTypeButton />*/
  return (

    <div className="mt-20 mb-20">
      <ChatPropertyList initialChatProperties={chatPropertiesWithRoomIds} />
    </div>
  );
}