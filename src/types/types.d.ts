import { contentTypeSchema, imageQuestionPartSchema, questionPartSchema, textQuestionPartSchema } from "@/utils/add-question/addQuestionUtils(client)";
import { authFormSchema } from "@/utils/authFormUtils";
import { UserMetadata } from "@supabase/supabase-js";
import { FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Prisma, Subject } from "@prisma/client";
import { z } from "zod";

// Group type and interface together
declare type GetLoggedInResponse = {
  user: User | null;
  error: boolean;
};

declare type User = {
  id: string;
  email: string;
  dateJoined: string;
  educationLevel: string;
  phoneNumber: string;
  username: string;
};

declare type AddQuestionFormData = z.infer<typeof questionPartSchema>;

declare type AddQuestionFormDataSubscriber = (
  updatedFormData: AddQuestionFormData
) => void;
declare type AddQuestionQuestionContentJSONSubscriber = (
  updatedQuestionContentJSON: ProcessedQuestionContentCombinedJSON
) => void;

declare type FormQuestionPartWithText = {
  questionIdx: string;
  questionSubIdx: string;
  order: string;
  isText: true;
  text: string;
};

declare type FormQuestionPartWithImage = {
  questionIdx: string;
  questionSubIdx: string;
  order: string;
  isText: false;
  image: File;
};

declare type FormQuestionPart = FormQuestionPartWithText | FormQuestionPartWithImage;

declare type FormQuestionPartWithTextParsed = {
  questionIdx: string;
  questionSubIdx: string;
  order: number;
  isText: true;
  text: string;
};

declare type FormQuestionPartWithImageParsed = {
  questionIdx: string;
  questionSubIdx: string;
  order: number;
  isText: false;
  image: File;
};

declare type FormQuestionPartParsed = FormQuestionPartWithTextParsed | FormQuestionPartWithImageParsed;

declare type AddQuestionFormQuestionPart = {
  questionIdx: string;
  questionSubIdx: string;
  order: string;
  isText: true;
  text: string;
  id:string;
}| {
  questionIdx: string;
  questionSubIdx: string;
  order: string;
  isText: false;
  image: File;
  id:string;
}

type ProcessedQuestionPart = {
  isText: true;
  content: string;
  order?: number;
  id: string;
} | {
  isText: false;
  content: File;
  order?: number;
  id: string;
};

type ProcessedQuestionContentCombinedJSON = {
  questionContent: {
    root: ProcessedQuestionPart[];
    indexed: {
      [key: string]: {
        [subKey: string]: ProcessedQuestionPart[];
      };
    };
  };
  questionLeafs: { [key: string]: string[] } | null;
};

type ProcessedMCQQuestionAnswerJSON = {options: string[], answer: string[], mark: string}

type ProcessedOEQQuestionAnswerJSON = {
  [key:string]:{
    [subkey:string]:{ 
      answer: string|File,
      isText: boolean
      mark: string
    }
  }
}

type AddQuestionAnswerItem = { questionIdx: string; questionSubIdx: string; answer: string; isText: true; id: string, mark: string } | { id: string; questionIdx: string; questionSubIdx: string; answer: File; isText: false, mark:string } 

type PaperFilters = {
  year: "all" | string[];
  
}

//#####################################################################################
// This are the types used for preprocessing and finalising the questionContent, questionLeafs and questionAnswer
interface BaseQuestionIndex{
  questionIdx: string;
  questionSubIdx: string;
}
interface BaseQuestionAttributes{
  id: string
  order: string
}


interface BaseQuestionPart extends BaseQuestionIndex, BaseQuestionAttributes{}
interface BaseTextAttributes {
  isText: true;
  text: string
}
interface BaseImageAttributes {
  isText: false;
  image: string
}

interface QuestionPartOrderInt extends Omit<BaseQuestionPart, 'order'> {
  order: number;
}
interface BaseQuestionPartWithoutOrder extends Omit<BaseQuestionPart, 'order'> {}

interface BaseTextQuestionPart extends BaseQuestionPart, BaseTextAttributes {
}
interface BaseImageQuestionPart extends BaseQuestionPart, BaseImageAttributes {
}

type QuestionPart = BaseTextQuestionPart | BaseImageQuestionPart

// These are all with questionIdx and subIdx
interface TextQuestionPartOrderInt extends QuestionPartOrderInt, BaseTextAttributes {
}

interface ImageQuestionPartOrderInt extends QuestionPartOrderInt, BaseImageAttributes{
}

type QuestionPartWithOrderInt = TextQuestionPartOrderInt | ImageQuestionPartOrderInt  
type QuestionPartWithOrderIntArray = QuestionPartWithOrderInt[]

// Create ones that does not have questionIdx and questionSubIdx
interface TextQuestionPartOrderIntWithoutIdx extends Omit<QuestionPartOrderInt, 'questionIdx'|'questionSubIdx'>, BaseTextAttributes {
}

interface ImageQuestionPartOrderIntWithoutIdx extends Omit<QuestionPartOrderInt, 'questionIdx'|'questionSubIdx'>, BaseImageAttributes{
}

type QuestionPartWithOrderIntWithoutIdx = TextQuestionPartOrderIntWithoutIdx | ImageQuestionPartOrderIntWithoutIdx  
type QuestionPartWithOrderIntWithoutIdxArray = QuestionPartWithOrderIntWithoutIdx[]


interface FinalisedTextQuestionPart extends Omit<TextQuestionPartOrderIntWithoutIdx, 'order'>{}

interface FinalisedImageQuestionPart extends Omit<ImageQuestionPartOrderIntWithoutIdx, 'order'>{}

type FinalisedQuestionPart = FinalisedTextQuestionPart | FinalisedImageQuestionPart
type FinalisedQuestionPartArray = FinalisedQuestionPart[]

type QuestionContentWithOrder = {
  root: QuestionPartWithOrderIntWithoutIdxArray;
  indexed: {
    [key: string]: {
      [subKey: string]: QuestionPartWithOrderIntWithoutIdxArray;
    };
  }
}

type FinalisedQuestionLeafs = {
  [key: string]: string[]
} | null

type FinalisedQuestionContent = {
  root: FinalisedQuestionPartArray;
  indexed: {
    [key: string]: {
      [subKey: string]: FinalisedQuestionPartArray;
    };
  }
}

// Below are the types used for preprocessing and finalising the questionAnswer and markScheme
interface BaseOEQAnswerAttributes {
  questionIdx: string;
  questionSubIdx: string;
  mark: string
}

interface OEQImageAttributes {
  isText: false;
  image: string;
}
interface OEQTextAttributes {
  isText: true;
  text: string;
}

interface OEQImageAnswerItem extends BaseOEQAnswerAttributes, OEQImageAttributes {}
interface OEQTextAnswerItem extends BaseOEQAnswerAttributes, OEQTextAttributes {}

type OEQAnswerItemCombined = OEQImageAnswerItem | OEQTextAnswerItem

interface MCQAnswerItem {
  options: string[],
  answer: string[],
  mark: string
}
type MCQAnswerItemArray = MCQAnswerItem[]

type OEQAnswerArray = OEQAnswerItemCombined[]

type QuestionAnswerArray = OEQAnswerArray | MCQAnswerItemArray

interface FinalisedOEQImageAnswerItem extends Omit<OEQImageAnswerItem, 'questionIdx'|'questionSubIdx'> {
  mark:number
}
interface FinalisedOEQTextAnswerItem extends Omit<OEQTextAnswerItem, 'questionIdx'|'questionSubIdx'> {
  mark:number
}

type FinalisedOEQAnswerItem = FinalisedOEQImageAnswerItem | FinalisedOEQTextAnswerItem

type FinalisedMultiMCQQuestionAnswer = {
  options: string[],
  answer: string[],
} 
type FinalisedNonMultiMCQQuestionAnswer = {
  options: string[],
  answer: string,
}

type FinalisedOEQQuestionAnswer = {
  [key:string]:{
    [subkey:string]: FinalisedOEQAnswerItem
  }
}

type FinalisedQuestionAnswer = FinalisedMultiMCQQuestionAnswer | FinalisedNonMultiMCQQuestionAnswer | FinalisedOEQQuestionAnswer

type FinalisedMarkScheme = {
  [key:string]:{
    [subkey:string]: number // mark
  }
} | null

//#####################################################################################



declare interface AuthFormProps {
  type: "sign-up" | "login";
}

declare interface LoginProps {
  email: string;
  password: string;
}

declare interface SignUpProps {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  username: string;
  educationLevel: string;
  redirectedFrom: string;
}

declare interface SignUpUserMetadataProps {
  email: string;
  educationLevel: string;
  email_verified: boolean;
  phoneNumber: string;
  phone_verified: boolean;
  sub: string;
  username: string;
}

declare interface NavLinkProps {
  title: string;
  link: string;
  isActive: boolean;
  className?: string;
}

declare interface NavBarProps {
  user: UserMetadata;
}

declare interface MobileNavProps {
  user: UserMetadata;
}
// interface CustomAddQuestionTextAreaProps {
//   control: Control<z.infer<typeof questionPartSchema>>;
//   name: FieldPath<z.infer<typeof questionPartSchema>>;
//   placeholder: string;
// }

// interface CustomAddQuestionFileInputProps {
//   control: Control<z.infer<typeof questionPartSchema>>;
//   name: FieldPath<z.infer<typeof questionPartSchema>>;
// }

interface CustomAuthSelectProps {
  control: Control<z.infer<typeof authFormSchema>>;
  name: FieldPath<z.infer<typeof authFormSchema>>;
  label: string;
  placeholder: string;
  selectOptions: { [key: string]: string };
}

// interface CustomAddQuestionSelectProps {
//   control: Control<z.infer<typeof questionPartSchema>>;
//   name: FieldPath<z.infer<typeof questionPartSchema>>;
//   placeholder: string;
//   selectOptions: { [key: string]: string };
// }

interface CustomAuthInputProps {
  control: Control<z.infer<typeof authFormSchema>>;
  name: FieldPath<z.infer<typeof authFormSchema>>;
  label: string;
  placeholder: string;
}

// interface CustomAddQuestionInputProps {
//   control: Control<z.infer<typeof questionPartSchema>>;
//   name: FieldPath<z.infer<typeof questionPartSchema>>;
//   placeholder: string;
// }


interface CustomInputProps<T extends FieldValues> {
  control: Control<T>; // Make control generic
  name: Path<T>; // Use the generic type for name
  label?: string;
  placeholder: string;
  className?: string;
  inputClassName?: string;
}

interface CustomFileInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  inputClassName?: string;
}

interface CustomSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  selectOptions: { value: string; label: string }[];
  label?: string;
  description?: string;
  emptySelectText?: string;
  className?: string;
  selectClassName?: string;
}

interface CustomRadioProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: { value: string; label: string }[];
  label?: string;
  className?: string;
  radioClassName?: string;
}

interface CustomComboBoxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  commandPlaceholder: string;
  commandEmptyText: string;
  options: { value: string; label: string }[];
  onSelectChange: (name: Path<T>, value: unknown, config?: Object) => void;
  label?: string;
  description?: string;
  className?: string;
  selectClassName?: string;
}

interface CustomFormMultipleCheckBoxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: { value: string; label: string }[];
  label?: string;
  description?: string;
  className?: string;
}

interface QuestionPartInputProps<T extends FieldValues> {
  isText: boolean;
  control: Control<T>;
  id: string;
  index: number;
  deleteQuestionPart: (index: number) => void;
}

interface CustomPopoverMultipleCheckBoxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: { value: string; label: string }[];
  triggerText: string;
  emptyPopoverText: string;
  label?: string;
  description?: string;
  className?: string;
}

interface QuestionInfoInputProps{
  optionsDict: { [key: string]: { value: string; label: string }[] };
  className?: string;
}

