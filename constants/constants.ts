import { edu_level, exam_type } from "@prisma/client";
export const debugStyle = { border: '1px solid red' };

export const educationLevelOptions = [
  { value: "P1", label: "Primary 1" },
  { value: "P2", label: "Primary 2" },
  { value: "P3", label: "Primary 3" },
  { value: "P4", label: "Primary 4" },
  { value: "P5", label: "Primary 5" },
  { value: "P6", label: "Primary 6" },
  { value: "S1", label: "Secondary 1" },
  { value: "S2", label: "Secondary 2" },
  { value: "S3", label: "Secondary 3" },
  { value: "S4", label: "Secondary 4" },
  { value: "J1", label: "JC 1" },
  { value: "J2", label: "JC 2" }
];

export const navRoutes = [
  { title: "Home", link: "/home" },
  { title: "Contact Us", link: "/contact-us" },
  { title: "Papers", link: "/papers" },
];


export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"]

export const MIN_QUESTION_PART_NUM = 1
export const MAX_QUESTION_PART_NUM = 50

export const questionIndex = [
  { value: "root", label: "-" },
  { value: "a", label: "a" },
  { value: "b", label: "b" },
  { value: "c", label: "c" },
  { value: "d", label: "d" },
  { value: "e", label: "e" },
  { value: "f", label: "f" },
  { value: "g", label: "g" },
  { value: "h", label: "h" },
  { value: "i", label: "i" },
  { value: "j", label: "j" },
  { value: "k", label: "k" },
  { value: "l", label: "l" },
  { value: "m", label: "m" },
  { value: "n", label: "n" },
  { value: "o", label: "o" },
  { value: "p", label: "p" },
  { value: "q", label: "q" },
  { value: "r", label: "r" },
  { value: "s", label: "s" },
  { value: "t", label: "t" },
  { value: "u", label: "u" },
  { value: "v", label: "v" },
  { value: "w", label: "w" },
  { value: "x", label: "x" },
  { value: "y", label: "y" },
  { value: "z", label: "z" }
];


export const questionSubIndex = [
  { value: "root", label: "-" },
  { value: "i", label: "i" },
  { value: "ii", label: "ii" },
  { value: "iii", label: "iii" },
  { value: "iv", label: "iv" },
  { value: "v", label: "v" },
  { value: "vi", label: "vi" },
  { value: "vii", label: "vii" },
  { value: "viii", label: "viii" },
  { value: "ix", label: "ix" },
  { value: "x", label: "x" }
];

export const schoolTypeMapToEduLevel = {
  Primary: ["P1", "P2", "P3", "P4", "P5", "P6"],
  Secondary: ["S1", "S2", "S3", "S4"],
  JC: ["J1", "J2"]
}

export const questionTypeOptions = [
  { value: "MCQ", label: "MCQ" },
  { value: "OEQ", label: "OEQ" },
]

export const examTypeEducationLevelMapping : {examType: string; enumValue: exam_type;educationLevel: edu_level[]}[] = [
  {
    examType: 'CA1',
    enumValue: 'CA1',
    educationLevel: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'] // Example levels, adjust as needed
  },
  {
    examType: 'CA2',
    enumValue: 'CA2',
    educationLevel: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']
  },
  {
    examType: 'SA1',
    enumValue: 'SA1',
    educationLevel: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']
  },
  {
    examType: 'SA2',
    enumValue: 'SA2',
    educationLevel: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']
  },
  {
    examType: 'PSLE',
    enumValue: 'PSLE',
    educationLevel: ['P6'] // PSLE is typically for Primary 6 students
  },
  {
    examType: 'WA',
    enumValue: 'WA',
    educationLevel: ['S1', 'S2', 'S3', 'S4'] // Example secondary levels, adjust as needed
  },
  {
    examType: 'SA',
    enumValue: 'SA',
    educationLevel: ['S1', 'S2', 'S3', 'S4']
  },
  {
    examType: 'O-level',
    enumValue: 'O_level',
    educationLevel: ['S4'] // Typically for Secondary 4 students
  },
  {
    examType: 'Common test',
    enumValue: 'Common_test',
    educationLevel: ['S1', 'S2', 'S3', 'S4']
  },
  {
    examType: 'Block test',
    enumValue: 'Block_test',
    educationLevel: ['S1', 'S2', 'S3', 'S4']
  },
  {
    examType: 'Prelim/Promo',
    enumValue: 'Prelim_Promo',
    educationLevel: ['J1', 'J2'] // For Junior College students
  },
  {
    examType: 'A-level',
    enumValue: 'A_level',
    educationLevel: ['J2'] // Typically for Junior College 2 students
  }
];

// Breakpoint constants
export const SM_BREAKPOINT = 640
export const MD_BREAKPOINT = 768
export const LG_BREAKPOINT = 1024
export const XL_BREAKPOINT = 1280
export const XXL_BREAKPOINT = 1536