import {
  questionPartSchema,
  validateTopicWithinEducationLevel,
} from "@/utils/addQuestionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import {
  educationLevelOptions,
  examTypeEducationLevelMapping,
  MAX_QUESTION_PART_NUM,
  MD_BREAKPOINT,
  questionTypeOptions,
  schoolTypeMapToEduLevel,
} from "@/src/constants/constants";
import { useAddQuestionContext } from "@/src/hooks/useAddQuestionContext";
import { AddQuestionFormData } from "@/src/types/types";
import QuestionPartInput from "./QuestionPartInput";
import { generateOptionsFromJsonList, generateYearList } from "@/utils/utils";
import { edu_level, school_type } from "@prisma/client";
import { debounce } from "lodash";
import QuestionInfoInput from "./QuestionInfoInput";
import { Oval } from "react-loader-spinner";

// Custom Components have been created for the following:
// Select component with autocomplete (ComboBox) should be used for school, year and subject
// Text component to be used for question number, number validation has to be done for question number
// Radio group should be used for question type: MCQ or OEQ

/**
 * Some guidelines on the availability of options for certain fields:
 * 1. educationLevel decides the options for: school and subject, directly.
 * 2. subject decides the options for: topics, directly.
 * 3. Hence, the order for filtering of form options on change for form data will be: Checking education level -> school/subject -> topic. We are to filter according to this order.
 * 4. If option currently selected for school/subject is not appropriate for the new education level, then formfield for school/subject will be reset. But no matter what, with a change in education level, the options for school/subject will be updated.
 * 5. If option currently selected for topic is not appropriate for the new subject, then formfield for topic will be reset.
 */
// TODO: Change questionNumber to a select component, with default of 0
// TODO: Optimise the form and reduce latency, right now it is horrendously optimised HAHAHHAHAH

export default function AddQuestionForm() {
  // RETRIEVE CONTEXT VALUES
  const { formData: {update : debounceUpdateFormData}, data: {subjects: allSubjects, topics: allTopics, schools: allSchools} } = useAddQuestionContext();

  // Handle change in breakpoints, affects the labels in school select field
  const [isWindowSizeBelowBreakpoint, setIsWindowSizeBelowBreakpoint] =
    useState(false);
  const debouncedSetIsWindowSizeBelowBreakpoint = useCallback(
    debounce(() => {
      setIsWindowSizeBelowBreakpoint(window.innerWidth < MD_BREAKPOINT);
    }, 300),
    [setIsWindowSizeBelowBreakpoint]
  );

  useEffect(() => {
    debouncedSetIsWindowSizeBelowBreakpoint();
    window.addEventListener("resize", debouncedSetIsWindowSizeBelowBreakpoint);

    return () => {
      window.removeEventListener(
        "resize",
        debouncedSetIsWindowSizeBelowBreakpoint
      );
      debouncedSetIsWindowSizeBelowBreakpoint.cancel();
    };
  }, [debouncedSetIsWindowSizeBelowBreakpoint]);



  // SET UP FORM AND WATCHED VALUES
  const form = useForm<z.infer<typeof questionPartSchema>>({
    resolver: zodResolver(questionPartSchema),
    defaultValues: {
      year: "",
      educationLevel: "",
      school: "",
      subject: "",
      topics: [],
      examType: undefined,
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
  const { isSubmitting } = useFormState({ control });

  const watchedFormValues = watch();
  const {year, educationLevel, school, subject, topics, examType, questionType, questionNumber, questionPart} = watchedFormValues
  
  useEffect(() => {
    debounceUpdateFormData(watchedFormValues);
  }, [watchedFormValues]);

  const subjectOptions: { value: string; label: string }[] = useMemo(() => {
    if (educationLevel) {
      const filteredSubjects = allSubjects.filter((subject) =>
        subject.educationLevels.includes(educationLevel as edu_level)
      );

      const optionList = generateOptionsFromJsonList(
        filteredSubjects,
        "id",
        "subjectName"
      );
      optionList.sort((a, b) => a.label.localeCompare(b.label));
      return optionList;
    }
    return [];
  }, [allSubjects, educationLevel]);

  // TODO: Need to improve short name for schools, too confusing. For example:
  // Rosyth School and Red Swastika School are RS and RSS respectively. Very easily confused
  const schoolOptions: { value: string; label: string }[] = useMemo(() => {
    if (educationLevel) {
      const filteredSchools = allSchools.filter((school) =>
        schoolTypeMapToEduLevel[school.schoolType].includes(
          educationLevel
        )
      );
      const optionList = generateOptionsFromJsonList(
        filteredSchools,
        "id",
        isWindowSizeBelowBreakpoint ? "schoolShortName" : "schoolFullName"
      );
      optionList.sort((a, b) => a.label.localeCompare(b.label));
      return optionList;
    }
    return [];
  }, [allSchools, educationLevel, isWindowSizeBelowBreakpoint]);

  const topicsOptions: { value: string; label: string }[] = useMemo(() => {
    if (!subject) {
      return [];
    }
    // const listOfSubjectIds = subjectOptions.map((subject) => subject.value)
    const filteredTopics = allTopics.filter((topic) => {
      return (
        topic.subjectId === subject &&
        validateTopicWithinEducationLevel(
          topic.educationLevel,
          educationLevel
        )
      );
    });

    const optionList = generateOptionsFromJsonList(
      filteredTopics,
      "id",
      "topicName"
    );
    optionList.sort((a, b) => a.label.localeCompare(b.label));
    return optionList;
  }, [allTopics, subjectOptions, subject]);

  const yearOptions = useMemo(() => {
    return generateYearList();
  }, []);
  const examTypeOptions = useMemo(() => {
    if(!educationLevel) return []
    const filteredExamTypes = examTypeEducationLevelMapping.filter((examType) => examType.educationLevel.includes(educationLevel as edu_level))
    return generateOptionsFromJsonList(filteredExamTypes, "enumValue", "examType")
  }, [educationLevel])
  // Moving the resetting of fields to useEffect instead of using them in useMemo because, using them in useMemo will cause an update in Controller while causing a re-render of the form as well, which is illegal

  useEffect(() => {
    if (!subjectOptions.find((subjectOption) => subject === subjectOption.value))
      form.resetField("subject");
  }, [subjectOptions]);
  useEffect(() => {
    if (!schoolOptions.find((schoolOption) => school === schoolOption.value))
      form.resetField("school");
  }, [schoolOptions]);
  useEffect(() => {
    topics.every((topic) => {
      if (!topicsOptions.find((topicOption) => topicOption.value === topic)) {
        form.resetField("topics");
        return false;
      }
      return true;
    });
  }, [topicsOptions]);

  const optionsDict = useMemo(() => {
    return {
      educationLevelOptions,
      schoolOptions,
      subjectOptions,
      topicsOptions,
      yearOptions,
      questionTypeOptions,
      examTypeOptions
    };
  }, [
    educationLevelOptions,
    schoolOptions,
    subjectOptions,
    topicsOptions,
    yearOptions,
    questionTypeOptions,
    examTypeOptions
  ]);

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

  async function onSubmit(values: z.infer<typeof questionPartSchema>) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-2 w-full space-y-7"
      >
        <QuestionInfoInput<AddQuestionFormData>
          optionsDict={optionsDict}
          control={control}
          form={form}
          className="space-y-4"
        />
        {fields.map((questionPart, index) => {
          const { isText } = questionPart;
          return (
            <QuestionPartInput<AddQuestionFormData>
              key={questionPart.id}
              isText={isText}
              control={control}
              id={questionPart.id}
              index={index}
              deleteQuestionPart={deleteQuestionPart}
            />
          );
        })}
        <div className="space-y-2">
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex gap-4">
                <p>Loading</p>
                <Oval
                  visible={true}
                  height="20"
                  width="20"
                  color="#a3c4ff"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
