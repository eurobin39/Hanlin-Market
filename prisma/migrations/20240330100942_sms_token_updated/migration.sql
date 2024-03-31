/*
  Warnings:

  - Added the required column `userId` to the `smsToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_smsToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "smsToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_smsToken" ("createAt", "id", "token", "updatedAt") SELECT "createAt", "id", "token", "updatedAt" FROM "smsToken";
DROP TABLE "smsToken";
ALTER TABLE "new_smsToken" RENAME TO "smsToken";
CREATE UNIQUE INDEX "smsToken_token_key" ON "smsToken"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
