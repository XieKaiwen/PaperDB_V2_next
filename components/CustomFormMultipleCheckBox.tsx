import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import { CustomFormMultipleCheckBoxProps } from "@/types/types";
import { FieldValues, UseControllerReturn } from "react-hook-form";

export default function CustomFormCheckBox<T extends FieldValues>({
  control,
  name,
  options,
  label,
  description,
  className,
}: CustomFormMultipleCheckBoxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <div className="mb-4">
            {label && <FormLabel className="text-base">{label}</FormLabel>}
            {description && <FormDescription> {description} </FormDescription>}
          </div>
          {options.map((option) => (
            <FormField
              key={option.value}
              control={control}
              name={name}
              render={({ field } : UseControllerReturn<T>) => {
                return (
                  <FormItem
                    key={option.value}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.value])
                            : field.onChange(
                                field.value?.filter(
                                  (value : string) => value !== option.value
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{option.label}</FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
