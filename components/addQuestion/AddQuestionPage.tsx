"use client";
import React from "react";
import { Separator } from "../ui/separator";
import AddQuestionForm from "./AddQuestionForm";
import QuestionPreview from "./QuestionPreview";
import { AddQuestionContextProvider } from "@/contexts/AddQuestionContext";

export default function AddQuestionPage() {
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
