import { useAddQuestionContext } from "@/src/hooks/useAddQuestionContext";
import {
  AddQuestionFormData,
  ProcessedQuestionContentCombinedJSON,
} from "@/src/types/types";
import {
  contentTypeSchema,
  createQuestionAnswerValueAfterReset,
  createQuestionAnswerValueWithoutReset,
  OEQAnswerSchema,
  questionAnswerRequiresReset,
} from "@/utils/addQuestionUtils";
import React, { use, useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { answerCombinedSchema } from "../../utils/addQuestionUtils";
import CustomTextArea from "../form-components/CustomTextArea";

export default function AddQuestionAddAnswersStep() {
  const { control, setValue, resetField } =
    useFormContext<AddQuestionFormData>();
  const {
    questionContentJSON: {
      subscribe: subscribeToQuestionContentJSON,
      retrieve: retrieveQuestionContentJSON,
    },
  } = useAddQuestionContext();
  const [questionContent, setQuestionContent] = useState<
    ProcessedQuestionContentCombinedJSON | undefined
  >(undefined);
  // const [formData, setFormData] = useState<AddQuestionFormData>(undefined);

  const [watchedQuestionAnswer, watchedQuestionType] = useWatch({
    control,
    name: ["questionAnswer", "questionType"],
  }) as [z.infer<typeof answerCombinedSchema>, string];

  // RETRIEVE THE FORM DATA AND QUESTION CONTENT FROM CONTEXT WHEN MOUNT
  useEffect(() => {
    // setFormData(retrieveFormData());
    setQuestionContent(retrieveQuestionContentJSON());
    // console.log("called retrieveQuestionContentJSON on AddQuestionAddAnswersStep mount");
  }, []);

  // SUBSCRIBE TO UPDATES WHEN COMPONENT MOUNTS
  useEffect(() => {
    // const unsubscribeToFormData = subscribeToFormData((updatedFormData) => {
    //   setFormData(updatedFormData);
    // });

    const unsubscribeToQuestionContentJSON = subscribeToQuestionContentJSON(
      (updatedQuestionContentJSON) => {
        setQuestionContent(updatedQuestionContentJSON);
        // console.log("Receive updatedQuestionContentJSON in AddQuestionAddAnswersStep");
      }
    );

    return () => {
      unsubscribeToQuestionContentJSON();
    };
  }, [setQuestionContent]);

  const questionLeafs = questionContent?.questionLeafs;
  console.log("questionContent:" + JSON.stringify(questionContent, null, 2));

  useEffect(() => {
    // In this useEffect, we will track the questionType and questionPart through context.
    // Whenever it changes, we will alter the value in questionAnswer
    // If chosenQuestionType is MCQ:
    // 1. Check if value in questionAnswer is an object, if it isnt, make it an object with option and answer
    /**
     * If chosenQuestionType is OEQ:
     * 1. Check if value in questionAnswer is an array, if it isnt, make it an array and then perform the following steps
     * 2. Go through the questionLeafs and create the relevant objects in the array with the corresponding questionIdx and questionSubIdx
     * 3. If it is an array, first filter through the current array and see if there is any objects to reuse, filter out the ones not useful and add in appropriate objects.
     * 4. Then setValue on the questionAnswer field.
     */
    //  TODO: TO BE TESTED
    if (!questionContent) {
      return;
    }

    const requireReset = questionAnswerRequiresReset(
      watchedQuestionType,
      watchedQuestionAnswer
    );
    if (requireReset) {
      resetField("questionAnswer", { defaultValue: [] });
      const newQuestionAnswerValue = createQuestionAnswerValueAfterReset(
        watchedQuestionType,
        questionLeafs!
      );
      setValue("questionAnswer", newQuestionAnswerValue);
    } else {
      const newQuestionAnswerValue = createQuestionAnswerValueWithoutReset(
        watchedQuestionType,
        questionLeafs!,
        watchedQuestionAnswer
      );
      setValue("questionAnswer", newQuestionAnswerValue);
    }
    // console.log("Call useEffect for updating questionAnswer");
  }, [watchedQuestionType, questionLeafs]);
  // console.log("questionAnswer:" + JSON.stringify(watchedQuestionAnswer, null, 2));

  // USE useFieldArray to render the questionAnswer INPUTS
  // NO NEED FOR append and remove, BECAUSE USER DOES NOT NEED TO ADD OR REMOVE ANSWERS
  const { fields } = useFieldArray<AddQuestionFormData>({
    control,
    name: "questionAnswer",
  }) as { fields: z.infer<typeof OEQAnswerSchema> };

  // TODO: Use useFieldArray to append and remove options

  return (
    // <pre>{JSON.stringify(watchedQuestionAnswer, null, 2)}</pre>
    <>
      {watchedQuestionType === "OEQ" && (
        <div className="w-full space-y-3">
          {fields.map((answerPart, index) => {
            const { questionIdx, questionSubIdx, answer } = answerPart;
            return (
              <CustomTextArea<AddQuestionFormData>
                key={answerPart.id}
                control={control}
                name={`questionAnswer.${index}.answer`}
                label={`Answer for (${questionIdx})(${questionSubIdx})`}
                placeholder="Enter the answer..."
              />
            );
          })}
        </div>
      )}
    </>
  );
}
