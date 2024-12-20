import { useAddQuestionContext } from '@/src/hooks/useAddQuestionContext';
import {
  AddQuestionFormData,
  AddQuestionFormQuestionPart,
  ProcessedOEQQuestionAnswerJSON,
  ProcessedQuestionPart,
} from '@/src/types/types';

import React, { useEffect, useMemo, useState } from 'react';
import {
  MCQAnswerSchema,
  OEQAnswerSchema,
  processMCQQuestionAnswerIntoJSON,
  processOEQQuestionAnswerIntoJSON,
  processQuestionPartIntoQuestionContentJSON,
} from '@/utils/add-question/addQuestionUtils(client)';
import QuestionSectionDisplay from '../QuestionSectionDisplay';
import QuestionLeafAnswerDisplay from '../QuestionLeafAnswerDisplay';
import { z } from 'zod';

// TODO: Scrap the live preview and make it such that its a generated preview when clicking a button, to optimise the user experience, fix the "laggy input issue"

export default function QuestionPreview() {
  const {
    formData: { subscribe: subscribeToFormData },
    questionContentJSON: { update: updateQuestionContentJSON },
  } = useAddQuestionContext();
  const [formData, setFormData] = useState<AddQuestionFormData>({
    subject: '',
    educationLevel: '',
    school: '',
    questionType: '',
    topics: [],
    questionNumber: '',
    questionAnswer: [],
    examType: 'OTHER', // Provide a default valid examType
    year: '',
    questionPart: [],
  });

  useEffect(() => {
    const unsubscribeToFormData = subscribeToFormData((updatedFormData) => {
      // console.log("updated form data state in QuestionPreview");

      setFormData(updatedFormData);
    });

    return () => unsubscribeToFormData();
  }, [setFormData]);

  // Deconstruct formData
  const {
    year = '',
    educationLevel = '',
    school: chosenSchool = '',
    subject: chosenSubject = '',
    topics: chosenTopics = [],
    examType = '',
    questionType = '', // Do not need to display this
    questionNumber = '',
    questionPart = [],
    questionAnswer = [],
  } = formData as AddQuestionFormData;
  // console.log("questionPart:", formData);

  // CONSTRUCT THE QuestionContentCombinedJSON here
  const questionContentCombinedJSON = useMemo(() => {
    // console.log("Recalculating questionContentCombinedJSON in QuestionPreview");

    return processQuestionPartIntoQuestionContentJSON(
      questionPart as AddQuestionFormQuestionPart[],
      questionType,
    ); // questionLeafs should be null if there are no children from the root
  }, [questionPart, questionType]);

  // UPDATE CONTEXT QUESTION CONTENT JSON
  useEffect(() => {
    // console.log("Updating QuestionContent value in context in QuestionPreview");
    updateQuestionContentJSON(questionContentCombinedJSON);
  }, [questionContentCombinedJSON]);

  // DECONSTRUCT THE QuestionContentCombinedJSON
  const {
    questionContent: { root: questionRoot, indexed: questionIndexedParts },
    questionLeafs,
  } = questionContentCombinedJSON;
  // console.log(
  //   "questionContentCombinedJSON: " +
  //     JSON.stringify(questionContentCombinedJSON, null, 2)
  // );

  const questionAnswerJSON = useMemo(() => {
    return questionType === 'MCQ'
      ? processMCQQuestionAnswerIntoJSON(questionAnswer as z.infer<typeof MCQAnswerSchema>)
      : processOEQQuestionAnswerIntoJSON(questionAnswer as z.infer<typeof OEQAnswerSchema>);
  }, [questionAnswer]);
  // console.log("questionAnswerJSON: ", questionAnswerJSON);

  // FUNCTION TO CHECK IF TO DISPLAY THE ANSWER PART:
  // If questionType is OEQ, we need to check the appropriate keys exists on the JSON
  // If questionType is MCQ, we need to check if options and answer exists on the JSON

  function checkIfToDisplayAnswerPart(questionType: string, index: string, subIndex: string) {
    if (questionType === 'MCQ') {
      return questionAnswerJSON.options !== undefined && questionAnswerJSON.answer !== undefined;
    } else if (questionType === 'OEQ') {
      const tempQuestionAnswerJSON = questionAnswerJSON as ProcessedOEQQuestionAnswerJSON;
      return (
        tempQuestionAnswerJSON[index] !== undefined &&
        tempQuestionAnswerJSON[index][subIndex] !== undefined
      );
    }
    return false; // Return false for any other questionType
  }

  return (
    // TODO: Create a question title component
    <div className="w-full">
      <main className="space-y-10">
        <QuestionMetaDataDisplay
          chosenSchool={chosenSchool}
          chosenTopics={chosenTopics}
          chosenSubject={chosenSubject}
          year={year}
          educationLevel={educationLevel}
          examType={examType}
          questionNumber={questionNumber}
          questionType={questionType}
        />
        <div className="question-content-container">
          {questionRoot.length > 0 && (
            <div className="flex flex-col gap-2">
              <main className="question-section-content">
                {questionRoot.map((part: ProcessedQuestionPart, idx: number) => {
                  // Return the root elements here
                  const { isText, content, id } = part;
                  return (
                    <QuestionSectionDisplay id={id} content={content} key={id} isText={isText} />
                  );
                })}
              </main>
              {/* MCQ Answers should only be displayed under the root because MCQ only has a root section */}
              {questionType === 'MCQ' && checkIfToDisplayAnswerPart('MCQ', 'root', 'root') && (
                <QuestionLeafAnswerDisplay
                  questionType="MCQ"
                  content={
                    questionAnswerJSON as {
                      options: string[];
                      answer: string[];
                    }
                  }
                />
              )}
              {questionType === 'OEQ' && checkIfToDisplayAnswerPart('OEQ', 'root', 'root') && (
                <QuestionLeafAnswerDisplay
                  questionType="OEQ"
                  content={
                    (questionAnswerJSON as ProcessedOEQQuestionAnswerJSON)['root']['root']['answer']
                  }
                  isText={
                    (questionAnswerJSON as ProcessedOEQQuestionAnswerJSON)['root']['root']['isText']
                  }
                />
              )}
            </div>
          )}

          {/* DISPLAYING THE INDEXED */}
          {/* gap-6 between each indexed part */}
          {questionLeafs && (
            <div className="question-leafs">
              {Object.keys(questionLeafs).map((key: string) => (
                // {/* Display the main index */}
                <div key={key} className="question-indexed-section">
                  <span className="question-index-label">({key})</span>
                  <div className="question-indexed-section-content">
                    {questionIndexedParts[key]['root'] && (
                      <div className="question-index-root flex flex-col gap-2">
                        {/* Display the root content of the index  */}
                        <div key={key} className="question-section-content">
                          {questionIndexedParts[key]['root'].map((part) => {
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
                        </div>
                        {questionType === 'OEQ' &&
                          checkIfToDisplayAnswerPart('OEQ', key, 'root') && (
                            <QuestionLeafAnswerDisplay
                              questionType="OEQ"
                              content={
                                (questionAnswerJSON as ProcessedOEQQuestionAnswerJSON)[key]['root'][
                                  'answer'
                                ]
                              }
                              isText={
                                (questionAnswerJSON as ProcessedOEQQuestionAnswerJSON)[key]['root'][
                                  'isText'
                                ]
                              }
                            />
                          )}
                      </div>
                    )}

                    {/* Display the sub-index content for indexed questions */}
                    {questionLeafs[key].length > 0 && (
                      <div className="question-subindexed-section">
                        {' '}
                        {questionLeafs[key].map((subKey: string) => (
                          <div key={subKey} className="question-indexed-part flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                              <span className="question-subindex-label">({subKey})</span>
                              <div className="question-section-content">
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
                                  },
                                )}
                              </div>
                            </div>
                            {/* OEQ format of displaying the answer */}
                            {questionType === 'OEQ' &&
                              checkIfToDisplayAnswerPart('OEQ', key, subKey) && (
                                <QuestionLeafAnswerDisplay
                                  questionType="OEQ"
                                  content={
                                    (questionAnswerJSON as ProcessedOEQQuestionAnswerJSON)[key][
                                      subKey
                                    ]['answer']
                                  }
                                  isText={
                                    (questionAnswerJSON as ProcessedOEQQuestionAnswerJSON)[key][
                                      subKey
                                    ]['isText']
                                  }
                                />
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface QuestionMetaDataDisplay {
  chosenSchool: string;
  chosenTopics: string[];
  chosenSubject: string;
  year: string;
  educationLevel: string;
  examType: string;
  questionNumber: string;
  questionType: string;
}

function QuestionMetaDataDisplay({
  chosenSchool,
  chosenTopics,
  chosenSubject,
  year,
  educationLevel,
  examType,
  questionNumber,
  questionType,
}: QuestionMetaDataDisplay) {
  const {
    data: { schools: allSchools, topics: allTopics, subjects: allSubjects },
  } = useAddQuestionContext();
  function constructQuestionTitle(
    schoolId: string,
    year: string,
    educationLevel: string,
    examType: string,
  ) {
    const schoolName = allSchools.find((school) => school.id === schoolId)?.schoolFullName || '';
    const yearName = year ? `(${year})` : '';

    // return `${schoolName} ${yearName} ${educationLevel ? `- ${educationLevel}` : ""}`
    return [`${schoolName} ${yearName}`, `${educationLevel} ${examType}`];
  }

  const questionTitle = constructQuestionTitle(chosenSchool, year, educationLevel, examType || '');

  // CREATE LIST OF TOPICS
  const topicString = useMemo(() => {
    // const topicList: string[] = chosenTopics.map(
    //   (topicId: string) =>
    //     allTopics.find((topic) => topic.id === topicId)!?.topicName
    // );
    // topicList.sort((a, b) => a.localeCompare(b));
    // return topicList.join(", ");

    const sortedChosenTopics = chosenTopics.sort((a, b) => a.localeCompare(b));
    return sortedChosenTopics.join(', ');
  }, [chosenTopics]);

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-1 flex-col items-center justify-center font-merriweather font-bold">
        <h2 className="text-lg">{questionTitle[0]}</h2>
        <h3 className="text-base">{questionTitle[1]}</h3>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center space-y-1 text-sm font-semibold">
        {chosenSubject && (
          <p>
            Subject:{' '}
            <span className="font-normal">
              {allSubjects.find((subject) => subject.id === chosenSubject)?.subjectName}
            </span>
          </p>
        )}
        {topicString && (
          <div className="w-full space-y-1 text-center lg:w-1/2">
            <p>Topics:</p>
            <p className="font-normal">
              <em>{topicString}</em>
            </p>
          </div>
        )}
        {questionNumber && (
          <p>
            Question Number: <span className="font-normal">{questionNumber}</span>
          </p>
        )}
        {questionType && (
          <p>
            Question Type: <span className="font-normal">{questionType}</span>
          </p>
        )}
      </div>
    </div>
  );
}
