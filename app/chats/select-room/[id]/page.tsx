// pages/chats/select-room/[productId].js 또는 .tsx 파일
import React from 'react';
import selectRoom from './actions';
import Link from 'next/link';
import TabBar from '@/components/TabBar';



export default async function component({ params }: {
  params: { id: string }
}) {
  const { id } = params;
  const chatRoomDetails = await selectRoom(Number(id));
// 페이지 컴포넌트 수정 부분 예시
return (
  <div className='mt-20'>
    {chatRoomDetails.map((roomDetail) => (
      <div className='border-b p-2 justify-start items-center w-full border-gray-600' key={roomDetail.roomId}>
        <Link href={`/chats/${roomDetail.roomId}`} className='flex flex-col gap-2'>
          {roomDetail.participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-5">
              <img src={participant.avatar || '/default-avatar.jpg'} alt={participant.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
              <div>
                <p className="font-bold">{participant.username}</p>
                {/* 보낸 사람의 이름과 최근 메시지를 회색 글씨로 표시 */}
                <p className="text-gray-500">{roomDetail.latestMessage}</p>
              </div>
            </div>
          ))}
        </Link>
      </div>
    ))}
    <TabBar />
  </div>
);

}
