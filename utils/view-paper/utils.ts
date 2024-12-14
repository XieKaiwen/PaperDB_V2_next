import { UnparsedPaperFilterProps } from "@/src/types/types";

function parseJSONToStringArray(jsonString: string): string[]{
    const parsedString = JSON.parse(jsonString);

    // Check if the parsed value is an array and if every element is a string
    if (Array.isArray(parsedString) && parsedString.every((element) => typeof element === 'string')) {
        return parsedString;
    } else {
        return []; // Return an empty array if the JSON string is not valid
    }
}

export function parseViewPaperSearchParamsIntoFilters({year, school, subject, examType, edul}: UnparsedPaperFilterProps) {
    const parsedYear = parseJSONToStringArray(year);
    const parsedSchool = parseJSONToStringArray(school);
    const parsedSubject = parseJSONToStringArray(subject);
    const parsedExamType = parseJSONToStringArray(examType);
    const parsedEdul = parseJSONToStringArray(edul);

    return {year: parsedYear, school: parsedSchool, subject: parsedSubject, examType: parsedExamType, edul: parsedEdul};
}