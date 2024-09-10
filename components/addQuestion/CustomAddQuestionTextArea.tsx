import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { CustomAddQuestionTextAreaProps } from "@/types/types";


export default function CustomAddQuestionTextArea({control, index, label, placeholder}:CustomAddQuestionTextAreaProps) {
  return (
    <FormField
      control={control}
      name={`questionPart.${index}.text`}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea className="" placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
