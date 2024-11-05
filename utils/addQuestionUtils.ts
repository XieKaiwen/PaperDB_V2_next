import {
  ACCEPTED_IMAGE_TYPES,
  MAX_QUESTION_PART_NUM,
  MIN_QUESTION_PART_NUM,
} from "@/src/constants/constants";
import {
  AddQuestionFormQuestionPart,
  ProcessedQuestionContentCombinedJSON,
  ProcessedQuestionPart,
} from "@/src/types/types";
import { exam_type } from "@prisma/client";
import { z } from "zod";
import { convertRomanToInt } from "./utils";

const textQuestionPartSchema = z.object({
  questionIdx: z.string().min(1, { message: "Choose an index" }),
  questionSubIdx: z.string().min(1, { message: "Choose an sub index" }),
  order: z.string().refine(
    (val) => {
      const parsedInt = parseInt(val);
      if (isNaN(parsedInt)) return false;
      return true;
    },
    { message: "Please enter a valid number" }
  ),
  isText: z.boolean(),
  text: z.string().min(1, { message: "Required, delete if not needed" }),
  id: z.string().optional()
});

const imageQuestionPartSchema = z.object({
  questionIdx: z.string().min(1, { message: "Choose an index" }),
  questionSubIdx: z.string().min(1, { message: "Choose an sub index" }),
  order: z.string().refine(
    (val) => {
      const parsedInt = parseInt(val);
      // console.log(parsedInt)
      if (isNaN(parsedInt)) return false;
      return true;
    },
    { message: "Please enter a valid number" }
  ),
  isText: z.boolean(),
  image: z.instanceof(File).refine(
    (file) => {
      return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
    },
    {
      message: "A valid image file (jpeg, png) is required.", // Custom error message
    }
  ),
  id: z.string()
});

export const contentTypeSchema = z.union([
  textQuestionPartSchema,
  imageQuestionPartSchema,
]);

export const questionPartSchema = z.object({
  examType: z
    .nativeEnum(exam_type)
    .optional()
    .refine((val) => val !== undefined && val !== null, {
      message: "This field is required. Please select an exam type.",
    }),
  year: z.string().min(1, { message: "Choose a year" }),
  educationLevel: z.string().min(1, { message: "Choose an education level" }),
  school: z.string().min(1, { message: "Choose a school" }),
  subject: z.string().min(1, { message: "Choose a subject" }),
  topics: z
    .array(z.string())
    .min(1, { message: "At least one topic is required" }),
  questionType: z.string().min(1, { message: "Choose a question type" }),
  questionNumber: z.string().refine(
    (val) => {
      const parsedInt = parseInt(val);
      // console.log(parsedInt)
      if (isNaN(parsedInt)) return false;
      return true;
    },
    { message: "Please enter a valid question number" }
  ),
  questionPart: z
    .array(contentTypeSchema)
    .min(MIN_QUESTION_PART_NUM, {
      message: `You need at least ${MIN_QUESTION_PART_NUM} question part`,
    })
    .max(MAX_QUESTION_PART_NUM, {
      message: `You can have at most ${MAX_QUESTION_PART_NUM} question part`,
    }),
});

export function validateTopicWithinEducationLevel(
  topicEducationLevel: string,
  watchedEducationLevel: string
) {
  if (topicEducationLevel[0] === watchedEducationLevel[0]) {
    return watchedEducationLevel >= topicEducationLevel;
  }
  return false;
}

// PROCESS questionPart[] INTO QuestionContentCombinedJSON (for QuestionPreview)
export function processQuestionPartIntoQuestionContentJSON(
  data: AddQuestionFormQuestionPart[]
) {
  const questionContentJSON: ProcessedQuestionContentCombinedJSON = {
    questionContent: {
      root: [],
      indexed: {},
    },
    questionLeafs: {},
  };

  // Use a temporary structure to store unique questionSubIdx values
  const tempLeafSets: { [key: string]: Set<string> } = {};

  data.forEach((questionPart) => {
    const { questionIdx, questionSubIdx, order, isText, id} = questionPart;
    if(!questionIdx || !questionSubIdx) return;
    
    const contentItem: ProcessedQuestionPart = isText ? {
      isText,
      content: questionPart.text,
      id
    } : {
      isText,
      content: questionPart.image,
      id
    };

    const orderIndex = parseInt(order) || 0;

    if(questionIdx === "root"){
      // push into root if questionIdx is "root", sorted by order
      questionContentJSON.questionContent.root.push({...contentItem, order:orderIndex});
    }else{
      // Handle indexed items
      if(!questionContentJSON.questionContent.indexed[questionIdx]){
        questionContentJSON.questionContent.indexed[questionIdx] = {};
      }
      if (!questionContentJSON.questionContent.indexed[questionIdx][questionSubIdx]) {
        questionContentJSON.questionContent.indexed[questionIdx][questionSubIdx] = [];
      }

      questionContentJSON.questionContent.indexed[questionIdx][questionSubIdx].push({
        ...contentItem,
        order: orderIndex,
      });
    }

    // Add to questionLeafs using a Set
    if (!tempLeafSets[questionIdx]) {
      tempLeafSets[questionIdx] = new Set<string>();
    }
    if (questionSubIdx !== "root") {
      tempLeafSets[questionIdx].add(questionSubIdx);
    }
  });

  // Sort root and indexed arrays by order and remove `order` from final output
  questionContentJSON.questionContent.root.sort((a, b) => a.order - b.order);
  questionContentJSON.questionContent.root = questionContentJSON.questionContent.root.map(({ order, ...rest }) => rest);

  Object.keys(questionContentJSON.questionContent.indexed).forEach((idx) => {
    Object.keys(questionContentJSON.questionContent.indexed[idx]).forEach((subIdx) => {
      questionContentJSON.questionContent.indexed[idx][subIdx].sort((a, b) => a.order - b.order);
      questionContentJSON.questionContent.indexed[idx][subIdx] = questionContentJSON.questionContent.indexed[idx][subIdx].map(({ order, ...rest }) => rest);
    });
  });
  if(Object.keys(tempLeafSets).length === 0){
    questionContentJSON.questionLeafs = null;
    return questionContentJSON
  }
  // Convert Sets to sorted arrays and assign to questionLeafs
  Object.keys(tempLeafSets).forEach((key) => {
    questionContentJSON.questionLeafs![key] = Array.from(tempLeafSets[key]).sort(
      (a, b) => convertRomanToInt(a) - convertRomanToInt(b)
    );
  });
  return questionContentJSON
}
