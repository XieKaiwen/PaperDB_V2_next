import { useAddQuestionContext } from "@/src/hooks/useAddQuestionContext";
import {
  AddQuestionFormData,
  FormQuestionPart,
  FormQuestionPartParsed,
  FormQuestionPartWithImage,
  FormQuestionPartWithText,
  QuestionPreviewProps,
} from "@/src/types/types";
import { convertRomanToInt } from "@/utils/utils";
import React, { useEffect, useMemo, useState } from "react";
import ImageReader from "./ImageReader";


// TODO: Scrap the live preview and make it such that its a generated preview when clicking a button, to optimise the user experience, fix the "laggy input issue"

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

  const StructuredJSONFormatQuestionInfo = useMemo(() => {
    // Early return if questionPart is empty
    if (!questionPart || questionPart.length === 0) {
      return {
        questionContent: { indexed: {} },
        questionLeafs: {},
      };
    }

    // Group by questionIdx then by questionSubIdx
    // Refactor this, and create a type for it

    const questionPartParsed = questionPart
      .filter(
        (part: FormQuestionPart) => part.questionIdx && part.questionSubIdx
      )
      .map((part: FormQuestionPart) => {
        const { order, ...props } = part;
        return { ...props, order: parseInt(order || "0") || 0 };
      });

    questionPartParsed.sort(
      (a: FormQuestionPartParsed, b: FormQuestionPartParsed) =>
        a.order - b.order
    );

    const questionPartsSortedGrouped = questionPartParsed.reduce(
      (acc: Record<string, any>, part: FormQuestionPartParsed) => {
        const { questionIdx, questionSubIdx, isText } = part;

        // Common content extraction logic
        const content = isText ? part.text : part.image;

        // Handle operations when questionIdx === "root"
        if (questionIdx === "root") {
          // Add content to the root questionContent
          acc.questionContent[questionIdx].push({
            isText,
            content,
          });
        } else {
          // Handle operations when questionIdx !== "root"
          // Ensure indexed and leaf structures are initialized once
          acc.questionContent.indexed[questionIdx] =
            acc.questionContent.indexed[questionIdx] || {};
          acc.questionContent.indexed[questionIdx][questionSubIdx] =
            acc.questionContent.indexed[questionIdx][questionSubIdx] || [];
          acc.questionContent.indexed[questionIdx][questionSubIdx].push({
            isText,
            content,
          });

          // Use Set to avoid duplicates and simplify adding to questionLeafs
          acc.questionLeafs[questionIdx] =
            acc.questionLeafs[questionIdx] || new Set();
          acc.questionLeafs[questionIdx].add(questionSubIdx);
        }
        // Sort the leafs once after all entries are added
        return acc;
      },
      {
        questionContent: {
          root: [],
          indexed: {},
        },
        questionLeafs: {},
      }
    );


    Object.keys(questionPartsSortedGrouped.questionLeafs).forEach((key) => {
      questionPartsSortedGrouped.questionLeafs[key] = Array.from(
        questionPartsSortedGrouped.questionLeafs[key] as Set<string>
      ).sort(
        (a: string, b: string) => convertRomanToInt(a) - convertRomanToInt(b)
      );
    });
    console.log(questionPartsSortedGrouped);
    
    return questionPartsSortedGrouped;
  }, [questionPart]);

  // console.log(JSON.stringify(StructuredJSONFormatQuestionInfo, null, 2));
  const {
    questionContent: { root = [], indexed },
    questionLeafs,
  } = StructuredJSONFormatQuestionInfo;

  return (
    // TODO: Create a question title component
    <div className="w-full">
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(formData, null, 2)}</pre>
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

        {root.length > 0 && (
          <main className="flex flex-col gap-2 justify-center items-center">
            {root.map(
              (
                part:
                  | { isText: true; content: string }
                  | { isText: false; content: File },
                idx: number
              ) => {
                // Return the root elements here
                const { isText, content } = part;
                if (isText) {
                  return <p key={content} className="w-full text-sm text-start whitespace-pre-wrap break-words">{part.content}</p>;
                } else {
                  // return <img key={idx} src={URL.createObjectURL(part.content)} alt="Question Image" />;
                  return <ImageReader content={content} width={700} height={700} key={idx} />;
                }
              }
            )}
          </main>
        )}
      </div>
    </div>
  );
}
