/*
  Warnings:

  - Added the required column `year` to the `Paper` table without a default value. This is not possible if the table is not empty.
  - Made the column `logInfo` on table `UserLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateLogged` on table `UserLog` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "difficulty" AS ENUM ('Easy', 'Medium', 'Hard');

-- CreateEnum
CREATE TYPE "progress_status" AS ENUM ('In Progress', 'Submitted', 'Marked');

-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "year" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserLog" ALTER COLUMN "logInfo" SET NOT NULL,
ALTER COLUMN "dateLogged" SET NOT NULL;

-- CreateTable
CREATE TABLE "MCQQuestion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "paperId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subjectId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "topicId" UUID[],
    "questionInformation" JSONB NOT NULL,
    "questionNum" SMALLINT NOT NULL,
    "fullMark" SMALLINT NOT NULL,
    "difficulty" "difficulty" NOT NULL,
    "percentageCorrect" DOUBLE PRECISION,

    CONSTRAINT "MCQQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OEQQuestion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subjectId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "paperId" UUID DEFAULT gen_random_uuid(),
    "questionNum" SMALLINT NOT NULL,
    "questionInfo" JSONB NOT NULL,
    "fullMark" SMALLINT NOT NULL,
    "difficulty" "difficulty" NOT NULL,
    "passingRate" DOUBLE PRECISION,

    CONSTRAINT "OEQQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMCQAnswer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "MCQId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userAnswer" TEXT NOT NULL,
    "obtainedMarks" SMALLINT NOT NULL,

    CONSTRAINT "UserMCQAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOEQAnswer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "OEQId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subIndex" TEXT,
    "subSubIndex" TEXT,
    "userAnswer" TEXT NOT NULL,
    "obtainedMarks" REAL DEFAULT 0,
    "marked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserOEQAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPaperProgressStatus" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "paperId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "progressStatus" "progress_status" NOT NULL DEFAULT 'In Progress',
    "currentScore" REAL NOT NULL DEFAULT 0,

    CONSTRAINT "UserPaperProgressStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MCQQuestion" ADD CONSTRAINT "MCQQuestion_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MCQQuestion" ADD CONSTRAINT "MCQQuestion_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OEQQuestion" ADD CONSTRAINT "OEQQuestion_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OEQQuestion" ADD CONSTRAINT "OEQQuestion_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserMCQAnswer" ADD CONSTRAINT "UserMCQAnswer_MCQId_fkey" FOREIGN KEY ("MCQId") REFERENCES "MCQQuestion"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserMCQAnswer" ADD CONSTRAINT "UserMCQAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserOEQAnswer" ADD CONSTRAINT "UserOEQAnswer_OEQId_fkey" FOREIGN KEY ("OEQId") REFERENCES "OEQQuestion"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserOEQAnswer" ADD CONSTRAINT "UserOEQAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserPaperProgressStatus" ADD CONSTRAINT "UserPaperProgressStatus_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserPaperProgressStatus" ADD CONSTRAINT "UserPaperProgressStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
