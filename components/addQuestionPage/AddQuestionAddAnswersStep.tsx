import { useAddQuestionContext } from '@/src/hooks/useAddQuestionContext'
import { AddQuestionFormData, ProcessedQuestionContentCombinedJSON } from '@/src/types/types'
import { contentTypeSchema } from '@/utils/addQuestionUtils'
import React, { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { z } from 'zod'

export default function AddQuestionAddAnswersStep() {
    const {control, setValue, getValues} = useFormContext<AddQuestionFormData>()   
    const {formData: {subscribe: subscribeToFormData}, questionContentJSON:{subscribe: subscribeToQuestionContentJSON}} = useAddQuestionContext()
    const [questionContent, setQuestionContent] = useState<ProcessedQuestionContentCombinedJSON>({
        questionContent: {
          root: [],
          indexed: {},
        },
        questionLeafs: {},
    });
    const [formData, setFormData] = useState<AddQuestionFormData>({});

    // SUBSCRIBE TO UPDATES WHEN COMPONENT MOUNTS
    useEffect(() => {
        const unsubscribeToFormData = subscribeToFormData((updatedFormData) => {
          setFormData(updatedFormData);
        });

        const unsubscribeToQuestionContentJSON = subscribeToQuestionContentJSON((updatedQuestionContentJSON) => {
          setQuestionContent(updatedQuestionContentJSON);
        })
    
        return () =>{
            unsubscribeToFormData();
            unsubscribeToQuestionContentJSON();
        };
    }, [setFormData, setQuestionContent]);

    // DESTRUCTURE FORMDATA AND QUESTION CONTENT TO ONLY KEEP RELEVANT PARTS
    const {questionType} = formData
    const {questionLeafs} = questionContent


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
    const inputtedQuestionAnswer = getValues("questionAnswer")
    
      
    }, [questionType, questionLeafs])
    

  return (
    <div>AddQuestionAddAnswersStep</div>
  )
}
