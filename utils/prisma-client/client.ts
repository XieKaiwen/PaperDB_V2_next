import {
  FinalisedMarkScheme,
  FinalisedQuestionAnswer,
  FinalisedQuestionContent,
  FinalisedQuestionLeafs,
  ParsedPaperFilterProps,
} from '@/src/types/types';
import {
  Difficulty,
  edu_level,
  exam_type,
  Prisma,
  PrismaClient,
  QuestionType,
} from '@prisma/client';
import { determineVisibility, whereClauseConstructorForPapers } from '../prismaUtils';
import { examTypeOrder } from '@/src/constants/constants';

const prisma = new PrismaClient().$extends({
  // Extending the client with custom methods
  model: {
    user: {
      async getUserById(id: string) {
        return prisma.user.findUnique({ where: { id } });
      },
    },
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
        passingRate?: number;
        questionNumber: number;
        questionLeafs?: NonNullable<FinalisedQuestionLeafs>; // Adjust type based on your `Json?` schema
        questionContent: FinalisedQuestionContent; // Adjust type based on your `Json` schema
        questionAnswer: FinalisedQuestionAnswer; // Adjust type based on your `Json` schema
      }) {
        // Validate input here if needed
        if (!paperId || !questionType || !questionContent || !questionAnswer) {
          throw new Error('Required fields are missing to create question.');
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
          throw new Error('Required fields are missing to upsert question.');
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
        educationLevel: edu_level;
        examType: exam_type;
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

      async retrievePapersPaginated(
        {
          year = [],
          educationLevel = [],
          school = [],
          subject = [],
          examType = [],
          userId = [],
          fetchVisible = false,
          fetchNonVisible = false,
        }: ParsedPaperFilterProps,
        page: number,
        pageSize: number,
        includeFields: Prisma.PaperInclude = {},
        selectFields: Prisma.PaperSelect = {},
      ) {
        const whereClause = whereClauseConstructorForPapers({
          year,
          educationLevel,
          school,
          subject,
          examType,
          userId,
          fetchVisible,
          fetchNonVisible,
        });

        const skip = (page - 1) * pageSize;

        // Fetch paginated data
        const papers = await prisma.paper.findMany({
          where: whereClause,
          skip,
          take: pageSize,
          orderBy: [
            {
              dateAdded: 'desc',
            },
            {
              year: 'desc',
            },
            {
              educationLevel: 'desc',
            },
            {
              School: {
                schoolFullName: 'asc',
              },
            },
            { examType: 'asc' },
          ],
          ...(Object.keys(selectFields).length > 0
            ? { select: selectFields }
            : { include: includeFields }),
        });

        return papers;
      },

      async retrievePapersCount({
        year = [],
        educationLevel = [],
        school = [],
        subject = [],
        examType = [],
        userId = [],
        fetchVisible = false,
        fetchNonVisible = false,
      }: ParsedPaperFilterProps) {
        const whereClause = whereClauseConstructorForPapers({
          year,
          educationLevel,
          school,
          subject,
          examType,
          userId,
          fetchVisible,
          fetchNonVisible,
        });

        const totalCount = await prisma.paper.count({
          where: whereClause,
        });

        return totalCount;
      },

      async getDistinctPaperColumnValues(includeVisible: boolean, includeNonVisible: boolean) {
        // Conditions based on the visibility (if provided)
        const visible = determineVisibility(includeVisible, includeNonVisible);
        const whereClause = visible !== null ? { visible } : {};

        // First, run all distinct queries in parallel for scalar fields.
        const [
          distinctEducationLevels,
          distinctExamTypes,
          distinctYears,
          distinctSchoolIds,
          distinctSubjectIds,
          distinctUserIds,
        ] = await Promise.all([
          prisma.paper.findMany({
            distinct: ['educationLevel'],
            where: whereClause,
            select: { educationLevel: true },
          }),
          prisma.paper.findMany({
            distinct: ['examType'],
            where: whereClause,
            select: { examType: true },
          }),
          prisma.paper.findMany({
            distinct: ['year'],
            where: whereClause,
            select: { year: true },
            orderBy: { year: 'desc' },
          }),
          prisma.paper.findMany({
            distinct: ['schoolId'],
            where: whereClause,
            select: { schoolId: true },
            // We'll sort after we get the actual School objects
          }),
          prisma.paper.findMany({
            distinct: ['subjectId'],
            where: whereClause,
            select: { subjectId: true },
            // We'll sort after we get the actual Subject objects
          }),
          prisma.paper.findMany({
            distinct: ['userId'],
            where: whereClause,
            select: { userId: true },
            // We'll sort after we get the actual User objects
          }),
        ]);

        // Convert the Prisma results into arrays of distinct values
        const educationLevels = distinctEducationLevels
          .map((p) => p.educationLevel)
          .sort((a, b) => {
            const firstA = a[0]; // 'P', 'S', or 'J'
            const firstB = b[0]; // 'P', 'S', or 'J'

            // Define the order of first letters
            const orderMap: Record<string, number> = { P: 1, S: 2, J: 3 };

            // Compare based on the order of first letters
            if (orderMap[firstA] !== orderMap[firstB]) {
              return orderMap[firstA] - orderMap[firstB];
            }

            // If first letters are the same, compare by numeric level
            const levelA = parseInt(a.slice(1), 10);
            const levelB = parseInt(b.slice(1), 10);

            return levelA - levelB;
          });
        const examTypes = distinctExamTypes
          .map((p) => p.examType)
          .sort((a, b) => {
            // Sort by enum value
            return examTypeOrder[a] - examTypeOrder[b];
          });
        const years = distinctYears
          .map((p) => p.year)
          .sort((a, b) => {
            // Sort by enum value
            return parseInt(b, 10) - parseInt(a, 10); // sort in descending order
          });

        const schoolIds = distinctSchoolIds.map((p) => p.schoolId);
        const subjectIds = distinctSubjectIds.map((p) => p.subjectId);
        const userIds = distinctUserIds.map((p) => p.userId);

        // Fetch related objects in parallel
        const [schools, subjects, users] = await Promise.all([
          prisma.school.findMany({
            where: { id: { in: schoolIds } },
            orderBy: { schoolFullName: 'asc' }, // example sorting by full name
          }),
          prisma.subject.findMany({
            where: { id: { in: subjectIds } },
            orderBy: { subjectName: 'asc' }, // sorting by subject name
          }),
          prisma.user.findMany({
            where: { id: { in: userIds } },
            orderBy: { username: 'asc' }, // sorting by username (customize as needed)
          }),
        ]);

        return {
          educationLevels,
          examTypes,
          years,
          schools,
          subjects,
          users,
        };
      },
    },
  },
});

export default prisma;
