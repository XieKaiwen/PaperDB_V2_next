import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Control, FieldPath } from 'react-hook-form';
import { authFormSchema } from "@/lib/utils";
import { z } from "zod";

const formSchema = authFormSchema('sign-up')

interface CustomSelectProps {
    control: Control<z.infer<typeof formSchema>>
    defaultValue: string
    name: FieldPath<z.infer<typeof formSchema>>
    label: string
    placeholder: string
    selectOptions: {[key: string] : string}
}

export default function CustomSelect({ control, name, defaultValue, label, placeholder, selectOptions } : CustomSelectProps) {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={defaultValue}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(selectOptions).map(([value, option]) => {
                    return <SelectItem key={option} value={value}>{option}</SelectItem>
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
