import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CustomAddQuestionFileInputProps } from "@/types/types";
import { Input } from "../ui/input";

export default function CustomAddQuestionFileInput({
  control,
  index,
  label
}: CustomAddQuestionFileInputProps) {
  return (
    <FormField
      control={control}
      name={`questionPart.${index}.image`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="file"
              onChange={(e) => field.onChange(e.target.files?.[0])}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  );
}
