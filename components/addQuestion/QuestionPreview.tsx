import { useAddQuestionContext } from "@/hooks/useAddQuestionContext";
import { AddQuestionFormData, QuestionPreviewProps } from "@/types/types";
import React, { useEffect, useMemo, useState } from "react";

export default function QuestionPreview({
  allSchools,
  allSubjects,
  allTopics,
}: QuestionPreviewProps) {
  const { subscribeToFormData } = useAddQuestionContext();
  const [formData, setFormData] = useState<AddQuestionFormData>({});

  useEffect(() => {
    const unsubscribeToFormData = subscribeToFormData((updatedFormData) => {
      setFormData(updatedFormData);
    });

    return () => unsubscribeToFormData();
  }, [subscribeToFormData, setFormData]);

  function constructQuestionTitle(
    schoolId: string,
    year: string,
    educationLevel: string,
    examType: string
  ) {
    const schoolName =
      allSchools.find((school) => school.id === schoolId)?.schoolFullName || "";
    const yearName = year ? `(${year})` : "";

    // return `${schoolName} ${yearName} ${educationLevel ? `- ${educationLevel}` : ""}`
    return [`${schoolName} ${yearName}`, `${educationLevel} ${examType}`];
  }

  // Deconstruct formData
  const {
    year = "",
    educationLevel = "",
    school: chosenSchool = "",
    subject: chosenSubject = "",
    topics: chosenTopics = [],
    examType = "",
    questionType = "", // Do not need to display this
    questionNumber = "",
    questionPart = [],
  } = formData as AddQuestionFormData;

  const questionTitle = constructQuestionTitle(
    chosenSchool,
    year,
    educationLevel,
    examType || ""
  );

  const topicString = useMemo(() => {
    const topicList: string[] = chosenTopics.map(
      (topicId: string) =>
        allTopics.find((topic) => topic.id === topicId)?.topicName
    );
    topicList.sort((a, b) => a.localeCompare(b));
    return topicList.join(", ");
  }, [chosenTopics]);
  // Cannot have any return statements before hooks


  return (
    // TODO: Create a question title component
    <div className="w-full">
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      <div className="space-y-3">
        <div className="flex flex-1 flex-col justify-center items-center font-merriweather font-bold">
          <h2 className="text-lg">{questionTitle[0]}</h2>
          <h3 className="text-base">{questionTitle[1]}</h3>
        </div>
        <div className="flex flex-1 flex-col space-y-2 justify-center items-center text-sm font-semibold">
          {/* Put subjects and topics here */}
          {chosenSubject && (
            <p>
              Subject:{" "}
              <span className="font-normal">
                {
                  allSubjects.find((subject) => subject.id === chosenSubject)
                    ?.subjectName
                }
              </span>
            </p>
          )}
          {topicString && (
            <div className="w-full lg:w-1/2 text-center space-y-1">
              <p>Topics:</p>
              <p className="font-normal">{topicString}</p>
            </div>
          )}
        </div>
      </div>
      QUESTION
    </div>
  );
}
