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
    isPending: isSubjectsPending,
    isError: isSubjectsError,
    data: allSubjects,
    error: subjectsError,
  } = useSuspenseQuery({
    queryKey: ["subjects"],
    queryFn: getAllSubjects,
  });

  const {
    isPending: isTopicsPending,
    isError: isTopicsError,
    data: allTopics,
    error: topicsError,
  } = useSuspenseQuery({
    queryKey: ["topics"],
    queryFn: getAllTopics,
  });

  const {
    isPending: isSchoolsPending,
    isError: isSchoolsError,
    data: allSchools,
    error: schoolsError,
  } = useSuspenseQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
  });
  // if (isSubjectsError || isTopicsError || isSchoolsError) {
  //   return (
  //     <>
  //       {isSubjectsError && <div>{subjectsError.toString()}</div>}
  //       {isTopicsError && <div>{topicsError.toString()}</div>}
  //       {isSchoolsError && <div>{schoolsError.toString()}</div>}
  //     </>
  //   );
  // }

  // if (isSubjectsPending || isTopicsPending || isSchoolsPending) {
  //   return <div>Loading...</div>;
  // }

  console.log("Subjects: ", allSubjects);
  console.log("Topics: ", allTopics);
  console.log("Schools: ", allSchools);

  return (
    <AddQuestionContextProvider>
      <div className="flex min-h-screen">
        <div className="w-full flex-1 p-4">
          <AddQuestionForm />
        </div>
        <Separator orientation="vertical" className="mx-4" />
        <div className="w-full flex-1 p-4">
          <QuestionPreview />
        </div>
      </div>
    </AddQuestionContextProvider>
  );
}
