/*
  Warnings:

  - You are about to drop the column `userID` on the `TokenApiKey` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TokenApiKey_userID_key";

-- AlterTable
ALTER TABLE "TokenApiKey" DROP COLUMN "userID";
