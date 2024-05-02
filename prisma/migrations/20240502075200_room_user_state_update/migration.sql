/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatRoomId]` on the table `RoomUserState` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RoomUserState_userId_chatRoomId_key" ON "RoomUserState"("userId", "chatRoomId");
