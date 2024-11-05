import React from "react";
import ImageReader from "./addQuestionPage/ImageReader";
import { marked } from "marked";
import DOMPurify from 'dompurify';
import { removeImagesFromHtml } from "@/utils/utils";

interface QuestionSectionDisplayProps {
  id: string;
  isText: boolean;
  content: string | File;
  width?: number;
  height?: number;
}

const QuestionSectionDisplay = React.memo(function QuestionSectionDisplay({
  id,
  isText,
  content,
  width = 400,
  height = 400,
}: QuestionSectionDisplayProps) {


  if (isText) {

    const rawHTML = marked.parse(content as string, {
      "async": false,
      "breaks": false,
      "extensions": null,
      "gfm": true,
      "hooks": null,
      "pedantic": false,
      "silent": false,
      "tokenizer": null,
      "walkTokens": null
     });
    const sanitisedHTML = DOMPurify.sanitize(rawHTML)
    // Remove any images in the sanitised HTML
    const processedHTML = removeImagesFromHtml(sanitisedHTML)

    return (
      <div
        className="w-full text-sm text-start whitespace-pre-wrap break-words markdown-question-text"
        dangerouslySetInnerHTML={{ __html: processedHTML }}
      >
      </div>
    );
  } else {
    return (
      <ImageReader
        content={content as File}
        width={width}
        height={height}
        key={id}
      />
    );
  }
});

export default QuestionSectionDisplay;
