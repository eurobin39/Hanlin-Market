/*
  Warnings:

  - Added the required column `contractEnd` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractStart` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Home" ADD COLUMN     "contractEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "contractStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;
