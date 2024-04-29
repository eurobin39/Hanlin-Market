import React from "react";
import ChatListProduct from "./chat-List-Products";
import { InitialchatProducts } from "@/app/(tabs)/chats/page";


interface ProductListProps {
  initialChatProducts: InitialchatProducts;

}

// initialChatProducts prop를 받는 ChatProductList 컴포넌트 정의
export default function ChatProductList({ initialChatProducts }: ProductListProps) {
  // 중복 ID 제거
  const uniqueChatProducts = Array.from(new Map(initialChatProducts.map(product => [product.id, product])).values());


  // initialChatProducts가 비어있는 경우, 메시지 표시
  if (!uniqueChatProducts || uniqueChatProducts.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-center font-bold">채팅 가능한 제품이 없습니다.</p>
      </div>
    )

  }

  // 제품 목록 렌더링
  return (
    <div className="p-2 flex flex-col gap-4 ">
      {uniqueChatProducts.map((product) => (
        <ChatListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}

