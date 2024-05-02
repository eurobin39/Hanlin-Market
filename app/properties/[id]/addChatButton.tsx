// addChatButton.tsx
'use client';

import createOrJoinHomeChatRoom from './addChatRoom';
import { useRouter } from 'next/navigation';

type Props = {
  propertyId: number;
};

export default function AddChatButton({ propertyId }: Props) {
  const router = useRouter();

  async function handleAdd() {
    const roomUrl = await createOrJoinHomeChatRoom(propertyId);

    if (roomUrl) {
      router.push(roomUrl);
    } else {
      // 실패 처리, 필요에 따라 사용자에게 알림을 제공할 수 있습니다.
      console.error('채팅방을 생성하거나 찾을 수 없습니다.');
    }
  }

  return (
    <button onClick={handleAdd} className="bg-emerald-400 px-5 py-2.5 rounded-md text-white font-semibold">
      Chat
    </button>
  );
}
