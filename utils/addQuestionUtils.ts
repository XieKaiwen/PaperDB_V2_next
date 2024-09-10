import { ACCEPTED_IMAGE_TYPES, MAX_QUESTION_PART_NUM, MIN_QUESTION_PART_NUM } from "@/constants/constants";
import {z} from "zod"

const textQuestionPartSchema = z.object({
    questionIdx: z.string().nullable(),
    questionSubIdx: z.string().nullable(),
    isImage: z.boolean(),
    text: z.string().min(1, {message: "Required, delete if not needed"})
})

const imageQuestionPartSchema = z.object({
    questionIdx: z.string().nullable(),
    questionSubIdx: z.string().nullable(),
    isImage: z.boolean(),
    image: z.instanceof(File).refine((file) => {
        return file && ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, {
        message: "A valid image file (jpeg, png) is required.", // Custom error message
    })
})

const contentTypeSchema = z.union([textQuestionPartSchema, imageQuestionPartSchema])

export const questionPartSchema = z.object({
    questionPart: z.array(contentTypeSchema)
    .min(MIN_QUESTION_PART_NUM, {message: `You need at least ${MIN_QUESTION_PART_NUM} question part`})
    .max(MAX_QUESTION_PART_NUM, {message: `You can have at most ${MAX_QUESTION_PART_NUM} question part`})
})  