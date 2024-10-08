import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
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
  label,
  description,
  emptySelectText,
  className,
  selectClassName,
}: CustomSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="mb-1">
            {label && (
              <FormLabel className="font-semibold text-sm">{label}</FormLabel>
            )}
            {description && <FormDescription> {description} </FormDescription>}
          </div>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            { selectOptions.length > 0 ? <SelectContent className={selectClassName}>
              {selectOptions.map((option) => {
                return (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                );
              })}
            </SelectContent> :
            <SelectContent className="text-sm text-slate-700 flex justify-center items-center">{emptySelectText}</SelectContent>
            }
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
