import {
  educationLevelOptions,
  examTypeEducationLevelMapping,
  questionTypeOptions,
  schoolTypeMapToEduLevel,
} from "@/src/constants/constants";
import { useAddQuestionContext } from "@/src/hooks/useAddQuestionContext";
import { validateTopicWithinEducationLevel } from "@/utils/addQuestionUtils";
import { generateOptionsFromJsonList, generateYearList } from "@/utils/utils";
import { edu_level, exam_type } from "@prisma/client";
import React, { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import QuestionInfoInput from "./QuestionInfoInput";
import { AddQuestionFormData } from "@/src/types/types";
/**
 *
 * @returns the first step of the add question page
 * Includes:
 * - year, educationLevel, school, subject, topics, examType, questionType, questionNumber
 * Basically all the paper metadata will be saved here
 */
export default function AddQuestionPaperMetadataStep() {
  const {
    data: { subjects: allSubjects, topics: allTopics, schools: allSchools },
  } = useAddQuestionContext();
  const { control, resetField } = useFormContext<AddQuestionFormData>();

  // Watch educationLevel, subject and topics
  const watchedValues = useWatch({
    control,
    name: ["educationLevel", "school", "subject", "topics", "examType"], // Fields to watch
  });

  const [educationLevel, school, subject, topics, examType] = watchedValues as [
    edu_level,
    string,
    string,
    string[],
    exam_type
  ];

  // FUNCTIONS FOR FILTERING FORM OPTIONS
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
        schoolTypeMapToEduLevel[school.schoolType].includes(educationLevel)
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
  }, [allSchools, educationLevel]);

  const topicsOptions: { value: string; label: string }[] = useMemo(() => {
    if (!subject) {
      return [];
    }
    // const listOfSubjectIds = subjectOptions.map((subject) => subject.value)
    const filteredTopics = allTopics.filter((topic) => {
      return (
        topic.subjectId === subject &&
        validateTopicWithinEducationLevel(topic.educationLevel, educationLevel)
      );
    });

    const optionList = generateOptionsFromJsonList(
      filteredTopics,
      "topicName",
      "topicName"
    );
    optionList.sort((a, b) => a.label.localeCompare(b.label));
    return optionList;
  }, [allTopics, subjectOptions, subject]);

  const yearOptions = useMemo(() => {
    return generateYearList();
  }, []);
  const examTypeOptions = useMemo(() => {
    if (!educationLevel) return [];
    const filteredExamTypes = examTypeEducationLevelMapping.filter((examType) =>
      examType.educationLevel.includes(educationLevel as edu_level)
    );
    return generateOptionsFromJsonList(
      filteredExamTypes,
      "enumValue",
      "examType"
    );
  }, [educationLevel]);
  // Moving the resetting of fields to useEffect instead of using them in useMemo because, using them in useMemo will cause an update in Controller while causing a re-render of the form as well, which is illegal

  useEffect(() => {
    if (
      !subjectOptions.find((subjectOption) => subject === subjectOption.value)
    )
      resetField("subject");
  }, [subjectOptions]);
  useEffect(() => {
    if (!schoolOptions.find((schoolOption) => school === schoolOption.value))
      resetField("school");
  }, [schoolOptions]);
  useEffect(() => {
    topics.every((topic) => {
      if (!topicsOptions.find((topicOption) => topicOption.value === topic)) {
        resetField("topics");
        return false;
      }
      return true;
    });
  }, [topicsOptions]);
  useEffect(() => {
    if (!examTypeOptions.find((type) => examType === type.value))
      resetField("examType");
  }, [examTypeOptions]);

  const optionsDict = useMemo(() => {
    return {
      educationLevelOptions,
      schoolOptions,
      subjectOptions,
      topicsOptions,
      yearOptions,
      questionTypeOptions,
      examTypeOptions,
    };
  }, [
    educationLevelOptions,
    schoolOptions,
    subjectOptions,
    topicsOptions,
    yearOptions,
    questionTypeOptions,
    examTypeOptions,
  ]);

  return <QuestionInfoInput optionsDict={optionsDict} className="space-y-4" />;
}
