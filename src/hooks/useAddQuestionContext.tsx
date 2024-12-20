import { AddQuestionContext } from '@/components/contexts/AddQuestionContext';
import { useContext } from 'react';

export function useAddQuestionContext() {
  const context = useContext(AddQuestionContext);

  if (!context) {
    throw new Error('useFormContext should be used within <AddQuestionContextProvider>');
  }

  return context;
}
