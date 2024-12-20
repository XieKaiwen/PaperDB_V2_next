import { AddQuestionFormData } from '@/src/types/types';
import { contentTypeSchema } from '@/utils/add-question/addQuestionUtils(client)';
import React, { ReactElement, useCallback } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import QuestionPartInput from './QuestionPartInput';
import { Button } from '../ui/button';
import { MAX_QUESTION_PART_NUM } from '@/src/constants/constants';
import { FormField, FormMessage } from '../ui/form';
export default function AddQuestionQuestionPartStep() {
  // INITIATE FIELDS ARRAY
  const { control, getValues } = useFormContext<AddQuestionFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questionPart',
  });
  const questionType = useWatch({
    control,
    name: 'questionType',
  });

  const addTextArea = useCallback(() => {
    const currentFields = getValues('questionPart');
    currentFields.length === 0
      ? append({
          questionIdx: 'root',
          questionSubIdx: 'root',
          order: '0',
          isText: true,
          text: '',
          id: uuidv4(),
        })
      : append({
          questionIdx: currentFields[currentFields.length - 1].questionIdx,
          questionSubIdx: currentFields[currentFields.length - 1].questionSubIdx,
          order: '0',
          isText: true,
          text: '',
          id: uuidv4(),
        });
  }, [getValues, append]);

  const addImageInput = useCallback(() => {
    const currentFields = getValues('questionPart');
    currentFields.length === 0
      ? append({
          questionIdx: 'root',
          questionSubIdx: 'root',
          order: '0',
          isText: false,
          image: new File([], ''),
          id: uuidv4(),
        })
      : append({
          questionIdx: currentFields[currentFields.length - 1].questionIdx,
          questionSubIdx: currentFields[currentFields.length - 1].questionSubIdx,
          order: '0',
          isText: false,
          image: new File([], ''),
          id: uuidv4(),
        });
  }, [getValues, append]);
  const deleteQuestionPart = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  return (
    <>
      {(fields as z.infer<typeof contentTypeSchema>[]).map(
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
        },
      )}
      <FormField
        control={control}
        name="questionPart"
        render={({ fieldState }): ReactElement => {
          // Only render if fieldState exists and has an error
          if (!fieldState?.error?.message) {
            return <></>;
          }

          return <FormMessage>{fieldState.error.message}</FormMessage>;
        }}
      />
      <div className="mt-2 flex w-full gap-4">
        <Button
          className="w-full bg-lavender-300 text-gray-700 hover:bg-lavender-400"
          disabled={fields.length >= MAX_QUESTION_PART_NUM}
          type="button"
          onClick={addTextArea}
        >
          Add Text
        </Button>
        <Button
          className="w-full bg-lavender-300 text-gray-700 hover:bg-lavender-400"
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
