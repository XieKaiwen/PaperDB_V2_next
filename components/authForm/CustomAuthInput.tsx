import React from "react";
import { FormControl, FormField, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { authFormSchema } from "@/utils/authFormUtils";
import { CustomAuthInputProps } from "@/src/types/types";

const formSchema = authFormSchema('sign-up')



export default function CustomInput({control, name, label, placeholder}:CustomAuthInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <FormLabel className="text-sm">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                type={(name === "password" || name ==="confirmPassword") ? 'password' : 'text'}
                {...field}
              />
            </FormControl>
            <FormMessage className="mt-2 w-full text-xs" />
          </div>
        </div>
      )}
    />
  );
}
