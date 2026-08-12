/*
  Warnings:

  - You are about to drop the `RevokedToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "code" TEXT;

-- DropTable
DROP TABLE "RevokedToken";

-- CreateIndex
CREATE UNIQUE INDEX "Chat_code_key" ON "Chat"("code");
