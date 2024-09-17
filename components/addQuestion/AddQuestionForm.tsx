import { questionPartSchema } from "@/utils/addQuestionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import {
  MAX_QUESTION_PART_NUM,
  questionIndex,
  questionSubIndex,
} from "@/constants/constants";
import CustomAddQuestionTextArea from "./CustomAddQuestionTextArea";
import CustomAddQuestionFileInput from "./CustomAddQuestionFileInput";
import Image from "next/image";
import crossDeleteIcon from "@/assets/cross-delete-icon.svg";
import CustomAddQuestionSelect from "./CustomAddQuestionSelect";
import CustomAddQuestionInput from "./CustomAddQuestionInput";
import { useAddQuestionContext } from "@/hooks/useAddQuestionContext";

export default function AddQuestionForm() {

  const {updateFormData} = useAddQuestionContext()

  const form = useForm<z.infer<typeof questionPartSchema>>({
    resolver: zodResolver(questionPartSchema),
    defaultValues: {
      questionPart: [],
    },
  });
  // default value for images should be new File([], "")
  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questionPart",
  });

  useEffect(() => {
    const formSubscription = watch((formData) => {
      updateFormData(formData)
    })
  
    return () => {
      formSubscription.unsubscribe()
    }
  }, [watch])
  


  function addTextArea() {
    append({
      questionIdx: "",
      questionSubIdx: "",
      order: "",
      isText: true,
      text: "",
    });
  }
  function addImageInput() {
    append({
      questionIdx: "",
      questionSubIdx: "",
      order: "",
      isText: false,
      image: new File([], ""),
    });
  }
  function deleteQuestionPart(index: number) {
    remove(index);
  }

  function onSubmit(values: z.infer<typeof questionPartSchema>) {
    console.log(values);
  }

  return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full xl:w-10/12 space-y-3"
        >
          {fields.map((questionPart, index) => {
            const { isText } = questionPart;
            return (
              <div key={questionPart.id} className="flex flex-col flex-1 gap-1 w-full">
                <div className="flex gap-3">
                  {/* Insert selects here, they should all be in 1 row */}
                  <CustomAddQuestionSelect
                    control={form.control}
                    name={`questionPart.${index}.questionIdx`}
                    placeholder="index"
                    selectOptions={questionIndex}
                  />
                  <CustomAddQuestionSelect
                    control={form.control}
                    name={`questionPart.${index}.questionSubIdx`}
                    placeholder="sub-index"
                    selectOptions={questionSubIndex}
                  />
                  <CustomAddQuestionInput
                    control={form.control}
                    name={`questionPart.${index}.order`}
                    placeholder="order(1, 2, 3...)"
                  />
                </div>
                <div className="flex gap-2 items-center w-full">
                  {!isText ? (
                    <CustomAddQuestionFileInput
                      control={form.control}
                      name={`questionPart.${index}.image`}
                    />
                  ) : (
                    <CustomAddQuestionTextArea
                      control={form.control}
                      name={`questionPart.${index}.text`}
                      placeholder="Enter text here..."
                    />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteQuestionPart(index)}
                  >
                    <Image
                      src={crossDeleteIcon}
                      alt="delete icon"
                      width={10}
                      height={10}
                    />
                  </Button>
                </div>
              </div>
            );
          })}

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
          
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
  );
}
