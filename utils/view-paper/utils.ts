import { UnparsedPaperFilterProps } from '@/src/types/types';

function parseJSONToStringArray(jsonString: string): string[] {
  const parsedString = JSON.parse(jsonString);

  // Check if the parsed value is an array and if every element is a string
  if (Array.isArray(parsedString) && parsedString.every((element) => typeof element === 'string')) {
    return parsedString;
  } else {
    return []; // Return an empty array if the JSON string is not valid
  }
}

export function parsePaperSearchTablesParamsIntoFilters(
  { year, school, subject, examType, edul, users }: UnparsedPaperFilterProps,
  page: string,
  pageSize: string,
  visible: string,
  nonVisible: string,
) {
  const parsedYear = parseJSONToStringArray(year);
  const parsedSchool = parseJSONToStringArray(school);
  const parsedSubject = parseJSONToStringArray(subject);
  const parsedExamType = parseJSONToStringArray(examType);
  const parsedEdul = parseJSONToStringArray(edul);
  const parsedUsers = parseJSONToStringArray(users);

  const parsedPage = isNaN(parseInt(page)) ? 1 : parseInt(page);
  const parsedPageSize = isNaN(parseInt(pageSize)) ? 1 : parseInt(pageSize);

  const parsedFetchVisible = visible === 'true' ? true : false;
  const parsedFetchNonVisible = nonVisible === 'true' ? true : false;
  return {
    year: parsedYear,
    school: parsedSchool,
    subject: parsedSubject,
    examType: parsedExamType,
    edul: parsedEdul,
    users: parsedUsers,
    page: parsedPage,
    pageSize: parsedPageSize,
    fetchVisible: parsedFetchVisible,
    fetchNonVisible: parsedFetchNonVisible,
  };
}
