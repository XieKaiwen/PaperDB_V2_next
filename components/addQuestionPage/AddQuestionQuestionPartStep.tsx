import { AddQuestionFormData } from "@/src/types/types";
import { contentTypeSchema } from "@/utils/addQuestionUtils";
import React, { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import QuestionPartInput from "./QuestionPartInput";
import { Button } from "../ui/button";
import { MAX_QUESTION_PART_NUM } from "@/src/constants/constants";
export default function AddQuestionQuestionPartStep() {
  // INITIATE FIELDS ARRAY
  const { control } = useFormContext<AddQuestionFormData>();
  const { fields, append, remove } = useFieldArray<AddQuestionFormData>({
    control,
    name: "questionPart",
  });
  const addTextArea = useCallback(() => {
    append({
      questionIdx: "",
      questionSubIdx: "",
      order: "0",
      isText: true,
      text: "",
      id: uuidv4(),
    });
  }, [append]);

  const addImageInput = useCallback(() => {
    append({
      questionIdx: "",
      questionSubIdx: "",
      order: "0",
      isText: false,
      image: new File([], ""),
      id: uuidv4(),
    });
  }, [append]);
  const deleteQuestionPart = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  return (
    <>
      {fields.map(
        (questionPart: z.infer<typeof contentTypeSchema>, index: number) => {
          const { isText } = questionPart;
          return (
            <QuestionPartInput
              key={questionPart.id}
              isText={isText}
              control={control}
              id={questionPart.id}
              index={index}
              deleteQuestionPart={deleteQuestionPart}
            />
          );
        }
      )}
      <div className="flex gap-4 w-full mt-2">
        <Button
          className="w-full  bg-lavender-300 hover:bg-lavender-400 text-gray-700"
          disabled={fields.length >= MAX_QUESTION_PART_NUM}
          type="button"
          onClick={addTextArea}
        >
          Add Text
        </Button>
        <Button
          className="w-full  bg-lavender-300 hover:bg-lavender-400 text-gray-700"
          disabled={fields.length >= MAX_QUESTION_PART_NUM}
          type="button"
          onClick={addImageInput}
        >
          Add Image
        </Button>
      </div>
    </>
  );
}
