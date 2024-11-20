import {
  ACCEPTED_IMAGE_TYPES,
  MAX_QUESTION_PART_NUM,
  MIN_QUESTION_PART_NUM,
} from "@/src/constants/constants";
import {
  AddQuestionAnswerItem,
  AddQuestionFormData,
  AddQuestionFormQuestionPart,
  ProcessedOEQQuestionAnswerJSON,
  ProcessedQuestionContentCombinedJSON,
  ProcessedQuestionPart,
} from "@/src/types/types";
import { exam_type } from "@prisma/client";
import { z } from "zod";
import { convertRomanToInt, parseStringify } from "./utils";
import {v4 as uuidv4 } from "uuid";


export const defaultValues: AddQuestionFormData = {
  year: "",
  educationLevel: "",
  school: "",
  subject: "",
  topics: [],
  examType: undefined,
  questionType: "",
  questionNumber: "",
  questionPart: [],
  questionAnswer: [],
}


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
  id: z.string(),
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
  id: z.string(),
});

// For MCQ, there should only be a question at the root, hence no questionIdx and questionSubIdx
// The only 2 keys there will be are the option and the correct answer
export const MCQAnswerSchema = z
  .array(
    z.object({
      options: z
        .array(z.string())
        .min(2, { message: "At least 2 options are required" }),
      answer: z.array(z.string()).min(1, {
        message:"There must be at least 1 correct answer",
      }),
    })
  )
  .max(1, { message: "MCQ should only have 1 answer input" });

// For OEQ, there should be an array of objects with questionIdx, questionSubIdx and the answer
// The questionIdx and questionSubIdx is automatically set when rendering the answer step of the form, hence no need to validate them
export const OEQAnswerSchema = z.array(
  z.object({
    questionIdx: z.string(),
    questionSubIdx: z.string(),
    answer: z.union([
      z.string().min(1, { message: "Answer cannot be empty" }),
      z.instanceof(File).refine(
        (file) => ["image/jpeg", "image/png"].includes(file.type),
        { message: "File must be a JPEG or PNG image" }
      )
    ]),
    id: z.string(),
    isText: z.boolean()
  }).refine(
    (data) => (data.isText ? typeof data.answer === "string" : data.answer instanceof File),
    {
      message: "Answer must be a string if isText is true, or a JPEG/PNG file if isText is false",
      path: ["answer"],
    }
  )
);

export const answerCombinedSchema = z.union([MCQAnswerSchema, OEQAnswerSchema]);

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
  questionAnswer: answerCombinedSchema,
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

// PROCESS questionPart INTO QuestionContentCombinedJSON (for QuestionPreview)
export function processQuestionPartIntoQuestionContentJSON(
  data: AddQuestionFormQuestionPart[],
  questionType: string
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
    const { questionIdx, questionSubIdx, order, isText, id } = questionPart;
    if (!questionIdx || !questionSubIdx) return;

    const contentItem: ProcessedQuestionPart = isText
      ? {
          isText,
          content: questionPart.text,
          id,
        }
      : {
          isText,
          content: questionPart.image,
          id,
        };

    const orderIndex = parseInt(order) || 0;

    if (questionIdx === "root") {
      // push into root if questionIdx is "root", sorted by order
      questionContentJSON.questionContent.root.push({
        ...contentItem,
        order: orderIndex,
      });
    } else {
      // Handle indexed items
      if (!questionContentJSON.questionContent.indexed[questionIdx]) {
        questionContentJSON.questionContent.indexed[questionIdx] = {};
      }
      if (
        !questionContentJSON.questionContent.indexed[questionIdx][
          questionSubIdx
        ]
      ) {
        questionContentJSON.questionContent.indexed[questionIdx][
          questionSubIdx
        ] = [];
      }

      questionContentJSON.questionContent.indexed[questionIdx][
        questionSubIdx
      ].push({
        ...contentItem,
        order: orderIndex,
      });
    }

    // Add to questionLeafs using a Set
    if (questionIdx !== "root" && !tempLeafSets[questionIdx]) {
      tempLeafSets[questionIdx] = new Set<string>();
    }
    if (questionSubIdx !== "root") {
      tempLeafSets[questionIdx].add(questionSubIdx);
    }
  });

  // Sort root and indexed arrays by order and remove `order` from final output
  questionContentJSON.questionContent.root.sort((a, b) => a.order - b.order);
  questionContentJSON.questionContent.root =
    questionContentJSON.questionContent.root.map(({ order, ...rest }) => rest);

  Object.keys(questionContentJSON.questionContent.indexed).forEach((idx) => {
    Object.keys(questionContentJSON.questionContent.indexed[idx]).forEach(
      (subIdx) => {
        questionContentJSON.questionContent.indexed[idx][subIdx].sort(
          (a, b) => a.order - b.order
        );
        questionContentJSON.questionContent.indexed[idx][subIdx] =
          questionContentJSON.questionContent.indexed[idx][subIdx].map(
            ({ order, ...rest }) => rest
          );
      }
    );
  });
  // console.log(JSON.stringify(tempLeafSets, null, 2));
  

  if (Object.keys(tempLeafSets).length === 0 || questionType === "MCQ") {
    questionContentJSON.questionLeafs = null;
    return questionContentJSON;
  }
  // Need to sort the tempLeafSet's keys alphabetically to keep it in order
  const sortedTempLeafSets = Object.keys(tempLeafSets)
    .sort((a, b) => a.localeCompare(b))
    .reduce((sortedObj: { [key: string]: Set<string> }, key) => {
      sortedObj[key] = tempLeafSets[key];
      return sortedObj;
    }, {});

  // Convert Sets to sorted arrays and assign to questionLeafs
  Object.keys(sortedTempLeafSets).forEach((key) => {
    questionContentJSON.questionLeafs![key] = Array.from(
      sortedTempLeafSets[key]
    ).sort((a, b) => convertRomanToInt(a) - convertRomanToInt(b));
  });
  return questionContentJSON;
}

// STRUCTURING questionAnswer BASED ON questionType and questionParts
export function questionAnswerRequiresReset(
  questionType: string,
  questionAnswer: z.infer<typeof answerCombinedSchema>
) {
  // console.log("watchedQuestionAnswer:",questionAnswer);
  // console.log("watchedQuestionType:" + questionType);
  // FIRST, DETERMINE IF questionAnswer REQUIRES A RESET
  if (questionAnswer.length === 0) return true;
  
  const firstObj = questionAnswer[0];
  console.log(firstObj);
  if (questionType === "MCQ") {
    // IF questionType is MCQ, questionAnswer should be an array containing a singular object
    // WITH THE KEYS `options` and `answer`
    // console.log("here", (!firstObj || !("options" in firstObj && "answer" in firstObj)));
    
    return !firstObj || !("options" in firstObj && "answer" in firstObj) || !(firstObj.options !== undefined && firstObj.answer !== undefined);
  } else if (questionType === "OEQ") {
    return (
      !firstObj ||
      !(
        "questionIdx" in firstObj &&
        "questionSubIdx" in firstObj &&
        "answer" in firstObj
      )
    );
  }
  return false;
}

export function createQuestionAnswerValueAfterReset(
  questionType: string,
  questionLeafs: { [key: string]: string[] } | null
) {
  // IF REQUIRE RESET, RESET AND THEN CALL THIS FUNCTION
  // THIS FUNCTION RETURNS THE VALUE FOR questionAnswer to be updated to

  if (questionType === "MCQ") {
    // FOR MCQ, JUST UPDATE IT TO ARRAY WITH THE BAREBONES OBJECT
    return [{ options: [], answer: [] }] as [{options: string[], answer: string[]}];
  } else if (questionType === "OEQ") {
    const newQuestionAnswerValue = [];

    if (!questionLeafs) {
      // IF questionLeafs is NULL, it means that the question only has a root
      newQuestionAnswerValue.push({
        questionIdx: "root",
        questionSubIdx: "root",
        answer: "",
        id: uuidv4(),
        isText: true
      });
    } else {
      // CREATE ONE OBJECT FOR EACH questionLeaf in questionLeafs, in order, first by questionIdx, then by questionSubIdx
      Object.keys(questionLeafs).forEach((key) => {
        if (questionLeafs[key].length === 0) {
          // IF THE ARRAY UNDER THE KEY IS EMPTY, IT MEANS ITS questionSubIdx is root, a-root
          newQuestionAnswerValue.push({
            questionIdx: key,
            questionSubIdx: "root",
            answer: "",
            id: uuidv4(),
            isText: true
          });
        } else {
          // ELSE, THERE IS NO ROOT AND ONLY HAVE THE OTHER SUBKEYS AS SUBINDEX
          questionLeafs[key].forEach((subKey) => {
            newQuestionAnswerValue.push({
              questionIdx: key,
              questionSubIdx: subKey,
              answer: "",
              id: uuidv4(),
              isText: true
            });
          });
        }
      });
    }

    return newQuestionAnswerValue;
  }
}

// Type guard to check if an object is of type AnswerWithIndices
function hasQuestionIndices(obj: any): obj is { questionIdx: string; questionSubIdx: string; answer: string } {
  return typeof obj.questionIdx === "string" && typeof obj.questionSubIdx === "string";
}


export function createQuestionAnswerValueWithoutReset(
  questionType: string,
  questionLeafs: { [key: string]: string[] } | null,
  questionAnswer: z.infer<typeof answerCombinedSchema>
) {
  if (questionType === "MCQ") {
    // IF THERE IS NO RESET, IT MEANS QUESTION TYPE DID NOT CHANGE. 
    // SINCE MCQ WILL ONLY EVER HAVE 1 ELEMENT IN questionAnswer ARRAY, JUST RETURN IT. NO CHANGE
    return questionAnswer;
  }else if(questionType === "OEQ"){
    const newQuestionAnswerValue: z.infer<typeof OEQAnswerSchema> = [];
    questionAnswer = questionAnswer as z.infer<typeof OEQAnswerSchema>
    if(!questionLeafs){
      // IF questionLeafs is NULL, we search for an object in questionAnswer that has "root", "root" for questionIdx and questionSubIdx
      // IF FOUND, WE TAKE IT AS THE NEW QUESTION ANSWER VALUE
      // IF NOT FOUND, WE CREATE A NEW OBJECT WITH "root", "root" for questionIdx and questionSubIdx
      const foundObj  = questionAnswer.find(
        (obj) => hasQuestionIndices(obj) && obj.questionIdx === "root" && obj.questionSubIdx === "root"
      ) as { questionIdx: string; questionSubIdx: string; answer: string|File }|undefined;

      if(foundObj){
        // IF SUCH AN OBJECT IS FOUND, RETURN IT
        return [foundObj];
      }else{
        // IF NO SUCH AN OBJECT IS FOUND, CREATE A NEW OBJECT WITH "root", "root" for questionIdx and questionSubIdx
        return [{ questionIdx: "root", questionSubIdx: "root", answer: "", id: uuidv4(), isText: true }] as z.infer<typeof OEQAnswerSchema>;
      }
    }else{
      // IF questionLeafs IS NOT NULL, WE CREATE AN OBJECT FOR EACH questionLeaf in questionLeafs, IN ORDER, FIRST BY questionIdx, THEN BY questionSubIdx
      const hashMap = new Map()

      Object.keys(questionLeafs).forEach((key) => {
        if (questionLeafs[key].length === 0) {
          // IF THE ARRAY UNDER THE KEY IS EMPTY, IT MEANS ITS questionSubIdx is root, a-root
          // HENCE, WE WILL CREATE A KEY UNDER THE HASH MAP WITH {key}-root as the key and value of undefined
          hashMap.set(`${key}-root`, undefined)
        } else {
          // ELSE, THERE IS NO ROOT AND ONLY HAVE THE OTHER SUBKEYS AS SUBINDEX
          questionLeafs[key].forEach((subKey) => {
            hashMap.set(`${key}-${subKey}`, undefined)
          });
        }
      });

      // NEXT, WE LOOP THROUGH questionANSWER AND WE CHECK IF THE KEY EXISTS IN THE HASH MAP, if it does, we replace the value with that object
      questionAnswer.forEach((answer) => {
        if(hashMap.has(`${answer.questionIdx}-${answer.questionSubIdx}`)){
          hashMap.set(`${answer.questionIdx}-${answer.questionSubIdx}`, answer)
        }
      })
      
      // THEN LOOP THROUGH QUESTIONLEAFS AGAIN, THIS TIME, IF VALUE IS UNDEFINED, we create a value for it
      // IF IT IS NOT UNDEFINED, THEN WE PUSH IT IN
      Object.keys(questionLeafs).forEach((key) => {
        if (questionLeafs[key].length === 0) {
          // IF THE ARRAY UNDER THE KEY IS EMPTY, IT MEANS ITS questionSubIdx is root, a-root
          if(hashMap.get(`${key}-root`)){
            newQuestionAnswerValue.push(hashMap.get(`${key}-root`) as AddQuestionAnswerItem)
          }else{
            newQuestionAnswerValue.push({ questionIdx: key, questionSubIdx: "root", isText: true, answer: "", id: uuidv4() })
          }
        } else {
          // ELSE, THERE IS NO ROOT AND ONLY HAVE THE OTHER SUBKEYS AS SUBINDEX
          questionLeafs[key].forEach((subKey) => {
            if(hashMap.get(`${key}-${subKey}`)){
              newQuestionAnswerValue.push(hashMap.get(`${key}-${subKey}`) as AddQuestionAnswerItem)
            }else{
              newQuestionAnswerValue.push({ questionIdx: key, questionSubIdx: subKey, isText: true, answer: "", id: uuidv4() })
            }
          });
        }
      });

      return newQuestionAnswerValue;
    }
  }
}


// FOR PROCESSING questionAnswer into questionAnswerJSON
/**
 * For OEQ:
 * [
  * {
  *    questionIdx: string;
  *    questionSubIdx: string;
  *    answer: string;
  * }
 * ]
 * should be turned into
 * {
 *  questionIdx: {
 *   questionSubIdx: "answer"
 *  }
 * }
 * IF questionLeafs is NULL, then the only combination possible is root-root
 * 
 * For MCQ: 
 * [
 *  {
 *    options: []
 *    answer: []
 *  }
 * ]
 * 
 * Just extract out the one object for answer object. It will be corresponding displayed at 
 * the root of the question. 
 */

export function processMCQQuestionAnswerIntoJSON(questionAnswer: z.infer<typeof MCQAnswerSchema>){
  if(questionAnswer.length===0){
    return {options: [], answer: []}
  }
  return parseStringify(questionAnswer[0]) as {options: string[], answer: string[]}
}

export function processOEQQuestionAnswerIntoJSON(questionAnswer: z.infer<typeof OEQAnswerSchema>) {
  const processedQuestionAnswerJSON: ProcessedOEQQuestionAnswerJSON = {}
  
  questionAnswer.forEach((answer) => {
    if(!processedQuestionAnswerJSON[answer.questionIdx]){
      processedQuestionAnswerJSON[answer.questionIdx] = {}
    }
    processedQuestionAnswerJSON[answer.questionIdx][answer.questionSubIdx] = {
      answer: answer.answer,
      isText: answer.isText
    }
  })
  
  return processedQuestionAnswerJSON
}