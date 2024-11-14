import { useAddQuestionContext } from "@/src/hooks/useAddQuestionContext";
import {
  AddQuestionFormData,
  ProcessedQuestionContentCombinedJSON,
} from "@/src/types/types";
import {
  createQuestionAnswerValueAfterReset,
  createQuestionAnswerValueWithoutReset,
  OEQAnswerSchema,
  questionAnswerRequiresReset,
} from "@/utils/addQuestionUtils";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { answerCombinedSchema } from "../../utils/addQuestionUtils";
import CustomTextArea from "../form-components/CustomTextArea";
import CustomFileInput from "../form-components/CustomFileInput";
import { Switch } from "@/components/ui/switch";

export default function AddQuestionAddAnswersStep() {
  const { control, setValue, resetField, getValues } =
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
  const { fields, update  } = useFieldArray<AddQuestionFormData>({
    control,
    name: "questionAnswer",
  });

  function toggleFileClick(index: number) {
    const answerItem = getValues(`questionAnswer.${index}`);
  
    // Create a new object to avoid mutating the existing answerItem
    const updatedAnswerItem = {
      ...answerItem,
      isText: !answerItem.isText,
      answer: answerItem.isText ? new File([], "") : "", // Toggle between File and string
    };
  
    // Use the update function from useFieldArray to ensure sync
    update(index, updatedAnswerItem);
  }

  // TODO: Use useFieldArray to append and remove options for MCQ

  return (
    // <pre>{JSON.stringify(watchedQuestionAnswer, null, 2)}</pre>
    <>
      {watchedQuestionType === "MCQ" && (
        <div>{JSON.stringify(watchedQuestionAnswer, null, 2)}</div>
      )}

      {watchedQuestionType === "OEQ" && (
        <div className="w-full space-y-3">
          {fields.map((answerPart, index) => {
            const { questionIdx, questionSubIdx, isText, answer } = answerPart;
            return (
              <div key={answerPart.id}>
                {isText ? (
                  <CustomTextArea<AddQuestionFormData>
                    control={control}
                    name={`questionAnswer.${index}.answer`}
                    label={`Answer for (${questionIdx})(${questionSubIdx})`}
                    placeholder="Enter the answer..."
                    
                  />
                ) : (
                  <CustomFileInput<AddQuestionFormData>
                    control={control}
                    name={`questionAnswer.${index}.answer`}
                    label={`Answer for (${questionIdx})(${questionSubIdx})`}
                    key={answerPart.id}
                  />
                )}
                <div className="flex gap-2 mt-3">
                  Toggle File:
                  <Switch
                      checked={!isText}
                      onCheckedChange={() => toggleFileClick(index)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
