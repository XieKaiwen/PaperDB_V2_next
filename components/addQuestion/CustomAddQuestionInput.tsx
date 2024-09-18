import { CustomAddQuestionInputProps } from "@/types/types";
import React from "react";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export default function CustomAddQuestionInput({control, name, placeholder}:CustomAddQuestionInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <Input  placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
