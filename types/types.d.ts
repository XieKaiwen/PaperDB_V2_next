import { questionPartSchema } from "@/utils/addQuestionUtils";
import { authFormSchema } from "@/utils/utils";

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
    user: User
}

declare interface MobileNavProps {
    user: User
}
interface CustomAddQuestionTextAreaProps {
  control: Control<z.infer<typeof questionPartSchema>>
  name: FieldPath<z.infer<typeof questionPartSchema>>
  placeholder: string
}

interface CustomAddQuestionFileInputProps {
  control: Control<z.infer<typeof questionPartSchema>>
  name: FieldPath<z.infer<typeof questionPartSchema>>
}

interface CustomAuthSelectProps {
  control: Control<z.infer<typeof authFormSchema>>;
  name: FieldPath<z.infer<typeof authFormSchema>>;
  label: string;
  placeholder: string;
  selectOptions: { [key: string]: string };
}

interface CustomAddQuestionSelectProps {
  control: Control<z.infer<typeof questionPartSchema>>;
  name: FieldPath<z.infer<typeof questionPartSchema>>;
  placeholder: string;
  selectOptions: { [key: string]: string };
}

interface CustomAuthInputProps {
  control: Control<z.infer<typeof authFormSchema>>
  name: FieldPath<z.infer<typeof authFormSchema>>
  label: string
  placeholder: string
}

interface CustomAddQuestionInputProps {
  control: Control<z.infer<typeof questionPartSchema>>
  name: FieldPath<z.infer<typeof questionPartSchema>>
  placeholder: string
}

interface AddQuestionFormProps {
  onFormChange: Dispatch<SetStateAction<{}>>
}