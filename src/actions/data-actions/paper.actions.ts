"use server";

import prisma from "@/utils/prisma-client/client";
import { edu_level, exam_type } from "@prisma/client";

export async function createPaper({
  userId,
  school,
  subject,
  educationLevel,
  examType,
  year,
  visible = false,
  totalMark = 0,
}: {
  userId: string;
  school: string;
  subject: string;
  educationLevel: edu_level;
  examType: exam_type;
  year: string;
  visible?: boolean;
  totalMark?: number;
}) {
  const newPaper = await prisma.paper.createPaper({
    userId: userId,
    schoolId: school,
    subjectId: subject,
    educationLevel: educationLevel,
    examType: examType,
    totalMark: totalMark,
    visible: visible,
    year: year,
  });
  console.log("New paper successfully created", newPaper);
  return newPaper;
}

export async function getPaperIdByMetadata({
  year,
  educationLevel,
  school,
  subject,
  examType,
}: {
  year: string;
  educationLevel: edu_level;
  school: string;
  subject: string;
  examType: exam_type;
}) {
  const paperId = await prisma.paper.getPaperIdByMetadata({
    schoolId: school,
    subjectId: subject,
    educationLevel: educationLevel,
    examType: examType,
    year: year,
  });

  return paperId;
}
