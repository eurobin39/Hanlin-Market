import React from "react";
import ChatListProperty from "./chat-List-Properties";
import { InitialchatProperties } from "../page";


interface PropertyListProps {
  initialChatProperties: InitialchatProperties;

}

// initialChatProducts prop를 받는 ChatProductList 컴포넌트 정의
export default function ChatPropertyList({ initialChatProperties }: PropertyListProps) {
  // 중복 ID 제거
  const uniqueChatProperties = Array.from(new Map(initialChatProperties.map(home => [home.id, home])).values());


  // initialChatProducts가 비어있는 경우, 메시지 표시
  if (!uniqueChatProperties || uniqueChatProperties.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-center font-bold">채팅 가능한 방이 없습니다.</p>
      </div>
    )

  }

  // 제품 목록 렌더링
  return (
    <div className="p-2 flex flex-col gap-4 ">
      {uniqueChatProperties.map((home) => (
        <ChatListProperty key={home.id} {...home} />
      ))}
    </div>
  );
}
