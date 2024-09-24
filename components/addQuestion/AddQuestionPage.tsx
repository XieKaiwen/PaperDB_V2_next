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

  return (
    <AddQuestionContextProvider>
      <div className="flex min-h-screen">
        <div className="w-full flex-1 p-6 overflow-auto max-h-screen scrollbar-thumb-gray-500 scrollbar-track-gray-200 scrollbar-thin">
          <AddQuestionForm />
        </div>
        <Separator orientation="vertical" className="mx-4" />
        <div className="w-full flex-1 p-6 overflow-auto max-h-screen scrollbar-thumb-gray-500 scrollbar-track-gray-200 scrollbar-thin">
          <QuestionPreview />
        </div>
      </div>
    </AddQuestionContextProvider>
  );
}
