import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { FieldValues } from "react-hook-form";
import { CustomInputProps } from "@/types/types";

export default function CustomInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  inputClassName
}:CustomInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label &&<FormLabel className="text-sm">{label}</FormLabel>}
          <FormControl>
            <Input className={inputClassName} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
