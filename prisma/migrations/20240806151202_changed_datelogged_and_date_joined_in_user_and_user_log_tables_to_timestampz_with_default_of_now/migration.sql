-- AlterTable
ALTER TABLE "User" ALTER COLUMN "dateJoined" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "dateJoined" SET DATA TYPE TIMESTAMPTZ(6);