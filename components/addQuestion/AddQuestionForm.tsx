import {
  questionPartSchema,
  validateTopicWithinEducationLevel,
} from "@/utils/addQuestionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import {
  educationLevelOptions,
  MAX_QUESTION_PART_NUM,
  questionTypeOptions,
  schoolTypeMapToEduLevel,
} from "@/constants/constants";
import { useAddQuestionContext } from "@/hooks/useAddQuestionContext";
import { AddQuestionFormData } from "@/types/types";
import QuestionPartInput from "./QuestionPartInput";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getAllSchools,
  getAllSubjects,
  getAllTopics,
} from "@/actions/queryData.actions";
import { generateOptionsFromJsonList, generateYearList } from "@/utils/utils";
import { edu_level } from "@prisma/client";
import { debounce } from "lodash";
import QuestionInfoInput from "./QuestionInfoInput";

// TODO: Add retrieving topics, school and subjects from database.
// TODO: Add form fields for: year, school, level, subject, checkbox for adding topics,question number, questionType

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

export default function AddQuestionForm() {
  // TODO: Fix! Prisma cannot run on client
  const {
    // isPending: isSubjectsPending,
    // isError: isSubjectsError,
    data: allSubjects,
    // error: subjectsError,
  } = useSuspenseQuery({
    queryKey: ["subjects"],
    queryFn: getAllSubjects,
  });

  const {
    // isPending: isTopicsPending,
    // isError: isTopicsError,
    data: allTopics,
    // error: topicsError,
  } = useSuspenseQuery({
    queryKey: ["topics"],
    queryFn: getAllTopics,
  });

  const {
    // isPending: isSchoolsPending,
    // isError: isSchoolsError,
    data: allSchools,
    // error: schoolsError,
  } = useSuspenseQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
  });

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

  const watchedEducationalLevel = watch("educationLevel");
  const watchedSubject = watch("subject");
  const watchedSchool = watch("school");
  const watchedTopics = watch("topics");
  const allFormData = useWatch({ control });
  // debounce the updateFormData function to avoid excessive re-renders, optimising performance
  const debounceUpdateFormData = useCallback(
    debounce((formData: AddQuestionFormData) => {
      updateFormData(formData);
    }, 500),
    [updateFormData]
  );

  // useEffect(() => {
  //   const formSubscription = watch((formData) => {
  //     updateFormData(formData);
  //   });

  //   return () => {
  //     formSubscription.unsubscribe();
  //   };
  // }, [watch]);

  // Changed to using useWatch for allFormData because unlike watch, useWatch waits for any rendering to end before updating the allFormData value, hence does not result in updating of state: formData in questionPreview if there is already a rendering happening

  useEffect(() => {
    debounceUpdateFormData(allFormData);

    return () => debounceUpdateFormData.cancel();
  }, [allFormData, debounceUpdateFormData]);

  const subjectOptions: { value: string; label: string }[] = useMemo(() => {
    if (watchedEducationalLevel) {
      const filteredSubjects = allSubjects.filter((subject) =>
        subject.educationLevels.includes(watchedEducationalLevel as edu_level)
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
  }, [allSubjects, watchedEducationalLevel]);

  const schoolOptions: { value: string; label: string }[] = useMemo(() => {
    if (watchedEducationalLevel) {
      const filteredSchools = allSchools.filter((school) =>
        schoolTypeMapToEduLevel[school.schoolType].includes(
          watchedEducationalLevel
        )
      );
      const optionList = generateOptionsFromJsonList(
        filteredSchools,
        "id",
        "schoolFullName"
      );
      optionList.sort((a, b) => a.label.localeCompare(b.label));
      return optionList;
    }
    return [];
  }, [allSchools, watchedEducationalLevel]);

  const topicsOptions: { value: string; label: string }[] = useMemo(() => {
    if (!watchedSubject) {
      return [];
    }
    // const listOfSubjectIds = subjectOptions.map((subject) => subject.value)
    const filteredTopics = allTopics.filter((topic) => {
      return (
        topic.subjectId === watchedSubject &&
        validateTopicWithinEducationLevel(
          topic.educationLevel,
          watchedEducationalLevel
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
  }, [allTopics, subjectOptions, watchedSubject]);

  const yearOptions = useMemo(() => {
    return generateYearList();
  }, []);
  // Moving the resetting of fields to useEffect instead of using them in useMemo because, using them in useMemo will cause an update in Controller while causing a re-render of the form as well, which is illegal

  useEffect(() => {
    if (!subjectOptions.find((subject) => watchedSubject === subject.value))
      form.resetField("subject");
  }, [subjectOptions]);

  useEffect(() => {
    if (!schoolOptions.find((school) => watchedSchool === school.value))
      form.resetField("school");
  }, [schoolOptions]);

  useEffect(() => {
    watchedTopics.every((topic) => {
      if (!topicsOptions.find((option) => option.value === topic)) {
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
    };
  }, [
    educationLevelOptions,
    schoolOptions,
    subjectOptions,
    topicsOptions,
    yearOptions,
    questionTypeOptions,
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

  function onSubmit(values: z.infer<typeof questionPartSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full xl:w-10/12 space-y-7"
      >
        <QuestionInfoInput<AddQuestionFormData>
          optionsDict={optionsDict}
          control={control}
          form={form}
          className="space-y-3"
        />
        {/* TODO Refactor the questionPart input */}
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

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
