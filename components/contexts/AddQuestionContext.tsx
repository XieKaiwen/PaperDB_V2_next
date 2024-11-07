import {
  getAllSchools,
  getAllSubjects,
  getAllTopics,
} from "@/src/actions/dataFetching.actions";
import {
  AddQuestionFormData,
  AddQuestionFormDataSubscriber,
  AddQuestionQuestionContentJSONSubscriber,
  ProcessedQuestionContentCombinedJSON,
} from "@/src/types/types";
import { School, Subject, Topic } from "@prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import React, { createContext, ReactNode, useMemo, useRef } from "react";

interface FormDataContext {
  update: (updatedFormData: AddQuestionFormData) => void;
  subscribe: (subscriber: AddQuestionFormDataSubscriber) => () => void;
}

interface QuestionContentJSONContext {
  update: (updatedQuestionContentJSON: ProcessedQuestionContentCombinedJSON) => void;
  subscribe: (subscriber: AddQuestionQuestionContentJSONSubscriber) => () => void;
}

interface DataContext {
  subjects: Subject[];
  topics: Topic[];
  schools: School[];
}

interface AddQuestionContextProps {
  formData: FormDataContext;
  questionContentJSON: QuestionContentJSONContext;
  data: DataContext;
}

const AddQuestionContext = createContext<AddQuestionContextProps | null>(null);

function AddQuestionContextProvider({ children }: { children: ReactNode }) {
  // Fetch all the data once in the context so that its children, "AddQuestionForm" and "QuestionPreview" can access this data.
  const { data: allSubjects } = useSuspenseQuery({
    queryKey: ["subjects"],
    queryFn: getAllSubjects,
  });

  const { data: allTopics } = useSuspenseQuery({
    queryKey: ["topics"],
    queryFn: getAllTopics,
  });

  const { data: allSchools } = useSuspenseQuery({
    queryKey: ["schools"],
    queryFn: getAllSchools,
  });

  const addQuestionFormData = useRef<AddQuestionFormData>({});
  const formDataSubscribers = useRef<Set<AddQuestionFormDataSubscriber>>(
    new Set()
  );

  // Create the debouncedUpdateFormData function in context instead of in the AddQuestionForm component, useRef to prevent unnecessary re-renders
  const debouncedUpdateFormData = useRef(
    debounce((updatedFormData: AddQuestionFormData) => {
      addQuestionFormData.current = updatedFormData;

      formDataSubscribers.current.forEach((subscriber) => {
        subscriber(updatedFormData);
      });
    }, 1000) // Adjust the debounce delay (300ms in this case) as needed
  ).current;

  // Let the subscribeToFormData be a Ref as well to increase stability
  const subscribeToFormData = useRef(
    (subscriber: AddQuestionFormDataSubscriber) => {
      formDataSubscribers.current.add(subscriber);
      //  Return a cleanup function that will be called when the component unmounts to unsubcribe the subscriber
      return () => formDataSubscribers.current.delete(subscriber);
    }
  ).current;



  // Track QuestionContentJSON for questionLeafs that is required in the 3rd step of the form
  const questionContentJSON = useRef<ProcessedQuestionContentCombinedJSON>({
    questionContent: {
      root: [],
      indexed: {},
    },
    questionLeafs: {},
  });
  const questionContentJSONSubscribers = useRef<
    Set<AddQuestionQuestionContentJSONSubscriber>
  >(new Set());
  // FUNCTION FOR TRACKING QuestionContentJSON, no need for debounce because it does not happen often
  const updateQuestionContentJSON = useRef(
    (updatedQuestionContentJSON: ProcessedQuestionContentCombinedJSON) => {
      questionContentJSON.current = updatedQuestionContentJSON;

      questionContentJSONSubscribers.current.forEach((subscriber) => {
        subscriber(updatedQuestionContentJSON);
      });
    }
  ).current;
  // Let the subscribeToQuestionContentJSON be a Ref as well to increase stability
  const subscribeToQuestionContentJSON = useRef(
    (subscriber: AddQuestionQuestionContentJSONSubscriber) => {
      questionContentJSONSubscribers.current.add(subscriber);
      //  Return a cleanup function that will be called when the component unmounts to unsubcribe the subscriber
      return () => questionContentJSONSubscribers.current.delete(subscriber);
    }
  ).current;

  const AddQuestionContextValue = useMemo(() => {
    return {
      formData: {
        update: debouncedUpdateFormData,
        subscribe: subscribeToFormData,
      },
      questionContentJSON:{
        update: updateQuestionContentJSON,
        subscribe: subscribeToQuestionContentJSON
      },
      data: {
        subjects: allSubjects,
        topics: allTopics,
        schools: allSchools,
      },
    };
  }, [allSubjects, allTopics, allSchools]);

  return (
    <AddQuestionContext.Provider value={AddQuestionContextValue}>
      {children}
    </AddQuestionContext.Provider>
  );
}

export { AddQuestionContext, AddQuestionContextProvider };
