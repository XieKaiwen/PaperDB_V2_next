"use client";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import AddQuestionForm from "./AddQuestionForm";


export default function AddQuestionPage() {

  return (
    <div className="flex min-h-screen">
      <div className="w-full flex-1 p-4">
        <AddQuestionForm />
      </div>
      <Separator orientation="vertical" className="mx-4" />
      <div className="w-full flex-1 p-4">PREVIEW</div>
    </div>
  );
}
