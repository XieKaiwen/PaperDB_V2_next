import React from "react";
import ImageReader from "./addQuestionPage/ImageReader";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { removeImagesFromHtml } from "@/utils/utils";

interface QuestionLeafAnswerDisplayProps {
  questionType: string;
  isText?: boolean;
  content: string | File | { options: string[]; answer: string[] };
  width?: number;
  height?: number;
}

// TODO: provide a method for user to input a photo for the answer

const QuestionLeafAnswerDisplay = React.memo(function QuestionSectionDisplay({
  questionType,
  isText = true,
  content,
  width = 400,
  height = 400,
}: QuestionLeafAnswerDisplayProps) {
  if (questionType === "OEQ") {
    if (isText) {
      const rawHTML = marked.parse(content as string, {
        async: false,
        breaks: false,
        extensions: null,
        gfm: true,
        hooks: null,
        pedantic: false,
        silent: false,
        tokenizer: null,
        walkTokens: null,
      });
      const sanitisedHTML = DOMPurify.sanitize(rawHTML);
      // Remove any images in the sanitised HTML
      const processedHTML = removeImagesFromHtml(sanitisedHTML);

      return (
        <div
          className="w-full p-2 text-sm text-start break-words markdown-question-text text-red-700 border-2 border-red-500"
          dangerouslySetInnerHTML={{ __html: processedHTML }}
        ></div>
      );
    } else {
      return (
        <ImageReader
          content={content as File}
          width={width}
          height={height}
          className="border-4 border-red-500"
        />
      );
    }
  } else if (questionType === "MCQ") {
    // Only display the correct answer here
    const correctAnswersList = (
      content as { options: string[]; answer: string[] }
    ).answer as string[];
    const correctAnswerString = correctAnswersList.join(", ");

    const optionsList = (content as { options: string[]; answer: string[] })
      .options as string[];
    const optionsString = optionsList.join(", ");
    return (
      <>
        <p className="w-full text-sm text-start break-words markdown-question-text text-red-700 border-2 border-red-500 p-2">
          Options: {optionsString}
        </p>
        <p className="w-full text-sm text-start break-words markdown-question-text text-red-700 border-2 border-red-500 p-2">
          Answer: {correctAnswerString}
        </p>
      </>
    );
  }
});

export default QuestionLeafAnswerDisplay;
