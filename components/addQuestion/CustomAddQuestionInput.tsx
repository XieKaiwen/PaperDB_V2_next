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
        <FormItem>
          <FormControl>
            <Input className="lg:w-2/3" placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
