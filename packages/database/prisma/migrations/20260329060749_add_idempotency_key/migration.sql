/*
  Warnings:

  - A unique constraint covering the columns `[userId,idempotencyKey]` on the table `submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "submissions"."submissions" ADD COLUMN     "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "submissions_userId_idempotencyKey_key" ON "submissions"."submissions"("userId", "idempotencyKey");
