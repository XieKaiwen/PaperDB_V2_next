"use client";
import React from "react";
import { Separator } from "../ui/separator";
import AddQuestionForm from "./AddQuestionForm";
import QuestionPreview from "./QuestionPreview";
import { AddQuestionContextProvider } from "@/components/contexts/AddQuestionContext";

// TODO Create a small tool that uses OpenAI API to turn pictures of a question into the correct format

export default function AddQuestionPage() {


  return (
    <AddQuestionContextProvider>
      <div className="flex w-full">
        <div id="add-question-form" className="min-w-9/20 flex-1 h-full">
          <div className="p-4 max-h-screen overflow-y-auto min-h-0" style={{contain: 'layout'}}>
            <AddQuestionForm/>
          </div>
        </div>
        <Separator orientation="vertical" className="mx-4 min-h-screen" />
        <div id="question-preview" className="min-w-9/20 h-full">
          <div className="p-4 max-h-screen overflow-y-auto min-h-0" style={{contain: 'layout'}}>
            <QuestionPreview/>
          </div>
        </div>
      </div>
    </AddQuestionContextProvider>
  );

}
