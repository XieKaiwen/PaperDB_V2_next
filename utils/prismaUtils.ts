import { edu_level, exam_type } from "@prisma/client";

export function whereClauseConstructorForPapers({
  year = "all",
  educationLevel = "all",
  school = "all",
  subject = "all",
  examType = "all",
  visible = true
}: {
  year?: "all" | string[];
  educationLevel?: "all" | edu_level[];
  school?: "all" | string[];
  subject?: "all" | string[];
  examType?: "all" | exam_type[];
  visible?: boolean
}) {
  const whereClause = {
    year: year === "all" ? {} : {in: year},
    educationLevel: educationLevel === "all" ? {} : {in: educationLevel},
    school: school === "all" ? {} : {in: school},
    subject: subject === "all" ? {} : {in: subject},
    examType: examType === "all" ? {} : {in: examType},
    visible
  };
  return whereClause;
}
