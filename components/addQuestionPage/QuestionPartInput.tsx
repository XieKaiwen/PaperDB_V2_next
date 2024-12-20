import { AddQuestionFormData, QuestionPartInputProps } from '@/src/types/types';
import React, { useCallback, useEffect } from 'react';
import { FieldValues, useFormContext, useWatch } from 'react-hook-form';
import CustomSelect from '../form-components/CustomSelect';
import { questionIndex, questionSubIndex } from '@/src/constants/constants';
import CustomInput from '@/components/form-components/CustomInput';
import CustomFileInput from '@/components/form-components/CustomFileInput';
import CustomTextArea from '@/components/form-components/CustomTextArea';
import { Button } from '../ui/button';
import Image from 'next/image';
import crossDeleteIcon from '@/src/assets/cross-delete-icon.svg';
export default function QuestionPartInput<T extends FieldValues>({
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

  const { setValue } = useFormContext();
  // Watch only the `questionIdx` field for this specific index and trigger the callback when it changes
  const chosenQuestionIndex = useWatch({ control, name: `questionPart.${index}.questionIdx` });
  const filteredQuestionSubIndexOptions =
    chosenQuestionIndex === 'root' ? [{ value: 'root', label: '-' }] : [...questionSubIndex];

  // // Use useEffect to handle `setValue` when `chosenQuestionIndex` changes
  useEffect(() => {
    if (chosenQuestionIndex === 'root') {
      // Modify the options array and set the sub-index field only when "root" is chosen
      setValue(`questionPart.${index}.questionSubIdx`, 'root');
    }
  }, [chosenQuestionIndex, index, setValue]);

  return (
    <div key={id} className="flex items-center gap-2">
      <div className="flex w-full flex-1 flex-col gap-1">
        <div className="flex w-full gap-3">
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
            selectOptions={filteredQuestionSubIndexOptions}
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
      <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
        <Image src={crossDeleteIcon} alt="delete icon" width={10} height={10} />
      </Button>
    </div>
  );
}
