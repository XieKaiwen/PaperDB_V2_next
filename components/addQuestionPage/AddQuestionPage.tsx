'use client';
import React from 'react';
import { Separator } from '../ui/separator';
import AddQuestionForm from './AddQuestionForm';
import QuestionPreview from './QuestionPreview';
import { AddQuestionContextProvider } from '@/components/contexts/AddQuestionContext';
import LoadingSuspense from '../LoadingSuspense';

// TODO Create a small tool that uses OpenAI API to turn pictures of a question into the correct format

export default function AddQuestionPage() {
  return (
    <LoadingSuspense size="lg">
      <AddQuestionContextProvider>
        <div className="flex w-full">
          <div id="add-question-form" className="h-full min-w-9/20 flex-1">
            <div className="max-h-screen min-h-0 overflow-y-auto p-4" style={{ contain: 'layout' }}>
              <AddQuestionForm />
            </div>
          </div>
          <Separator orientation="vertical" className="mx-4 min-h-screen" />
          <div id="question-preview" className="h-full min-w-9/20 flex-1">
            <div className="max-h-screen min-h-0 overflow-y-auto p-4" style={{ contain: 'layout' }}>
              <QuestionPreview />
            </div>
          </div>
        </div>
      </AddQuestionContextProvider>
    </LoadingSuspense>
  );
}
