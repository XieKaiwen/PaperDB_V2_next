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
  useDraggable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
  // THIS COMPONENT IS ONLY MOUNTED WHEN questionType === MCQ, hence
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]); // This will be a list of options that are correct answers, will be converted into indexes that will be sorted, to keep them in order
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
    setActiveId(null);
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
              option={option}
              index={index}
              id={option}
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
}

// Create an MCQAddAnswerOptionItem component, which will be forwardRefed and used for sortable MCQAddAnswerOptionItem
interface MCQAddAnswerOptionItemProps {
  option: string;
  index: number;
  style?: React.CSSProperties;
}
const MCQAddAnswerOptionItem = forwardRef<
  HTMLDivElement,
  MCQAddAnswerOptionItemProps
>(function MCQAddAnswerOptionItem({ option, index, ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      className="p-2 bg-white rounded-lg shadow-md border-gray-300 border-2 w-full md:w-1/2"
    >
      <p>{option}</p>
    </div>
  );
});

interface SortableMCQAddAnswerOptionItemProps {
  option: string;
  index: number;
  id: string;
}
function SortableMCQAddAnswerOptionItem({
  index,
  id,
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
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    />
  );
}
