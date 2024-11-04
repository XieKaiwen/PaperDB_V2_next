import React from "react";
import CustomSelect from "../CustomSelect";
import { AddQuestionFormData, QuestionInfoInputProps } from "@/src/types/types";
import CustomComboBox from "../CustomComboBox";
import CustomPopoverMultipleCheckBox from "../CustomPopoverMultipleCheckbox";
import CustomInput from "../CustomInput";
import CustomRadio from "../CustomRadio";
import { FieldValues } from "react-hook-form";

export default function QuestionInfoInput<T extends FieldValues>({
  control,
  form,
  optionsDict,
  className,
}: QuestionInfoInputProps<T>) {
  const {
    educationLevelOptions,
    schoolOptions,
    subjectOptions,
    topicsOptions,
    yearOptions,
    questionTypeOptions,
    examTypeOptions,
  } = optionsDict;
  // TODO Change all placeholders to font-normal
  // TODO Make app responsive by changing comboboxes to Drawer component when below certain breakpoint
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

      <div className="flex flex-1 flex-wrap gap-3 justify-between ">
        <CustomComboBox<AddQuestionFormData>
          control={control}
          name="school"
          placeholder="School"
          commandPlaceholder="Search for school..."
          commandEmptyText="No schools found"
          options={schoolOptions || []}
          label="School"
          onSelectChange={form.setValue}
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
          onSelectChange={form.setValue}
          className=""
        />
      </div>
      {/* TODO make this a popover */}
      <div className="flex flex-1 flex-wrap gap-2 justify-between ">
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
      <div className="flex flex-1 flex-wrap gap-2 justify-center align-middle">
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
