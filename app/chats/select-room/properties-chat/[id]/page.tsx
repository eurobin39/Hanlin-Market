// pages/chats/select-room/[productId].js 또는 .tsx 파일
import React from 'react';
import Link from 'next/link';
import TabBar from '@/components/TabBar';
import selectHomeRoom from './actions';



export default async function homeComponent({ params }: {
  params: { id: string }
}) {
  const { id } = params;

  const chatRoomDetails = await selectHomeRoom(Number(id));


  



  return (
    <div className='mt-20  bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300'>
      {chatRoomDetails.map((roomDetail) =>
        roomDetail.isDeleted ? (
          // 삭제된 채팅방일 경우 메시지 표시
          <div key={roomDetail.roomId} className='p-2 justify-start items-center w-full'>
            <Link href={`/chats/${roomDetail.roomId}/properties-chat`} >삭제된 채팅방입니다.</Link>
          </div>
        ) : (
          // 삭제되지 않은 채팅방에 대한 처리
          <div className=' p-2 justify-start items-center w-full' key={roomDetail.roomId}>
            <Link href={`/chats/${roomDetail.roomId}/properties-chat`}>
              <div className='flex flex-col gap-2'>
                {roomDetail.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-5">
                    <img src={participant.avatar || '/default-avatar.jpg'} alt={participant.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <div>
                      <p className="font-bold">{participant.username}</p>
                      <p className="text-gray-500">{roomDetail.latestMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          </div>
        )
      )}
      <TabBar />
    </div>
  );

}
