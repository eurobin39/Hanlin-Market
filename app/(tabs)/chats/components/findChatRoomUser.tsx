import db from "@/lib/db";

export default async function getChatRoomDetails(chatRoomId: string) {
    const chatRoom = await db.chatRoom.findUnique({
      where: {
        id: chatRoomId,
      },
      include: {
        users: true, // 채팅방에 속한 모든 사용자를 포함
        product: true, // 해당 채팅방의 상품 정보를 포함
      },
    });
  
    if (!chatRoom) {
      throw new Error('ChatRoom not found');
    }
  
    const sellerId = chatRoom.product.userId; // 판매자 ID
    const seller = chatRoom.users.find(user => user.id === sellerId); // 판매자 정보 추출
    const buyers = chatRoom.users.filter(user => user.id !== sellerId); // 구매자 정보 추출
  
    return {
      ...chatRoom,
      seller, // 판매자 정보 추가
      buyers, // 구매자 정보 추가
    };
  }
