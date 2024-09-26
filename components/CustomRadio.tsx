import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/utils/utils";
import { CustomRadioProps } from "@/types/types";
import { FieldValues } from "react-hook-form";

export default function CustomRadio<T extends FieldValues>({control, name, options, label, className, radioClassName } : CustomRadioProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          {label && <FormLabel className="text-sm font-semibold">{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn("flex flex-col space-y-1", radioClassName)}
            >
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
