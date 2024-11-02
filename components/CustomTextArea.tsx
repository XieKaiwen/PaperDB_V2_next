import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { FieldValues } from "react-hook-form";
import { CustomTextAreaProps } from "@/src/types/types";

export default function CustomTextArea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  textAreaClassName,
}: CustomTextAreaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              className={textAreaClassName}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
