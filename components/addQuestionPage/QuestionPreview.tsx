import { useAddQuestionContext } from "@/src/hooks/useAddQuestionContext";
import { AddQuestionFormData, ProcessedQuestionPart } from "@/src/types/types";

import React, { useEffect, useMemo, useState } from "react";
import { processQuestionPartIntoQuestionContentJSON } from "@/utils/addQuestionUtils";
import QuestionSectionDisplay from "../QuestionSectionDisplay";

// TODO: Scrap the live preview and make it such that its a generated preview when clicking a button, to optimise the user experience, fix the "laggy input issue"

export default function QuestionPreview() {
  const {
    formData: { subscribe: subscribeToFormData },
    data: { schools: allSchools, subjects: allSubjects, topics: allTopics },
  } = useAddQuestionContext();
  const [formData, setFormData] = useState<AddQuestionFormData>({});

  useEffect(() => {
    const unsubscribeToFormData = subscribeToFormData((updatedFormData) => {
      setFormData(updatedFormData);
    });

    return () => unsubscribeToFormData();
  }, [setFormData]);

  // FUNCTION FOR CONSTRUCTING the question title: school name, year, education level and examType
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
  console.log(JSON.stringify(questionPart, null, 2));
  // CONSTRUCT THE QUESTION TITLE
  const questionTitle = constructQuestionTitle(
    chosenSchool,
    year,
    educationLevel,
    examType || ""
  );

  // CREATE LIST OF TOPICS
  const topicString = useMemo(() => {
    const topicList: string[] = chosenTopics.map(
      (topicId: string) =>
        allTopics.find((topic) => topic.id === topicId)?.topicName
    );
    topicList.sort((a, b) => a.localeCompare(b));
    return topicList.join(", ");
  }, [chosenTopics]);
  // Cannot have any return statements before hooks

  // CONSTRUCT THE QuestionContentCombinedJSON here
  const questionContentCombinedJSON = useMemo(() => {
    return processQuestionPartIntoQuestionContentJSON(questionPart); // questionLeafs should be null if there are no children from the root
  }, [questionPart]);

  // DECONSTRUCT THE QuestionContentCombinedJSON
  const {
    questionContent: { root: questionRoot, indexed: questionIndexedParts },
    questionLeafs,
  } = questionContentCombinedJSON;
  console.log(JSON.stringify(questionContentCombinedJSON, null, 2));
  return (
    // TODO: Create a question title component
    <div className="w-full">
      {/* <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(formData, null, 2)}
      </pre> */}
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
          {questionNumber && (
            <p>
              Question Number:{" "}
              <span className="font-normal">{questionNumber}</span>
            </p>
          )}
        </div>

        {/* DISPLAYING THE CONTENT FOR ROOT ELEMENT */}
        {/* TODO: CREATING A COMPONENT QuestionSectionDisplay, and then use React memo on it */}
        {questionRoot.length > 0 && (
          <main className="flex flex-col gap-1 justify-center items-center">
            {questionRoot.map((part: ProcessedQuestionPart, idx: number) => {
              // Return the root elements here
              const { isText, content, id } = part;
              return (
                <QuestionSectionDisplay
                  id={id}
                  content={content}
                  key={id}
                  isText={isText}
                />
              );
            })}
          </main>
        )}

        {/* DISPLAYING THE INDEXED */}
        {questionLeafs && (
          <div className="flex flex-col gap-2">
            {Object.keys(questionLeafs).map((key: string) => (
              // {/* Display the main index */}
              <div key={key} className="flex flex-1 gap-2">
                <span className="inline-block text-sm">({key})</span>
                <div key={key} className="flex flex-col gap-1">
                  {/* Display the root content of the index  */}
                  {questionIndexedParts[key]["root"] &&
                    questionIndexedParts[key]["root"].map((part) => {
                      const { isText, content, id } = part;
                      return (
                        <QuestionSectionDisplay
                          id={id}
                          content={content}
                          key={id}
                          isText={isText}
                        />
                      );
                    })}
                  {questionLeafs[key].map((subKey: string) => (
                    <div key={subKey} className="flex items-start gap-2">
                      <span className="inline-block text-sm">({subKey})</span>
                      <div className="flex-1">
                        {questionIndexedParts[key][subKey].map(
                          (part: ProcessedQuestionPart, idx: number) => {
                            const { isText, content, id } = part;
                            return (
                              <QuestionSectionDisplay
                                id={id}
                                content={content}
                                key={id}
                                isText={isText}
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
