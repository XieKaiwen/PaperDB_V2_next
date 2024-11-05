import { AddQuestionFormData, QuestionPartInputProps } from "@/src/types/types";
import React, { useCallback } from "react";
import { FieldValues, useFieldArray } from "react-hook-form";
import CustomSelect from "../CustomSelect";
import { questionIndex, questionSubIndex } from "@/src/constants/constants";
import CustomInput from "../CustomInput";
import CustomFileInput from "../CustomFileInput";
import CustomTextArea from "../CustomTextArea";
import { Button } from "../ui/button";
import Image from "next/image";
import crossDeleteIcon from "@/src/assets/cross-delete-icon.svg";

const QuestionInfoInput = React.memo(
  function QuestionPartInput<T extends FieldValues>({
    isText,
    control,
    id,
    index,
    deleteQuestionPart,
  }: QuestionPartInputProps<T>) {
    // Memoize the delete handler
    const handleDelete = useCallback(() => {
      deleteQuestionPart(index);
    }, [deleteQuestionPart, index]);

    return (
      <div key={id} className="flex gap-2 items-center">
        <div className="flex flex-col flex-1 gap-1 w-full">
          <div className="flex gap-3 w-full">
            {/* Insert selects here, they should all be in 1 row */}
            <CustomSelect<AddQuestionFormData>
              control={control}
              name={`questionPart.${index}.questionIdx`}
              placeholder="index"
              selectOptions={questionIndex}
              className="flex-1"
            />
            <CustomSelect<AddQuestionFormData>
              control={control}
              name={`questionPart.${index}.questionSubIdx`}
              placeholder="sub-index"
              selectOptions={questionSubIndex}
              className="flex-1"
            />
            <CustomInput<AddQuestionFormData>
              control={control}
              name={`questionPart.${index}.order`}
              placeholder="order(1, 2, 3...)"
              className="flex-1"
            />
          </div>
          <div className="w-full">
            {!isText ? (
              <CustomFileInput<AddQuestionFormData>
                control={control}
                name={`questionPart.${index}.image`}
              />
            ) : (
              <CustomTextArea<AddQuestionFormData>
                control={control}
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
          onClick={handleDelete}
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
  },
  (prevProps, nextProps) => {
    // Only re-render if any of these props changed
    return (
      prevProps.isText === nextProps.isText &&
      prevProps.index === nextProps.index &&
      prevProps.id === nextProps.id &&
      prevProps.control === nextProps.control
    );
  }
) as <T>(props: T) => JSX.Element;

export default QuestionInfoInput;
