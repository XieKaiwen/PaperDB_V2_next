import React from 'react';
import ImageReader from './addQuestionPage/ImageReader';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { removeImagesFromHtml } from '@/utils/utils';

interface QuestionSectionDisplayProps {
  id: string;
  type?: 'normal' | 'answer';
  isText: boolean;
  content: string | File;
  width?: number;
  height?: number;
}

const QuestionSectionDisplay = React.memo(function QuestionSectionDisplay({
  id,
  type = 'normal',
  isText,
  content,
  width = 400,
  height = 400,
}: QuestionSectionDisplayProps) {
  const additionalStyle = type === 'normal' ? {} : { border: '5px solid red' };

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
        className="markdown-question-text w-full break-words text-start text-sm"
        dangerouslySetInnerHTML={{ __html: processedHTML }}
        style={additionalStyle}
      ></div>
    );
  } else {
    return (
      <div style={additionalStyle}>
        <ImageReader content={content as File} width={width} height={height} key={id} />
      </div>
    );
  }
});

export default QuestionSectionDisplay;
