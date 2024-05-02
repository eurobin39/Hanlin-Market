-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_homeId_fkey";

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "homeId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Saved" (
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "homeId" INTEGER NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "Saved_pkey" PRIMARY KEY ("userId","homeId")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
