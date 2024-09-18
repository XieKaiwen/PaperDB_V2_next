import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { CustomFileInputProps } from "@/types/types";
import { Input } from "./ui/input";
import { FieldValues } from "react-hook-form";

export default function CustomFileInput<T extends FieldValues>({
  control,
  name,
  label,
  classname,
  inputClassName
}: CustomFileInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classname}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              type="file"
              className={inputClassName}
              onChange={(e) => field.onChange(e.target.files?.[0])}
            />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  );
}
