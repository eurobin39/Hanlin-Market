"use client";

import { saveMessage } from "@/app/chats/actions";
import { InitialChatMessages } from "@/app/chats/[id]/products-chat/page";

import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVraW91aHBwZ3htZWF2Y3NzaXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxNjEwMDIsImV4cCI6MjAyODczNzAwMn0.uFyOaQF2B4B7QlsTkmuqozorjqDmqaMfm7xINdfR_0c";
const SUPABASE_URL = "https://ukiouhppgxmeavcssisj.supabase.co";
interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      payload: message,
      created_At: new Date(),
      userId,
      user: {
        username,
        avatar,
      },
    };

    setMessages((prevMsgs) => [...prevMsgs, newMessage]);

    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: newMessage,
    });

    await saveMessage(message, chatRoomId);
    setMessage("");
    scrollToBottom();
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
        scrollToBottom();
      })
      .subscribe();
      
    // 초기 로딩 시 스크롤을 가장 아래로 이동
    scrollToBottom();
    
    return () => {
      channel.current?.unsubscribe();
    };
}, [chatRoomId]); // chatRoomId가 변경될 때마다 실행됩니다.


  return (
    <div className="flex flex-col h-screen pt-20">
      <div className="flex-1 overflow-y-auto p-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 items-center ${message.userId === userId ? "justify-end" : ""}`}
          >
            {message.userId === userId ? null : (
              <Image
                src={message.user.avatar || '/default-avatar.jpg'}
                alt={message.user.username}
                width={50}
                height={50}
                className="rounded-full"
              />
            )}
            <div className={`flex flex-col gap-1 ${message.userId === userId ? "items-end" : ""}`}>
              <span className={`${message.userId === userId ? "bg-neutral-500" : "bg-orange-500"} p-2.5 rounded-md`}>
                {message.payload}
              </span>
              <span className="text-xs">
                {formatToTimeAgo(message.created_At?.toString())}
              </span>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <form className="sticky bottom-0 bg-gray-900 p-4" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button type="submit" className="absolute right-5 bottom-5">
          <ArrowUpCircleIcon className="w-8 h-8  text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}