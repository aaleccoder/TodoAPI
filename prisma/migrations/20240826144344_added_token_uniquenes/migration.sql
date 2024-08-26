/*
  Warnings:

  - You are about to drop the column `date` on the `TokenApiKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID]` on the table `TokenApiKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `TokenApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenApiKey" DROP COLUMN "date",
ADD COLUMN     "userID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TokenApiKey_userID_key" ON "TokenApiKey"("userID");

-- AddForeignKey
ALTER TABLE "TokenApiKey" ADD CONSTRAINT "TokenApiKey_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
