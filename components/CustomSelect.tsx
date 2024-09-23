import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CustomSelectProps } from "@/types/types";
import { FieldValues } from "react-hook-form";

export default function CustomSelect<T extends FieldValues>({
  control,
  name,
  placeholder,
  selectOptions,
  className,
  selectClassName
}: CustomSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={selectClassName}>
              {selectOptions.map(
                (option) => {
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  );
                }
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
