-- CreateTable
CREATE TABLE "RoomUserState" (
    "chatRoomId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "lastReadAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomUserState_pkey" PRIMARY KEY ("chatRoomId","userId")
);

-- AddForeignKey
ALTER TABLE "RoomUserState" ADD CONSTRAINT "RoomUserState_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
