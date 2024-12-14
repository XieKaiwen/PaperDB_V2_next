import { ParsedPaperFilterProps } from "@/src/types/types";

export function determineVisibility(onlyVisible: boolean, onlyNonVisible: boolean) {
  if (onlyVisible && onlyNonVisible) {
    return true; // Rule 1
  }
  if (onlyVisible) {
    return true; // Rule 2
  }
  if (onlyNonVisible) {
    return false; // Rule 3
  }
  return null; // Rule 4
}
export function whereClauseConstructorForPapers({
  year,
  educationLevel,
  school,
  subject,
  examType,
  onlyVisible = false,
  onlyNonVisible = false
}: ParsedPaperFilterProps) {

  const visible = determineVisibility(onlyVisible, onlyNonVisible);

  const whereClause = {
    year: year.length === 0 ? {} : {in: year},
    educationLevel: educationLevel.length === 0 ? {} : {in: educationLevel},
    school: school ? {} : {in: school},
    subject: subject.length === 0 ? {} : {in: subject},
    examType: examType.length === 0 ? {} : {in: examType},
    ...(visible !== null && { visible })
  };
  return whereClause;
}
