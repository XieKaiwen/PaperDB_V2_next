import { ParsedPaperFilterProps } from "@/src/types/types";
import { Prisma } from "@prisma/client";

export function determineVisibility(fetchVisible: boolean, fetchNonVisible: boolean) {
  if (fetchVisible && fetchNonVisible) {
    return null; // Rule 1
  }
  if (fetchVisible) {
    return true; // Rule 2
  }
  if (fetchNonVisible) {
    return false; // Rule 3
  }
  return true; // Rule 4: if both are not visible, then just default to true LOL, so only visible papers are displayed
}
export function whereClauseConstructorForPapers({
  year,
  educationLevel,
  school,
  subject,
  examType,
  userId,
  fetchVisible = false,
  fetchNonVisible = false
}: ParsedPaperFilterProps) {

  const visible = determineVisibility(fetchVisible, fetchNonVisible);

  const whereClause = {
    year: year.length === 0 ? {} : {in: year},
    educationLevel: educationLevel.length === 0 ? {} : {in: educationLevel},
    schoolId: school ? {} : {in: school},
    subjectId: subject.length === 0 ? {} : {in: subject},
    examType: examType.length === 0 ? {} : {in: examType},
    userId: userId.length === 0 ? {} : {in: userId},
    ...(visible !== null && { visible })
  };
  return whereClause;
}
