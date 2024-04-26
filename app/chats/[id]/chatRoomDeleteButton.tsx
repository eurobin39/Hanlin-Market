"use client";

import { useRouter } from "next/navigation";
import deleteChatRoomAction, { deleteChatRoom } from "./chatRoomDelete.actions";


type Props = {
  chatId: string;
};

export default function ChatDeleteButton({ chatId }: Props) {
  const router = useRouter();
  async function handleDelete() {
    const res = await deleteChatRoomAction(chatId);

    if (res) {
      alert("삭제되었습니다");
      deleteChatRoom(chatId)
      router.replace("/chats");
    } else {
      alert("실패했습니다");
    }
  }

  return (
    <button
      className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white"
      onClick={handleDelete}
    >Delete
    </button>
  );
}