import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CustomAddQuestionSelectProps } from "@/types/types";

export default function CustomAddQuestionSelect({
  control,
  name,
  placeholder,
  selectOptions,
}: CustomAddQuestionSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(selectOptions).map(
                ([value, option]: [string, string]) => {
                  return (
                    <SelectItem key={option} value={value}>
                      {option}
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
