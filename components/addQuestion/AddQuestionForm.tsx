import { questionPartSchema } from "@/utils/addQuestionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {  useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import {
  MAX_QUESTION_PART_NUM,
  questionIndex,
  questionSubIndex,
} from "@/constants/constants";
import Image from "next/image";
import crossDeleteIcon from "@/assets/cross-delete-icon.svg";
import { useAddQuestionContext } from "@/hooks/useAddQuestionContext";
import { AddQuestionFormData } from "@/types/types";
import CustomInput from "../CustomInput";
import CustomFileInput from "../CustomFileInput";
import CustomTextArea from "../CustomTextArea";
import CustomSelect from "../CustomSelect";

// TODO: Add retrieving topics, school and subjects from database.
// TODO: Add form fields for: year, school, level, subject, checkbox for adding topics,question number, questionType

// Custom Components have been created for the following:
// Select component with autocomplete (ComboBox) should be used for school, year and subject
// Text component to be used for question number, number validation has to be done for question number
// Radio group should be used for question type: MCQ or OEQ

// TODO: Refining the form to restrict choice of sub-index to be only be "-" if index is root. Also limit the choices of the topics after choosing the subjects, similarly for subjects after choosing educationalLevel.
// To be done through constantly updating the disabled state of checkboxes and filtering options depending on the other fields (e.g. filtering topics based on subject, filtering subjects based on educationalLevel)...

// TODO: Refactoring the questionParts input area (including delete button)


/**
 * Some guidelines on the availability of options for certain fields:
 * 1. educationLevel decides the options for: school and subject, directly.
 * 2. subject decides the options for: topics, directly. 
 * 3. Hence, the order for filtering of form options on change for form data will be: Checking education level -> school/subject -> topic. We are to filter according to this order. 
 * 4. If option currently selected for school/subject is not appropriate for the new education level, then formfield for school/subject will be reset. But no matter what, with a change in education level, the options for school/subject will be updated.
 * 5. If option currently selected for topic is not appropriate for the new subject, then formfield for topic will be reset.
*/

export default function AddQuestionForm() {
  const { updateFormData } = useAddQuestionContext();

  const form = useForm<z.infer<typeof questionPartSchema>>({
    resolver: zodResolver(questionPartSchema),
    defaultValues: {
      year: "",
      educationLevel: "",
      school: "",
      subject: "",
      topics: [],
      questionType: "",
      questionNumber: "",
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
      updateFormData(formData);
    });

    return () => {
      formSubscription.unsubscribe();
    };
  }, [watch]);

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
        
        {/* TODO Refactor the questionPart input */}
        {fields.map((questionPart, index) => {
          const { isText } = questionPart;
          return (
            <div key={questionPart.id} className="flex gap-2 items-center">
              <div className="flex flex-col flex-1 gap-1 w-full">
                <div className="flex gap-3 w-full">
                  {/* Insert selects here, they should all be in 1 row */}
                  <CustomSelect<AddQuestionFormData>
                    control={form.control}
                    name={`questionPart.${index}.questionIdx`}
                    placeholder="index"
                    selectOptions={questionIndex}
                    className="flex-1"
                  />
                  <CustomSelect<AddQuestionFormData>
                    control={form.control}
                    name={`questionPart.${index}.questionSubIdx`}
                    placeholder="sub-index"
                    selectOptions={questionSubIndex}
                    className="flex-1"
                  />
                  <CustomInput<AddQuestionFormData>
                    control={form.control}
                    name={`questionPart.${index}.order`}
                    placeholder="order(1, 2, 3...)"
                    className="flex-1"
                  />
                </div>
                <div className="w-full">
                  {!isText ? (
                    <CustomFileInput<AddQuestionFormData>
                      control={form.control}
                      name={`questionPart.${index}.image`}
                    />
                  ) : (
                    <CustomTextArea<AddQuestionFormData>
                      control={form.control}
                      name={`questionPart.${index}.text`}
                      placeholder="Enter text here..."
                      className="flex-1"
                    />
                  )}
                </div>
              </div>
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

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
