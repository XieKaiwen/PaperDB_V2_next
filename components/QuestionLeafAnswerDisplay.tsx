import React from "react";
import ImageReader from "./addQuestionPage/ImageReader";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { removeImagesFromHtml } from "@/utils/utils";

interface QuestionLeafAnswerDisplayProps {
  questionType: string;
  isText?: boolean;
  content: string | File | string[];
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
        <div className="border-4 border-red-500">
          <ImageReader
            content={content as File}
            width={width}
            height={height}
          />
        </div>
      );
    }
  } else if (questionType === "MCQ") {
    // Only display the correct answer here
    const correctAnswersList = content as string[];
    const correctAnswerString = correctAnswersList.join(", ");
    return (
      <p className="w-full text-sm text-start break-words markdown-question-text text-red-700">
        Answer: {correctAnswerString}
      </p>
    );
  }
});

export default QuestionLeafAnswerDisplay;
