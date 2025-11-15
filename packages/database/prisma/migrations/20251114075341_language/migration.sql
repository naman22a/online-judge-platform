/*
  Warnings:

  - Changed the type of `language` on the `submissions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('cpp', 'java', 'javascript', 'python', 'go', 'rust', 'csharp', 'ruby', 'swift', 'php', 'kotlin', 'dart', 'R', 'perl', 'typescript', 'haskell');

-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL;
