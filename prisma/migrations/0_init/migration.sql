-- CreateEnum
CREATE TYPE "edu_level" AS ENUM ('P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'S1', 'S2', 'S3', 'S4', 'J1', 'J2');

-- CreateEnum
CREATE TYPE "exam_type" AS ENUM ('CA1', 'CA2', 'SA1', 'SA2', 'PSLE', 'WA', 'SA', 'O-level', 'Common test', 'Block test', 'Prelim/Promo', 'A-level');

-- CreateEnum
CREATE TYPE "school_type" AS ENUM ('Primary', 'Secondary', 'JC');

-- CreateTable
CREATE TABLE "Paper" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "schoolId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subjectId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "educationLevel" "edu_level" NOT NULL,
    "totalMark" SMALLINT NOT NULL,
    "examType" "exam_type" NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "schoolType" "school_type" NOT NULL,
    "schoolFullName" TEXT NOT NULL,
    "schoolShortName" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subjectName" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subjectId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "topicName" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "dateJoined" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "educationLevel" "edu_level" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "logInfo" TEXT,
    "dateLogged" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_subjectName_key" ON "Subject"("subjectName");

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserLog" ADD CONSTRAINT "UserLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

