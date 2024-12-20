import React from 'react';
import CustomSelect from '../form-components/CustomSelect';
import { AddQuestionFormData, QuestionInfoInputProps } from '@/src/types/types';
import CustomComboBox from '@/components/form-components/CustomComboBox';
import CustomPopoverMultipleCheckBox from '@/components/form-components/CustomPopoverMultipleCheckbox';
import CustomInput from '@/components/form-components/CustomInput';
import CustomRadio from '@/components/form-components/CustomRadio';
import { useFormContext } from 'react-hook-form';

export default function QuestionInfoInput({ optionsDict, className }: QuestionInfoInputProps) {
  const {
    educationLevelOptions,
    schoolOptions,
    subjectOptions,
    topicsOptions,
    yearOptions,
    questionTypeOptions,
    examTypeOptions,
  } = optionsDict;

  const { control, setValue } = useFormContext<AddQuestionFormData>();

  return (
    <div className={className}>
      <CustomSelect<AddQuestionFormData>
        control={control}
        name="educationLevel"
        placeholder="Level of Education"
        selectOptions={educationLevelOptions}
        label="Education Level"
        className="flex-1 font-medium"
      />

      <div className="flex flex-1 flex-wrap justify-between gap-3">
        <CustomComboBox<AddQuestionFormData>
          control={control}
          name="school"
          placeholder="School"
          commandPlaceholder="Search for school..."
          commandEmptyText="No schools found"
          options={schoolOptions || []}
          label="School"
          onSelectChange={setValue}
          className=""
        />
        <CustomComboBox<AddQuestionFormData>
          control={control}
          name="subject"
          placeholder="Subject"
          commandPlaceholder="Search for subject..."
          commandEmptyText="No subjects found"
          options={subjectOptions || []}
          label="Subject"
          onSelectChange={setValue}
          className=""
        />
      </div>
      <div className="flex flex-1 flex-wrap justify-between gap-2">
        <CustomPopoverMultipleCheckBox<AddQuestionFormData>
          control={control}
          name="topics"
          options={topicsOptions || []}
          triggerText="Select topics..."
          emptyPopoverText="No topics found (Check if level and subjects are chosen)"
          label="Topics"
        />
        <CustomInput<AddQuestionFormData>
          control={control}
          name="questionNumber"
          placeholder="Enter number..."
          label="Question No."
          className="flex-1"
        />
      </div>
      <div className="flex flex-1 flex-wrap justify-center gap-2 align-middle">
        <CustomSelect<AddQuestionFormData>
          control={control}
          name="year"
          placeholder="Select year..."
          selectOptions={yearOptions || []}
          label="Year"
          className="flex-1"
        />
        <CustomSelect<AddQuestionFormData>
          control={control}
          name="examType"
          placeholder="Select exam type..."
          selectOptions={examTypeOptions || []}
          label="Exam Type"
          emptySelectText="Select education level first"
          className="flex-1 font-medium"
        />
      </div>
      <CustomRadio<AddQuestionFormData>
        control={control}
        name="questionType"
        options={questionTypeOptions || []}
        label="Question Type"
        radioClassName="flex-row space-y-0 gap-5"
      />
    </div>
  );
}
