"use client";
import React from "react";
import { Separator } from "../ui/separator";
import AddQuestionForm from "./AddQuestionForm";
import QuestionPreview from "./QuestionPreview";
import { AddQuestionContextProvider } from "@/components/contexts/AddQuestionContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getAllSchools,
  getAllSubjects,
  getAllTopics,
} from "@/actions/queryData.actions";

// TODO Create a small tool that uses OpenAI API to turn pictures of a question into the correct format

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

  return (
    <AddQuestionContextProvider>
      <div className="flex w-full">
        <div id="add-question-form" className="min-w-9/20 flex-1 h-full">
          <div className="p-4 max-h-screen overflow-y-auto min-h-0" style={{contain: 'layout'}}>
            <AddQuestionForm
              allSchools={allSchools}
              allSubjects={allSubjects}
              allTopics={allTopics}
            />
          </div>
        </div>
        {/* <div id="add-question-form" className="min-w-9/20 p-4">
          <AddQuestionForm
            allSchools={allSchools}
            allSubjects={allSubjects}
            allTopics={allTopics}
          />
        </div> */}
        <Separator orientation="vertical" className="mx-4 min-h-screen" />
        <div id="question-preview" className="min-w-9/20 h-full">
          <div className="p-4 max-h-screen overflow-y-auto min-h-0" style={{contain: 'layout'}}>
            <QuestionPreview
              allSchools={allSchools}
              allSubjects={allSubjects}
              allTopics={allTopics}
            />
          </div>
        </div>
        {/* <div id="question-preview" className="min-w-9/20 flex-1 p-4">
          <QuestionPreview
            allSchools={allSchools}
            allSubjects={allSubjects}
            allTopics={allTopics}
          />
        </div> */}
      </div>
    </AddQuestionContextProvider>
  );

}
