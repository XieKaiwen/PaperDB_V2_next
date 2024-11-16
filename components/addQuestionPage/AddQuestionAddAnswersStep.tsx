import { useAddQuestionContext } from "@/src/hooks/useAddQuestionContext";
import {
  AddQuestionFormData,
  ProcessedQuestionContentCombinedJSON,
} from "@/src/types/types";
import {
  createQuestionAnswerValueAfterReset,
  createQuestionAnswerValueWithoutReset,
  OEQAnswerSchema,
  questionAnswerRequiresReset,
} from "@/utils/addQuestionUtils";
import React, { forwardRef, useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { answerCombinedSchema } from "../../utils/addQuestionUtils";
import CustomTextArea from "../form-components/CustomTextArea";
import CustomFileInput from "../form-components/CustomFileInput";
import { Switch } from "@/components/ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CSS } from "@dnd-kit/utilities";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import crossDeleteIcon from "@/src/assets/cross-delete-icon.svg";
import dragHandleIcon from "@/src/assets/drag-handle.svg";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Image from "next/image";

export default function AddQuestionAddAnswersStep() {
  const { control, setValue, resetField, getValues } =
    useFormContext<AddQuestionFormData>();
  const {
    questionContentJSON: {
      subscribe: subscribeToQuestionContentJSON,
      retrieve: retrieveQuestionContentJSON,
    },
  } = useAddQuestionContext();
  const [questionContent, setQuestionContent] = useState<
    ProcessedQuestionContentCombinedJSON | undefined
  >(undefined);
  // const [formData, setFormData] = useState<AddQuestionFormData>(undefined);

  const [watchedQuestionAnswer, watchedQuestionType] = useWatch({
    control,
    name: ["questionAnswer", "questionType"],
  }) as [z.infer<typeof answerCombinedSchema>, string];

  // RETRIEVE THE FORM DATA AND QUESTION CONTENT FROM CONTEXT WHEN MOUNT
  useEffect(() => {
    // setFormData(retrieveFormData());
    setQuestionContent(retrieveQuestionContentJSON());
    // console.log("called retrieveQuestionContentJSON on AddQuestionAddAnswersStep mount");
  }, []);

  // SUBSCRIBE TO UPDATES WHEN COMPONENT MOUNTS
  useEffect(() => {
    // const unsubscribeToFormData = subscribeToFormData((updatedFormData) => {
    //   setFormData(updatedFormData);
    // });

    const unsubscribeToQuestionContentJSON = subscribeToQuestionContentJSON(
      (updatedQuestionContentJSON) => {
        setQuestionContent(updatedQuestionContentJSON);
        // console.log("Receive updatedQuestionContentJSON in AddQuestionAddAnswersStep");
      }
    );

    return () => {
      unsubscribeToQuestionContentJSON();
    };
  }, [setQuestionContent]);

  const questionLeafs = questionContent?.questionLeafs;
  console.log("questionContent:" + JSON.stringify(questionContent, null, 2));

  useEffect(() => {
    if (!questionContent) {
      return;
    }

    const requireReset = questionAnswerRequiresReset(
      watchedQuestionType,
      watchedQuestionAnswer
    );
    if (requireReset) {
      resetField("questionAnswer", { defaultValue: [] });
      const newQuestionAnswerValue = createQuestionAnswerValueAfterReset(
        watchedQuestionType,
        questionLeafs!
      );
      setValue("questionAnswer", newQuestionAnswerValue);
    } else {
      const newQuestionAnswerValue = createQuestionAnswerValueWithoutReset(
        watchedQuestionType,
        questionLeafs!,
        watchedQuestionAnswer
      );
      setValue("questionAnswer", newQuestionAnswerValue);
    }
    // console.log("Call useEffect for updating questionAnswer");
  }, [watchedQuestionType, questionLeafs]);
  // console.log("questionAnswer:" + JSON.stringify(watchedQuestionAnswer, null, 2));

  // USE useFieldArray to render the questionAnswer INPUTS
  // NO NEED FOR append and remove, BECAUSE USER DOES NOT NEED TO ADD OR REMOVE ANSWERS
  const { fields, update } = useFieldArray<AddQuestionFormData>({
    control,
    name: "questionAnswer",
  });

  function toggleFileClick(index: number) {
    const answerItem = getValues(`questionAnswer.${index}`);

    // Create a new object to avoid mutating the existing answerItem
    const updatedAnswerItem = {
      ...answerItem,
      isText: !answerItem.isText,
      answer: answerItem.isText ? new File([], "") : "", // Toggle between File and string
    };

    // Use the update function from useFieldArray to ensure sync
    update(index, updatedAnswerItem);
  }

  // TODO: Use useFieldArray to append and remove options for MCQ

  return (
    // <pre>{JSON.stringify(watchedQuestionAnswer, null, 2)}</pre>
    <>
      {watchedQuestionType === "MCQ" && (
        <div>{JSON.stringify(watchedQuestionAnswer, null, 2)}</div>
      )}
      {watchedQuestionType === "MCQ" && <AddMCQAnswerInput />}

      {watchedQuestionType === "OEQ" && (
        <div className="w-full space-y-3">
          {fields.map((answerPart, index) => {
            const { questionIdx, questionSubIdx, isText, answer } = answerPart;
            return (
              <div key={answerPart.id}>
                {isText ? (
                  <CustomTextArea<AddQuestionFormData>
                    control={control}
                    name={`questionAnswer.${index}.answer`}
                    label={`Answer for (${questionIdx})(${questionSubIdx})`}
                    placeholder="Enter the answer..."
                  />
                ) : (
                  <CustomFileInput<AddQuestionFormData>
                    control={control}
                    name={`questionAnswer.${index}.answer`}
                    label={`Answer for (${questionIdx})(${questionSubIdx})`}
                    key={answerPart.id}
                  />
                )}
                <div className="flex gap-2 mt-3">
                  Toggle File:
                  <Switch
                    checked={!isText}
                    onCheckedChange={() => toggleFileClick(index)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function AddMCQAnswerInput() {
  const { control, setValue, resetField, getValues } =
    useFormContext<AddQuestionFormData>();

  // THIS COMPONENT IS ONLY MOUNTED WHEN questionType === MCQ, hence
  const [options, setOptions] = useState<string[]>(() => {
    const formMCQAnswer = getValues("questionAnswer")[0];
    if (formMCQAnswer.options !== undefined) {
      return formMCQAnswer.options;
    }
    return [];
  });
  const [correctAnswers, setCorrectAnswers] = useState<string[]>(() => {
    const formMCQAnswer = getValues("questionAnswer")[0];
    if (formMCQAnswer.answer !== undefined) {
      return formMCQAnswer.answer;
    }
    return [];
  }); // This will be a list of options that are correct answers, will be converted into indexes that will be sorted, to keep them in order
  const [curInput, setCurInput] = useState<string>("");

  // Set up dndKit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setOptions((options) => {
        const oldIndex = options.indexOf(active.id as string);
        const newIndex = options.indexOf(over.id as string);

        return arrayMove(options, oldIndex, newIndex);
      });
    }
  }

  // SAVE OPTIONS AND ANSWERS INTO questionAnswers
  function handleSaveClick() {
    // Step 1: Find the indexes of correctAnswers in options
    const indexes = correctAnswers
      .map((answer) => options.indexOf(answer)) // Find the index of each correctAnswer
      .filter((index) => index !== -1); // Filter out any answers not found in options

    // Step 2: Sort the indexes
    const sortedIndexes = indexes.toSorted((a, b) => a - b);

    // Step 3: Map the sorted indexes back to the corresponding values in options
    const sortedCorrectAnswers = sortedIndexes.map((index) => options[index]);
    setValue("questionAnswer", [
      { options: options, answer: sortedCorrectAnswers },
    ]);
  }

  // HANDLING DELETION OF OPTIONS
  function handleDeleteOption(index: number) {
    console.log("Deleting option at index:", index);

    const optionDeleted = options[index];

    setOptions((prev) => {
      const newOptions = prev.filter((_, i) => i !== index);
      console.log("Updated options:", newOptions);
      return newOptions;
    });

    if (correctAnswers.includes(optionDeleted)) {
      setCorrectAnswers((prev) => {
        const updatedCorrectAnswers = prev.filter(
          (answer) => answer !== optionDeleted
        );
        console.log("Updated correctAnswers:", updatedCorrectAnswers);
        return updatedCorrectAnswers;
      });
    }
  }

  return (
    <>
      <div className="flex gap-3">
        <Input
          className=""
          onChange={(e) => setCurInput(e.target.value)}
          value={curInput}
          placeholder="Enter an option"
        />
        <Button
          className="bg-lavender-300 hover:bg-lavender-400 text-gray-700"
          onClick={() => {
            if (curInput.trim() === "") {
              alert("Option cannot be empty"); // Optional: Prevent adding empty strings
              return;
            }
            setOptions((prev) => {
              if (prev.includes(curInput)) {
                alert("This option already exists"); // Optional: Provide feedback
                return prev; // Return the existing array without changes
              }
              return [...prev, curInput];
            });
            setCurInput(""); // Clear the input field after adding
          }}
        >
          Add
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={options} strategy={verticalListSortingStrategy}>
          {options.map((option, index) => (
            <SortableMCQAddAnswerOptionItem
              key={option}
              index={index}
              id={option}
              onDelete={handleDeleteOption}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        className="bg-lavender-300 hover:bg-lavender-400 text-gray-700"
        onClick={handleSaveClick}
      >
        Save
      </Button>
    </>
  );
}

// Create an MCQAddAnswerOptionItem component, which will be forwardRefed and used for sortable MCQAddAnswerOptionItem
interface MCQAddAnswerOptionItemProps {
  option: string;
  index: number;
  style?: React.CSSProperties;
  onDelete: (index: number) => void;
}
const MCQAddAnswerOptionItem = forwardRef<
  HTMLDivElement,
  MCQAddAnswerOptionItemProps
>(function MCQAddAnswerOptionItem(
  { option, index, style, onDelete, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      style={style}
      className="p-2 bg-white rounded-lg shadow-md border-gray-300 border-2 w-full md:w-1/2 flex"
    >
      <p className="mr-auto" {...props}>{option}</p>
      <Button
        className=""
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => {
          console.log("Button clicked, index:", index);
          onDelete(index);
        }}
      >
        <Image src={crossDeleteIcon} alt="delete icon" width={10} height={10} />
      </Button>
      <Image
        src={dragHandleIcon}
        alt="drag handle icon"
        width={30}
        height={30}
        className="ml-2"
        {...props}
      />
    </div>
  );
});

interface SortableMCQAddAnswerOptionItemProps {
  onDelete: (index: number) => void;
  index: number;
  id: string;
}
function SortableMCQAddAnswerOptionItem({
  index,
  id,
  onDelete,
}: SortableMCQAddAnswerOptionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <MCQAddAnswerOptionItem
      option={id}
      index={index}
      onDelete={onDelete}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    />
  );
}
