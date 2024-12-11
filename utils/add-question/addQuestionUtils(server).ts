import { QuestionPartWithOrderIntArray, QuestionContentWithOrder, QuestionPartWithOrderIntWithoutIdx, FinalisedQuestionContent, FinalisedQuestionLeafs, QuestionAnswerArray, FinalisedMarkScheme, FinalisedOEQQuestionAnswer, OEQAnswerArray, MCQAnswerItemArray, FinalisedNonMultiMCQQuestionAnswer, FinalisedMultiMCQQuestionAnswer } from "@/src/types/types";
import { convertRomanToInt } from "../utils";

// #####################################################################################
// ### ALL FUNCTIONS BELOW ARE TO FORMAT QUESTION PARTS AND QUESTION ANSWER
// INTO FINALISED JSON STRUCTURES IN THE DATABASE
// utils for add-question is split into client and server because file for server cannot contain File objects

// For uploading images on client-side for questionParts and questionAnswer
// For questionContent and questionLeafs

export function processQuestionPartIntoFinalQuestionContentQuestionLeafs(
  questionParts: QuestionPartWithOrderIntArray,
  questionType: string
) {
  const questionContentWithOrderJSON: QuestionContentWithOrder = {
    root: [],
    indexed: {},
  };

  const tempLeafSets: { [key: string]: Set<string>; } = {};

  questionParts.forEach((questionPart) => {
    const { questionIdx, questionSubIdx, order, isText, id } = questionPart;

    const contentItem: QuestionPartWithOrderIntWithoutIdx = isText
      ? {
        isText: true,
        text: questionPart.text,
        order,
        id,
      }
      : {
        isText: false,
        image: questionPart.image,
        order,
        id,
      };

    if (questionIdx === "root") {
      questionContentWithOrderJSON.root.push(contentItem);
    } else {
      if (!questionContentWithOrderJSON.indexed[questionIdx]) {
        questionContentWithOrderJSON.indexed[questionIdx] = {};
      }
      if (!questionContentWithOrderJSON.indexed[questionIdx][questionSubIdx]) {
        questionContentWithOrderJSON.indexed[questionIdx][questionSubIdx] = [];
      }
      questionContentWithOrderJSON.indexed[questionIdx][questionSubIdx].push(
        contentItem
      );
    }

    // Add to questionLeafs using a Set
    if (questionIdx !== "root" && !tempLeafSets[questionIdx]) {
      tempLeafSets[questionIdx] = new Set<string>();
    }
    if (questionSubIdx !== "root") {
      tempLeafSets[questionIdx].add(questionSubIdx);
    }
  });
  const finalQuestionContent: FinalisedQuestionContent = {
    root: [],
    indexed: {},
  };

  questionContentWithOrderJSON.root.sort((a, b) => a.order - b.order);
  finalQuestionContent.root = questionContentWithOrderJSON.root.map(
    ({ order, ...rest }) => rest
  );
  Object.keys(questionContentWithOrderJSON.indexed).forEach((idx) => {
    Object.keys(questionContentWithOrderJSON.indexed[idx]).forEach((subIdx) => {
      if (!finalQuestionContent.indexed[idx]) {
        finalQuestionContent.indexed[idx] = {};
      } // Ensure that it is initialised

      questionContentWithOrderJSON.indexed[idx][subIdx].sort(
        (a, b) => a.order! - b.order!
      );
      finalQuestionContent.indexed[idx][subIdx] =
        questionContentWithOrderJSON.indexed[idx][subIdx].map(
          ({ order, ...rest }) => rest
        );
    });
  });


  if (Object.keys(tempLeafSets).length === 0 || questionType === "MCQ") {
    const questionLeafs: FinalisedQuestionLeafs = null;

    return { questionContent: finalQuestionContent, questionLeafs };
  }

  const questionLeafs: FinalisedQuestionLeafs = {};
  // Need to sort the tempLeafSet's keys alphabetically to keep it in order
  const sortedTempLeafSets = Object.keys(tempLeafSets)
    .sort((a, b) => a.localeCompare(b))
    .reduce((sortedObj: { [key: string]: Set<string>; }, key) => {
      sortedObj[key] = tempLeafSets[key];
      return sortedObj;
    }, {});

  // Convert Sets to sorted arrays and assign to questionLeafs
  Object.keys(sortedTempLeafSets).forEach((key) => {
    questionLeafs[key] = Array.from(
      sortedTempLeafSets[key]
    ).sort((a, b) => convertRomanToInt(a) - convertRomanToInt(b));
  });

  return { questionContent: finalQuestionContent, questionLeafs };
}

export function processQuestionAnswerIntoFinalQuestionAnswer(
  questionAnswer: QuestionAnswerArray,
  questionType: string
) {
  /**
   * In this function, we are parsing through questionAnswer to get
   * 4 things:
   * isMulti, fullMark, markScheme, finalised questionAnswer
   */
  if (questionType === "OEQ") {
    const resultJSON: {
      isMulti: boolean | null;
      fullMark: number;
      markScheme: FinalisedMarkScheme;
      finalisedQuestionAnswer: FinalisedOEQQuestionAnswer;
    } = {
      isMulti: null,
      fullMark: 0,
      markScheme: {},
      finalisedQuestionAnswer: {}
    };
    // Treat here for OEQ
    (questionAnswer as OEQAnswerArray).forEach((answer) => {
      if (!resultJSON.finalisedQuestionAnswer[answer.questionIdx]) {
        resultJSON.finalisedQuestionAnswer[answer.questionIdx] = {};
      }
      resultJSON.finalisedQuestionAnswer[answer.questionIdx][answer.questionSubIdx] = answer.isText ? {
        isText: true,
        text: answer.text,
        mark: parseInt(answer.mark)
      } : {
        isText: false,
        image: answer.image,
        mark: parseInt(answer.mark)
      };
      resultJSON.markScheme![answer.questionIdx] = {};
      resultJSON.markScheme![answer.questionIdx][answer.questionSubIdx] = parseInt(answer.mark);
      resultJSON.fullMark += parseInt(answer.mark);
    });
    return resultJSON;
  } else {
    // Treat here for MCQ
    const extractedMCQAnswer = (questionAnswer as MCQAnswerItemArray)[0];
    if (extractedMCQAnswer.answer.length === 1) {
      // isMulti is false
      const resultJSON: {
        isMulti: false;
        fullMark: number;
        markScheme: null;
        finalisedQuestionAnswer: FinalisedNonMultiMCQQuestionAnswer;
      } = {
        isMulti: false,
        fullMark: 0,
        markScheme: null,
        finalisedQuestionAnswer: { options: [], answer: "" }
      };

      resultJSON.fullMark = parseInt(extractedMCQAnswer.mark);
      resultJSON.finalisedQuestionAnswer.answer = extractedMCQAnswer.answer[0];
      resultJSON.finalisedQuestionAnswer.options = extractedMCQAnswer.options;
      return resultJSON;
    } else {
      const resultJSON: {
        isMulti: true;
        fullMark: number;
        markScheme: null;
        finalisedQuestionAnswer: FinalisedMultiMCQQuestionAnswer;
      } = {
        isMulti: true,
        fullMark: 0,
        markScheme: null,
        finalisedQuestionAnswer: { options: [], answer: [] }
      };

      resultJSON.fullMark = parseInt(extractedMCQAnswer.mark);
      resultJSON.finalisedQuestionAnswer.answer = extractedMCQAnswer.answer;
      resultJSON.finalisedQuestionAnswer.options = extractedMCQAnswer.options;
      return resultJSON;
    }
  }
}
