'use server';

import {
  MCQAnswerItemArray,
  QuestionAnswerArray,
  QuestionPartWithOrderIntArray,
} from '@/src/types/types';
import { createPaper, getPaperIdByMetadata } from './paper.actions';
import { InternalServerError } from '@/src/custom-errors/errors';
import {
  processQuestionAnswerIntoFinalQuestionAnswer,
  processQuestionPartIntoFinalQuestionContentQuestionLeafs,
} from '@/utils/add-question/addQuestionUtils(server)';
import { edu_level, exam_type } from '@prisma/client';
import prisma from '@/utils/prisma-client/client';

// ### CREATE ###
interface RequiredQuestionInfo {
  year: string;
  educationLevel: edu_level;
  school: string;
  subject: string;
  examType: exam_type;
  topics: string[];
  questionType: string;
  questionNumber: string;
  questionPart: QuestionPartWithOrderIntArray;
  questionAnswer: QuestionAnswerArray;
}
interface CreateQuestionProps extends RequiredQuestionInfo {
  paperId: string;
}
export async function createQuestion({
  paperId,
  year,
  educationLevel,
  school,
  subject,
  examType,
  topics,
  questionType,
  questionNumber,
  questionPart,
  questionAnswer,
}: CreateQuestionProps) {
  // 1. Convert questionPart into questionContent and questionLeafs
  const { questionContent, questionLeafs } =
    processQuestionPartIntoFinalQuestionContentQuestionLeafs(questionPart, questionType);

  // 2. sort topics alphabetically
  topics.sort((a, b) => {
    return a.localeCompare(b);
  });
  // 3. turn questionAnswer into finalisedQuestionAnswer
  const { isMulti, fullMark, markScheme, finalisedQuestionAnswer } =
    processQuestionAnswerIntoFinalQuestionAnswer(
      questionAnswer as MCQAnswerItemArray,
      questionType,
    );
  const newQuestion = await prisma.question.upsertQuestion({
    paperId,
    questionType,
    isMulti: isMulti ?? undefined,
    topics,
    fullMark,
    markScheme: markScheme ?? undefined,
    difficulty: undefined,
    passingRate: undefined,
    questionNumber: parseInt(questionNumber),
    questionLeafs: questionLeafs ?? undefined,
    questionContent: questionContent,
    questionAnswer: finalisedQuestionAnswer,
  });
  console.log('New question successfully created', newQuestion);
}

export async function createQuestionWithPaperMetadata({
  userId,
  questionFormData,
}: {
  userId: string;
  questionFormData: RequiredQuestionInfo;
}) {
  const {
    year,
    educationLevel,
    school,
    subject,
    examType,
    topics,
    questionType,
    questionNumber,
    questionPart,
    questionAnswer,
  } = questionFormData;
  try {
    // 1. Check if paper exists and create paper if it does not exist
    const existingPaperId = await getPaperIdByMetadata({
      year,
      educationLevel,
      school,
      subject,
      examType,
    } as {
      year: string;
      educationLevel: edu_level;
      school: string;
      subject: string;
      examType: exam_type;
    });
    if (!existingPaperId) {
      // 2. If paper does not exist, create the paper
      try {
        const newPaper = await createPaper({
          userId,
          school,
          subject,
          educationLevel: educationLevel as edu_level,
          examType,
          year,
        });

        await createQuestion({
          paperId: newPaper.id,
          year,
          educationLevel,
          school,
          subject,
          examType,
          topics,
          questionType,
          questionNumber,
          questionPart,
          questionAnswer,
        });
      } catch (error) {
        console.error(error);
        throw new InternalServerError();
      }
    } else {
      // 2. If the paper does exist, use existing paperId to create the question
      await createQuestion({
        paperId: existingPaperId,
        year,
        educationLevel,
        school,
        subject,
        examType,
        topics,
        questionType,
        questionNumber,
        questionPart,
        questionAnswer,
      });
    }
  } catch (err) {
    console.error(err);
    throw new InternalServerError();
  }
}

// ### READ ###

export async function checkIfQuestionNumberExists({
  year,
  examType,
  subjectId,
  schoolId,
  educationLevel,
  questionNumber,
}: {
  year: string;
  examType: exam_type;
  subjectId: string;
  schoolId: string;
  educationLevel: edu_level;
  questionNumber: string;
}) {
  try {
    const paper = await prisma.paper.findFirst({
      where: {
        year,
        examType,
        subjectId,
        schoolId,
        educationLevel,
      },
      select: {
        id: true, // Get the paper ID
      },
    });

    if (!paper) {
      return false;
    }
    const questionNumberInt = parseInt(questionNumber);
    const question = await prisma.question.findFirst({
      where: {
        paperId: paper.id,
        questionNumber: questionNumberInt, // Check for the specific question number
      },
      select: {
        id: true, // Return the question ID if found
      },
    });
    if (!question) {
      console.log('Question not found');
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
