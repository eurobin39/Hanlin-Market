/*
  Warnings:

  - Made the column `homeId` on table `ChatRoom` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_homeId_fkey";

-- AlterTable
ALTER TABLE "ChatRoom" ALTER COLUMN "homeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;
