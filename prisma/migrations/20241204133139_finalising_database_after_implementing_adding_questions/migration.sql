/*
  Warnings:

  - The values [O-level,Common test,Block test,Prelim/Promo,A-level] on the enum `exam_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `educationLevel` on the `Subject` table. All the data in the column will be lost.
  - The `progressStatus` column on the `UserPaperProgressStatus` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `MCQQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OEQQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserMCQAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOEQAnswer` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `schoolType` on the `School` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `educationLevel` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'OEQ');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('PRIMARY', 'SECONDARY', 'JC');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('In Progress', 'submitted', 'marked');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterEnum
BEGIN;
CREATE TYPE "exam_type_new" AS ENUM ('CA1', 'CA2', 'SA1', 'SA2', 'PSLE', 'WA', 'SA', 'O Level', 'Common Test', 'Block Test', 'Preliminary Exam', 'Promotional Exam', 'A Level', 'Other');
ALTER TABLE "Paper" ALTER COLUMN "examType" TYPE "exam_type_new" USING ("examType"::text::"exam_type_new");
ALTER TYPE "exam_type" RENAME TO "exam_type_old";
ALTER TYPE "exam_type_new" RENAME TO "exam_type";
DROP TYPE "exam_type_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "MCQQuestion" DROP CONSTRAINT "MCQQuestion_paperId_fkey";

-- DropForeignKey
ALTER TABLE "MCQQuestion" DROP CONSTRAINT "MCQQuestion_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "OEQQuestion" DROP CONSTRAINT "OEQQuestion_paperId_fkey";

-- DropForeignKey
ALTER TABLE "OEQQuestion" DROP CONSTRAINT "OEQQuestion_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "UserMCQAnswer" DROP CONSTRAINT "UserMCQAnswer_MCQId_fkey";

-- DropForeignKey
ALTER TABLE "UserMCQAnswer" DROP CONSTRAINT "UserMCQAnswer_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserOEQAnswer" DROP CONSTRAINT "UserOEQAnswer_OEQId_fkey";

-- DropForeignKey
ALTER TABLE "UserOEQAnswer" DROP CONSTRAINT "UserOEQAnswer_userId_fkey";

-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "totalMark" SET DEFAULT 0,
ALTER COLUMN "visible" SET DEFAULT false;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "schoolType",
ADD COLUMN     "schoolType" "SchoolType" NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "educationLevel",
ADD COLUMN     "educationLevels" "edu_level"[];

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "educationLevel" "edu_level" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "UserPaperProgressStatus" DROP COLUMN "progressStatus",
ADD COLUMN     "progressStatus" "ProgressStatus" NOT NULL DEFAULT 'In Progress';

-- DropTable
DROP TABLE "MCQQuestion";

-- DropTable
DROP TABLE "OEQQuestion";

-- DropTable
DROP TABLE "UserMCQAnswer";

-- DropTable
DROP TABLE "UserOEQAnswer";

-- DropEnum
DROP TYPE "difficulty";

-- DropEnum
DROP TYPE "progress_status";

-- DropEnum
DROP TYPE "school_type";

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "paperId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "questionType" "QuestionType" NOT NULL,
    "isMulti" BOOLEAN,
    "topics" TEXT[],
    "fullMark" SMALLINT NOT NULL,
    "markScheme" JSONB,
    "difficulty" "Difficulty",
    "passingRate" DOUBLE PRECISION,
    "questionNumber" INTEGER NOT NULL,
    "questionLeafs" JSONB,
    "questionContent" JSONB NOT NULL,
    "questionAnswer" JSONB NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_paperId_questionNumber_key" ON "Question"("paperId", "questionNumber");

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
