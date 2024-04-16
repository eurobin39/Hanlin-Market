"use client"

import React, { useEffect, useRef, useState } from "react";
import ChatListProduct from "./chat-List-Products";
import { InitialchatProducts } from "@/app/(tabs)/chats/page"

interface ProductListProps {
    initialChatProducts : InitialchatProducts;
}
// initialChatProducts prop를 받는 ChatProductList 컴포넌트 정의
export default function ChatProductList({ initialChatProducts } : ProductListProps) {
    console.log(initialChatProducts);
    useEffect(() => {
      
    }, [initialChatProducts]);
  
    // initialChatProducts가 비어있는 경우, 메시지 표시
    if (!initialChatProducts || initialChatProducts.length === 0) {
      return <p>채팅 가능한 제품이 없습니다.</p>;
    }
  
    // 제품 목록 렌더링
    return (
      <div className="p-2 flex flex-col gap-">
        {initialChatProducts.map((product) => (
          <ChatListProduct key={product.id} {...product} />
        ))}
      </div>
    );
  }