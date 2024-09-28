import {
  ACCEPTED_IMAGE_TYPES,
  MAX_QUESTION_PART_NUM,
  MIN_QUESTION_PART_NUM,
} from "@/constants/constants";
import { exam_type } from "@prisma/client";
import { z } from "zod";

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
});

const contentTypeSchema = z.union([
  textQuestionPartSchema,
  imageQuestionPartSchema,
]);

export const questionPartSchema = z.object({
  examType: z
    .nativeEnum(exam_type).optional()
    .refine((val) => val !== undefined && val !== null, {
      message:
        "This field is required. Please select an exam type.",
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
