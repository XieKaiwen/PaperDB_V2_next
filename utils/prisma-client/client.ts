import { FinalisedMarkScheme, FinalisedQuestionAnswer, FinalisedQuestionContent, FinalisedQuestionLeafs } from "@/src/types/types";
import { Difficulty, edu_level, exam_type, PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient().$extends({
  // Extending the client with custom methods
  model: {
    question: {
      
      async createQuestion({
        paperId,
        questionType,
        isMulti,
        topics,
        fullMark,
        markScheme,
        difficulty,
        passingRate,
        questionNumber,
        questionLeafs,
        questionContent,
        questionAnswer,
      }: {
        paperId: string;
        questionType: string;
        isMulti?: boolean;
        topics: string[];
        fullMark: number;
        markScheme?: NonNullable<FinalisedMarkScheme>; // Adjust type based on your `Json?` schema
        difficulty?: Difficulty; // Adjust type if it's enum
        passingRate?: number ;
        questionNumber: number;
        questionLeafs?: NonNullable<FinalisedQuestionLeafs>; // Adjust type based on your `Json?` schema
        questionContent: FinalisedQuestionContent; // Adjust type based on your `Json` schema
        questionAnswer: FinalisedQuestionAnswer; // Adjust type based on your `Json` schema
      }) {
        // Validate input here if needed
        if (!paperId ||  !questionType || !questionContent || !questionAnswer) {
          throw new Error("Required fields are missing to create question.");
        }

        // Create the question
        const question = await prisma.question.create({
          data: {
            paperId,
            questionType: questionType as QuestionType,
            isMulti,
            topics,
            fullMark,
            markScheme,
            difficulty,
            passingRate,
            questionNumber,
            questionLeafs,
            questionContent,
            questionAnswer,
          },
        });

        return question;
      },

      async upsertQuestion({
        paperId,
        questionType,
        isMulti,
        topics,
        fullMark,
        markScheme,
        difficulty,
        passingRate,
        questionNumber,
        questionLeafs,
        questionContent,
        questionAnswer,
      }: {
        paperId: string;
        questionType: string;
        isMulti?: boolean;
        topics: string[];
        fullMark: number;
        markScheme?: NonNullable<FinalisedMarkScheme>; // Adjust type based on your `Json?` schema
        difficulty?: Difficulty; // Adjust type if it's enum
        passingRate?: number;
        questionNumber: number;
        questionLeafs?: NonNullable<FinalisedQuestionLeafs>; // Adjust type based on your `Json?` schema
        questionContent: FinalisedQuestionContent; // Adjust type based on your `Json` schema
        questionAnswer: FinalisedQuestionAnswer; // Adjust type based on your `Json` schema
      }) {
        if (!paperId || !questionType || !questionContent || !questionAnswer) {
          throw new Error("Required fields are missing to upsert question.");
        }
  
        const question = await prisma.question.upsert({
          where: {
            paperId_questionNumber: {
              paperId,
              questionNumber,
            },
          },
          create: {
            paperId,
            questionType: questionType as QuestionType,
            isMulti,
            topics,
            fullMark,
            markScheme,
            difficulty,
            passingRate,
            questionNumber,
            questionLeafs,
            questionContent,
            questionAnswer,
          },
          update: {
            questionType: questionType as QuestionType,
            isMulti,
            topics,
            fullMark,
            markScheme,
            difficulty,
            passingRate,
            questionLeafs,
            questionContent,
            questionAnswer,
          },
        });
  
        return question;
      },
    },
    paper: {
      async createPaper({
        userId,
        schoolId,
        subjectId,
        educationLevel,
        totalMark,
        examType,
        visible = false,
        year,
      }: {
        userId: string;
        schoolId: string;
        subjectId: string;
        educationLevel: edu_level;
        totalMark: number;
        examType: exam_type;
        visible?: boolean;
        year: string;
      }) {
        return prisma.paper.create({
          data: {
            schoolId,
            subjectId,
            userId,
            educationLevel,
            totalMark,
            examType,
            visible,
            year,
          },
        });
      },

      async getPaperIdByMetadata({
        schoolId,
        subjectId,
        educationLevel,
        examType,
        year,
      }: {
        schoolId: string;
        subjectId: string;
        educationLevel:edu_level
        examType:exam_type
        year: string;
      }) {
        const paper = await prisma.paper.findFirst({
          where: {
            schoolId,
            subjectId,
            educationLevel,
            examType,
            year,
          },
          select: { id: true }, // Only return the paper ID
        });

        return paper?.id || null; // Return the paper ID if found, or null otherwise
      },
    },
  },
});

export default prisma;
