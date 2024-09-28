"use client";
import React from "react";
import { Separator } from "../ui/separator";
import AddQuestionForm from "./AddQuestionForm";
import QuestionPreview from "./QuestionPreview";
import { AddQuestionContextProvider } from "@/contexts/AddQuestionContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getAllSchools,
  getAllSubjects,
  getAllTopics,
} from "@/actions/queryData.actions";

export default function AddQuestionPage() {
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
  // return (
  //   <AddQuestionContextProvider>
  //     <div className="flex h-full">
  //       <div id="add-question-form" className="flex-1 p-4">
  //         <div className="flex flex-col w-full max-h-144 overflow-y-auto">
  //           <AddQuestionForm
  //             allSchools={allSchools}
  //             allSubjects={allSubjects}
  //             allTopics={allTopics}
  //           />
  //         </div>
  //       </div>
  //       <Separator orientation="vertical" className="mx-2" />
  //       <div id="question-preview" className="flex-1 p-4">
  //         <div className="flex flex-col w-full max-h-144 overflow-y-auto">
  //           <QuestionPreview
  //             allSchools={allSchools}
  //             allSubjects={allSubjects}
  //             allTopics={allTopics}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </AddQuestionContextProvider>
  // );
  return (
    <AddQuestionContextProvider>
      {/* <div className="flex h-full">
        <div id="add-question-form" className="flex-1 h-full overflow-hidden">
          <div className="p-4 max-h-full overflow-y-auto">
            <AddQuestionForm
              allSchools={allSchools}
              allSubjects={allSubjects}
              allTopics={allTopics}
            />
          </div>
        </div> */}
      <div 
        // className="flex h-screen"
        className="flex"
      >
        <div id="add-question-form" className="flex-1 p-4">
          <AddQuestionForm
            allSchools={allSchools}
            allSubjects={allSubjects}
            allTopics={allTopics}
          />
        </div>
        <Separator orientation="vertical" className="mx-4" />
        {/* <div id="question-preview" className="flex-1 overflow-y-hidden">
          <div className="p-4 max-h-full overflow-y-auto">
            <QuestionPreview
              allSchools={allSchools}
              allSubjects={allSubjects}
              allTopics={allTopics}
            />
          </div>
        </div> */}
        <div id="question-preview" className="flex-1 p-4">
          <QuestionPreview
            allSchools={allSchools}
            allSubjects={allSubjects}
            allTopics={allTopics}
          />
        </div>
      </div>
    </AddQuestionContextProvider>
  );
}
