-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "dateAdded" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;