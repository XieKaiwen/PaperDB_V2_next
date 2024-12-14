"use server";

import { ParsedPaperFilterProps } from "@/src/types/types";
import prisma from "@/utils/prisma-client/client";
import { whereClauseConstructorForPapers } from "@/utils/prismaUtils";
import { edu_level, exam_type, Prisma } from "@prisma/client";

// ### CREATE ###
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

// ### READ ###
export async function getPapersWithFilters(
  {
    year = [],
    educationLevel = [],
    school = [],
    subject = [],
    examType = [],
    onlyVisible = false,
    onlyNonVisible = false,
  }: ParsedPaperFilterProps,
  page: number,
  pageSize: number,
  includeFields: Prisma.PaperInclude = {},
  selectFields: Prisma.PaperSelect = {},
) {
  // onlyVisible should take precedence over onlyNonVisible. If both are true, only show Visible
  const whereClause = whereClauseConstructorForPapers({
    year,
    educationLevel,
    school,
    subject,
    examType,
    onlyVisible,
    onlyNonVisible,
  });
// TODO: create a prisma extension for paper model, retrievePaperPaginated
  const papers = await prisma.paper.findMany({
    where: whereClause,
    ...(Object.keys(selectFields).length > 0
      ? { select: selectFields } // Use `select` if `selectFields` is not empty
      : { include: includeFields }), // Otherwise, use `include`
  });
  return papers;
}

// ### UPDATE ###

// ### DELETE ###
