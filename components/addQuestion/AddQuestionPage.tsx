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
      <div className="flex h-full">
        <div id="add-question-form" className="flex-1 h-full">
          <div className="p-4 max-h-144 overflow-y-auto">
            <AddQuestionForm
              allSchools={allSchools}
              allSubjects={allSubjects}
              allTopics={allTopics}
            />
          </div>
        </div>
        {/* <div id="add-question-form" className="flex-1 p-4">
          <AddQuestionForm
            allSchools={allSchools}
            allSubjects={allSubjects}
            allTopics={allTopics}
          />
        </div> */}
        <Separator orientation="vertical" className="mx-4" />
        <div id="question-preview" className="flex-1 h-full">
          <div className="p-4 max-h-144 overflow-y-auto">
            <QuestionPreview
              allSchools={allSchools}
              allSubjects={allSubjects}
              allTopics={allTopics}
            />
          </div>
        </div>
        {/* <div id="question-preview" className="flex-1 p-4">
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
