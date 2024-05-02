/*
  Warnings:

  - You are about to drop the column `homeId` on the `ChatRoom` table. All the data in the column will be lost.
  - Made the column `productId` on table `ChatRoom` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_homeId_fkey";

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "homeId",
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chatHomeRoomId" TEXT;

-- CreateTable
CREATE TABLE "ChatHomeRoom" (
    "id" TEXT NOT NULL,
    "homeId" INTEGER NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,
    "deletedHomeByUserId" INTEGER,

    CONSTRAINT "ChatHomeRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeMessage" (
    "id" SERIAL NOT NULL,
    "payload" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserChatHomeRooms" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserChatHomeRooms_AB_unique" ON "_UserChatHomeRooms"("A", "B");

-- CreateIndex
CREATE INDEX "_UserChatHomeRooms_B_index" ON "_UserChatHomeRooms"("B");

-- AddForeignKey
ALTER TABLE "ChatHomeRoom" ADD CONSTRAINT "ChatHomeRoom_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatHomeRoom" ADD CONSTRAINT "ChatHomeRoom_deletedHomeByUserId_fkey" FOREIGN KEY ("deletedHomeByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeMessage" ADD CONSTRAINT "HomeMessage_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatHomeRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeMessage" ADD CONSTRAINT "HomeMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatHomeRoomId_fkey" FOREIGN KEY ("chatHomeRoomId") REFERENCES "ChatHomeRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChatHomeRooms" ADD CONSTRAINT "_UserChatHomeRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatHomeRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChatHomeRooms" ADD CONSTRAINT "_UserChatHomeRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
