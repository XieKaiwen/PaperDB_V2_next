import { questionPartSchema } from "@/utils/addQuestionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { MAX_QUESTION_PART_NUM } from "@/constants/constants";
import CustomAddQuestionTextArea from "./CustomAddQuestionTextArea";
import CustomAddQuestionFileInput from "./CustomAddQuestionFileInput";
import Image from "next/image";
import crossDeleteIcon from '@/assets/cross-delete-icon.svg';



export default function AddQuestionForm() {
  const [quesIdx, setQuesIdx] = useState(null);
  const [quesSubIdx, setQuesSubIdx] = useState(null);
  const form = useForm<z.infer<typeof questionPartSchema>>({
    resolver: zodResolver(questionPartSchema),
    defaultValues: {
      questionPart: [],
    },
  });
  // default value for images should be new File([], "")
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questionPart",
  });

  // Functions for appending another Text Part or Image Part

  function addTextArea() {
    append({
      questionIdx: quesIdx,
      questionSubIdx: quesSubIdx,
      isImage: false,
      text: "",
    });
  }
  function addImageInput() {
    append({
      questionIdx: quesIdx,
      questionSubIdx: quesSubIdx,
      isImage: true,
      image: new File([], ""),
    });
  }
  function deleteQuestionPart(index: number){
    remove(index)
  }

  function onSubmit(values: z.infer<typeof questionPartSchema>) {
    console.log(values);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full xl:w-10/12 space-y-3"
        >
          {fields.map((questionPart, index) => {
            const { questionIdx, questionSubIdx, isImage } = questionPart;
            const label = `${questionIdx ? questionIdx : "root"}-${
              questionSubIdx ? questionSubIdx : "null"
            }-${isImage ? "image" : "text"}`;

            return (
              <div key={`${label}-${index}`} className="flex gap-2 items-center w-full">
                {isImage ? (
                  <CustomAddQuestionFileInput
                    key={`${label}-${index}`}
                    control={form.control}
                    index={index}
                    label={label}
                  />
                ) : (
                  <CustomAddQuestionTextArea
                    key={`${label}-${index}`}
                    control={form.control}
                    index={index}
                    label={label}
                    placeholder="Enter text here..."
                  />
                )}
                <Button type="button" variant="destructive" size="sm" onClick={() => deleteQuestionPart(index)}>
                  <Image 
                    src={crossDeleteIcon}
                    alt="delete icon"
                    width={10}
                    height={10}
                  />
                </Button>
              </div>
            );
          })}

          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <div className="flex gap-4 w-full mt-2">
        <Button
          className="w-full"
          disabled={fields.length >= MAX_QUESTION_PART_NUM}
          type="button"
          onClick={addTextArea}
        >
          Add Text
        </Button>
        <Button
          className="w-full"
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
