/*
  Warnings:

  - Made the column `paperId` on table `OEQQuestion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OEQQuestion" ALTER COLUMN "paperId" SET NOT NULL;
