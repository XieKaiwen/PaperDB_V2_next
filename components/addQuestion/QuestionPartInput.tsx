import { AddQuestionFormData, QuestionPartInputProps } from '@/types/types'
import React from 'react'
import { FieldValues, useFieldArray } from 'react-hook-form'
import CustomSelect from '../CustomSelect'
import { questionIndex, questionSubIndex } from '@/constants/constants'
import CustomInput from '../CustomInput'
import CustomFileInput from '../CustomFileInput'
import CustomTextArea from '../CustomTextArea'
import { Button } from '../ui/button'
import Image from 'next/image'
import crossDeleteIcon from '@/assets/cross-delete-icon.svg';

export default function QuestionPartInput<T extends FieldValues>({isText, control, id, index, deleteQuestionPart}: QuestionPartInputProps<T>) {
  
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
    )
}
