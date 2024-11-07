import { questionPartSchema } from "@/utils/addQuestionUtils";
import { authFormSchema } from "@/utils/authFormUtils";
import { UserMetadata } from "@supabase/supabase-js";
import { FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Prisma, Subject } from "@prisma/client";

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
  id: string;
} | {
  isText: false;
  content: File;
  id: string;
};

type ProcessedQuestionContentCombinedJSON = {
  questionContent: {
    root: ProcessedQuestionContent[];
    indexed: {
      [key: string]: {
        [subKey: string]: ProcessedQuestionContent[];
      };
    };
  };
  questionLeafs: { [key: string]: string[] } | null;
};

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

interface ImageReaderProps {
  content: File,
  width: number,
  height: number
}