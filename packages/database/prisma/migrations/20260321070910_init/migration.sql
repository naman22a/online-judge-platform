-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "contests";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "problems";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "submissions";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateEnum
CREATE TYPE "problems"."Difficulty" AS ENUM ('Easy', 'Medium', 'Hard');

-- CreateEnum
CREATE TYPE "submissions"."Language" AS ENUM ('cpp', 'java', 'javascript', 'python', 'go', 'rust', 'csharp', 'ruby', 'swift', 'php', 'kotlin', 'dart', 'R', 'perl', 'typescript', 'haskell');

-- CreateEnum
CREATE TYPE "submissions"."SubmissionStatus" AS ENUM ('Accepted', 'WrongAnswer', 'TimeLimitExceeded', 'MemoryLimitExceeded', 'RuntimeError', 'CompileError', 'Pending');

-- CreateEnum
CREATE TYPE "submissions"."ProblemStatus" AS ENUM ('Solved', 'Attempted', 'Todo');

-- CreateEnum
CREATE TYPE "problems"."VoteType" AS ENUM ('Upvote', 'Downvote');

-- CreateTable
CREATE TABLE "users"."users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerfied" BOOLEAN NOT NULL DEFAULT false,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "github_url" TEXT,
    "linkedin_url" TEXT,
    "website_url" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems"."problems" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "problems"."Difficulty" NOT NULL,
    "acceptanceRate" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "totalSubmissions" INTEGER NOT NULL DEFAULT 0,
    "totalAccepted" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "constraints" TEXT,
    "hints" TEXT[],
    "similarProblems" INTEGER[],
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems"."tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems"."problem_tags" (
    "problemId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "problem_tags_pkey" PRIMARY KEY ("problemId","tagId")
);

-- CreateTable
CREATE TABLE "problems"."companies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "logoUrl" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems"."problem_companies" (
    "problemId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "lastAskedDate" DATE,

    CONSTRAINT "problem_companies_pkey" PRIMARY KEY ("problemId","companyId")
);

-- CreateTable
CREATE TABLE "problems"."test_cases" (
    "id" SERIAL NOT NULL,
    "problemId" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems"."editorials" (
    "id" SERIAL NOT NULL,
    "problemId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "approach" VARCHAR(100),
    "content" TEXT NOT NULL,
    "codeSnippets" JSONB,
    "timeComplexity" VARCHAR(100),
    "spaceComplexity" VARCHAR(100),
    "isOfficial" BOOLEAN NOT NULL DEFAULT true,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "editorials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems"."comments" (
    "id" SERIAL NOT NULL,
    "problemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "title" VARCHAR(255),
    "content" TEXT NOT NULL,
    "isSolution" BOOLEAN NOT NULL DEFAULT false,
    "language" VARCHAR(50),
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems"."discussion_votes" (
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "voteType" "problems"."VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_votes_pkey" PRIMARY KEY ("userId","commentId")
);

-- CreateTable
CREATE TABLE "problems"."bookmarks" (
    "userId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("userId","problemId")
);

-- CreateTable
CREATE TABLE "problems"."problem_likes" (
    "userId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "isLike" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problem_likes_pkey" PRIMARY KEY ("userId","problemId")
);

-- CreateTable
CREATE TABLE "submissions"."submissions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "language" "submissions"."Language" NOT NULL,
    "code" TEXT NOT NULL,
    "status" "submissions"."SubmissionStatus" NOT NULL,
    "runtime" INTEGER,
    "memory" INTEGER,
    "testCasesPassed" INTEGER NOT NULL DEFAULT 0,
    "totalTestCases" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions"."user_problem_status" (
    "userId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "status" "submissions"."ProblemStatus" NOT NULL,
    "lastAttemptedAt" TIMESTAMP(3),
    "solvedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastSubmissionId" INTEGER,

    CONSTRAINT "user_problem_status_pkey" PRIMARY KEY ("userId","problemId")
);

-- CreateTable
CREATE TABLE "contests"."contests" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contests"."contest_problems" (
    "contestId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "problemOrder" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "contest_problems_pkey" PRIMARY KEY ("contestId","problemId")
);

-- CreateTable
CREATE TABLE "contests"."contest_participants" (
    "id" SERIAL NOT NULL,
    "contestId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "finishTime" TIMESTAMP(3),
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contest_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "problems_slug_key" ON "problems"."problems"("slug");

-- CreateIndex
CREATE INDEX "problems_difficulty_idx" ON "problems"."problems"("difficulty");

-- CreateIndex
CREATE INDEX "problems_slug_idx" ON "problems"."problems"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "problems"."tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "problems"."tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "problems"."companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "problems"."companies"("slug");

-- CreateIndex
CREATE INDEX "test_cases_problemId_idx" ON "problems"."test_cases"("problemId");

-- CreateIndex
CREATE INDEX "comments_problemId_idx" ON "problems"."comments"("problemId");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "problems"."comments"("userId");

-- CreateIndex
CREATE INDEX "bookmarks_userId_idx" ON "problems"."bookmarks"("userId");

-- CreateIndex
CREATE INDEX "submissions_userId_problemId_idx" ON "submissions"."submissions"("userId", "problemId");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"."submissions"("status");

-- CreateIndex
CREATE INDEX "user_problem_status_userId_problemId_idx" ON "submissions"."user_problem_status"("userId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "contests_slug_key" ON "contests"."contests"("slug");

-- CreateIndex
CREATE INDEX "contests_startTime_idx" ON "contests"."contests"("startTime");

-- CreateIndex
CREATE INDEX "contest_participants_userId_idx" ON "contests"."contest_participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "contest_participants_contestId_userId_key" ON "contests"."contest_participants"("contestId", "userId");

-- AddForeignKey
ALTER TABLE "problems"."problem_tags" ADD CONSTRAINT "problem_tags_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."problem_tags" ADD CONSTRAINT "problem_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "problems"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."problem_companies" ADD CONSTRAINT "problem_companies_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."problem_companies" ADD CONSTRAINT "problem_companies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "problems"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."test_cases" ADD CONSTRAINT "test_cases_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."editorials" ADD CONSTRAINT "editorials_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."comments" ADD CONSTRAINT "comments_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "problems"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."discussion_votes" ADD CONSTRAINT "discussion_votes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "problems"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."bookmarks" ADD CONSTRAINT "bookmarks_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problems"."problem_likes" ADD CONSTRAINT "problem_likes_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"."problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions"."user_problem_status" ADD CONSTRAINT "user_problem_status_lastSubmissionId_fkey" FOREIGN KEY ("lastSubmissionId") REFERENCES "submissions"."submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contests"."contest_problems" ADD CONSTRAINT "contest_problems_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"."contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contests"."contest_participants" ADD CONSTRAINT "contest_participants_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"."contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
