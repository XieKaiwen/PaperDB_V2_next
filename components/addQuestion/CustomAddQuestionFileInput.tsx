import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { CustomAddQuestionFileInputProps } from "@/types/types";
import { Input } from "../ui/input";

export default function CustomAddQuestionFileInput({
  control,
  name,
}: CustomAddQuestionFileInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {/* <FormLabel>{label}</FormLabel> */}
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
