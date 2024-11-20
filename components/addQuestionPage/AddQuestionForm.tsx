import { questionPartSchema, defaultValues as addQuestionFormDefaultValues } from "@/utils/addQuestionUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import {
  FieldValues,
  Path,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { useAddQuestionContext } from "@/src/hooks/useAddQuestionContext";
import { AddQuestionFormData } from "@/src/types/types";
import { Oval } from "react-loader-spinner";
import AddQuestionQuestionPartStep from "./AddQuestionQuestionPartStep";
import AddQuestionPaperMetadataStep from "./AddQuestionPaperMetadataStep";
import AddQuestionAddAnswersStep from "./AddQuestionAddAnswersStep";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

/**
 * Some guidelines on the availability of options for certain fields:
 * 1. educationLevel decides the options for: school and subject, directly.
 * 2. subject decides the options for: topics, directly.
 * 3. Hence, the order for filtering of form options on change for form data will be: Checking education level -> school/subject -> topic. We are to filter according to this order.
 * 4. If option currently selected for school/subject is not appropriate for the new education level, then formfield for school/subject will be reset. But no matter what, with a change in education level, the options for school/subject will be updated.
 * 5. If option currently selected for topic is not appropriate for the new subject, then formfield for topic will be reset.
 */

export default function AddQuestionForm() {
  // SET FORM STEP
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [formDataToSubmit, setFormDataToSubmit] = useState<AddQuestionFormData>(
    addQuestionFormDefaultValues
  );
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [isExistingQuestionNumber, setIsExistingQuestionNumber] =
    useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState(false); // For loading spinner on submit button
  const [submissionError, setSubmissionError] = useState({message: ""})
  const fieldsEachStep: { [key: number]: Path<AddQuestionFormData>[] } = {
    1: [
      "year",
      "educationLevel",
      "school",
      "subject",
      "topics",
      "examType",
      "questionType",
      "questionNumber",
    ],
    2: ["questionPart"],
    3: [],
  };
  const step1Schema = questionPartSchema.pick({
    year: true,
    educationLevel: true,
    school: true,
    subject: true,
    topics: true,
    examType: true,
    questionType: true,
    questionNumber: true,
  });
  const step2Schema = questionPartSchema.pick({
    questionPart: true,
  });

  // RETRIEVE CONTEXT VALUES
  const {
    formData: { update: debounceUpdateFormData },
    // data: { subjects: allSubjects, topics: allTopics, schools: allSchools }, // Data should only be used in step 1, hence can delete later
  } = useAddQuestionContext();

  // SET UP FORM AND WATCHED VALUES
  const form = useForm<z.infer<typeof questionPartSchema>>({
    resolver: zodResolver(questionPartSchema),
    defaultValues: {
      year: "",
      educationLevel: "",
      school: "",
      subject: "",
      topics: [],
      examType: undefined,
      questionType: "",
      questionNumber: "",
      questionPart: [],
      questionAnswer: [],
    },
  });

  // // default value for images should be new File([], "")
  const { control, clearErrors, getValues, setError } = form;
  const { isSubmitting } = useFormState({ control });

  // Changing to using useWatch because watch() causes a rerender of the form whenever there is a change in formValues, i do not want that
  const watchedValues = useWatch({
    control,
    name: [
      "year",
      "educationLevel",
      "school",
      "subject",
      "topics",
      "examType",
      "questionType",
      "questionNumber",
      "questionPart",
      "questionAnswer",
    ], // Fields to watch
  });
  // destructure watchedValues
  const [
    year,
    educationLevel,
    school,
    subject,
    topics,
    examType,
    questionType,
    questionNumber,
  ] = watchedValues;
  // SEPARATE questionPart AND questionAnswer INTO SEPARATE useWatch, for more stable references
  const questionPart = useWatch({
    control,
    name: "questionPart",
  });
  const questionAnswer = useWatch({
    control,
    name: "questionAnswer",
  });

  useEffect(() => {
    debounceUpdateFormData({
      year,
      educationLevel,
      school,
      subject,
      topics,
      examType,
      questionType,
      questionNumber,
      questionPart,
      questionAnswer,
    });
  }, [
    year,
    educationLevel,
    school,
    subject,
    topics,
    examType,
    questionType,
    questionNumber,
    questionPart,
    questionAnswer,
  ]);
  // console.log("Current form data",{
  //   year,
  //   educationLevel,
  //   school,
  //   subject,
  //   topics,
  //   examType,
  //   questionType,
  //   questionNumber,
  //   questionPart,
  //   questionAnswer,
  // });

  function nextStepClick() {
    clearErrors();
    if (fieldsEachStep[formStep].length !== 0) {
      const valuesArray = getValues(fieldsEachStep[formStep]) as FieldValues;

      // Transform array of values into an object with field names as keys
      const valuesToValidate = Object.fromEntries(
        fieldsEachStep[formStep].map((field, index) => [
          field,
          valuesArray[index],
        ])
      ) as FieldValues;
      console.log(valuesToValidate);

      //  validate with zod
      // Choose the schema based on the current step
      const validationSchema = formStep === 1 ? step1Schema : step2Schema;
      const validationResult = validationSchema.safeParse(valuesToValidate);
      if (validationResult.success) {
        setFormStep((prev) => (prev + 1) as 1 | 2 | 3);
      } else {
        console.log(validationResult);
        validationResult.error.errors.forEach((error) => {
          const { message, path } = error;
          setError(path.join(".") as Path<AddQuestionFormData>, {
            message,
          });
        });
      }
    } else {
      setFormStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  }

  function prevStepClick() {
    setFormStep((prev) => (prev - 1) as 1 | 2 | 3);
  }

  // FUNCTIONS TO BE CALLED AFTER SUBMISSION
  // Initial submission: Client-side validation -> Check if question number in the paper exists -> Open dialog to move to next step
  async function onSubmit(values: z.infer<typeof questionPartSchema>) {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Submitted: ", values);
    setFormDataToSubmit(values);
    /** 
     * Check if the question number already exists here.
     */
    setIsDialogueOpen(true);
  }

  // If the user presses the cancel button or the dialog is closed
  async function onSubmitCancel() {
    setIsDialogueOpen(false)
    setIsExistingQuestionNumber(false);
    setFormDataToSubmit(addQuestionFormDefaultValues)
  }

  // If the user presses the confirm button on dialog
  async function onSubmitConfirm() {
    setIsDialogueOpen(false);
    setFormSubmitting(true);
    /**
     * Perform all the submission logic here
     */

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFormSubmitting(false)
    /**
     * If submission is successful, reset the form and reset the formData state
     * If unsuccessful, update error state and use useEffect to display a toast.
     * Also update submissionError state accordingly, if successful, set it to the default value
     * if not, set it to the error message
     */
  }

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-2 w-full space-y-7"
        >
          {formStep === 1 && <AddQuestionPaperMetadataStep />}
          {formStep === 3 && <AddQuestionAddAnswersStep />}
          <div className="space-y-2">
            {formStep === 2 && <AddQuestionQuestionPartStep />}
            <div className="flex gap-4 w-full mt-2">
              {formStep > 1 && (
                <Button
                  className="w-full"
                  type="button"
                  onClick={prevStepClick}
                >
                  Back
                </Button>
              )}
              {formStep < 3 && (
                <Button
                  className="w-full"
                  type="button"
                  onClick={nextStepClick}
                >
                  Next
                </Button>
              )}
              {formStep === 3 && (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? (
                    <div className="flex gap-4">
                      <p>Loading</p>
                      <Oval
                        visible={true}
                        height="20"
                        width="20"
                        color="#a3c4ff"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
      <Dialog
        open={isDialogueOpen}
        onOpenChange={(open) => !open && onSubmitCancel()}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isExistingQuestionNumber ? "Replace an existing question?" : "Add a new question?"}</DialogTitle>
            <DialogDescription>
              {isExistingQuestionNumber ? "Text if question number does exist" : "Text if question number does not exist"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button variant="destructive" onClick={onSubmitCancel}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={onSubmitConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
