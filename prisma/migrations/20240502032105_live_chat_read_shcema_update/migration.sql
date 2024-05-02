-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserMessage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "UserMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMessage_userId_messageId_key" ON "UserMessage"("userId", "messageId");

-- AddForeignKey
ALTER TABLE "UserMessage" ADD CONSTRAINT "UserMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessage" ADD CONSTRAINT "UserMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
