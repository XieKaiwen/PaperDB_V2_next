"use client";
import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { CustomPopoverMultipleCheckBoxProps } from "@/src/types/types";
import { FieldValues, UseControllerReturn } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CustomPopoverMultipleCheckBox<T extends FieldValues>({
  control,
  name,
  options,
  triggerText,
  emptyPopoverText,
  label,
  description,
  className,
}: CustomPopoverMultipleCheckBoxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  // Update the open state using the onOpenChange prop
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <div>
            {label && (
              <FormLabel className="font-semibold text-sm">{label}</FormLabel>
            )}
            {description && <FormDescription> {description} </FormDescription>}
          </div>
          <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild className="text-sm">
              <Button variant="outline">
                {triggerText} 
                {isOpen ? <ChevronUp className="ml-1" size={16} /> : <ChevronDown className="ml-1" size={16} />}
              </Button>
            </PopoverTrigger>
            { isOpen && (options.length > 0 ? <PopoverContent className="flex flex-col gap-2 max-h-56 overflow-auto">
              {options.map((option) => (
                <FormField
                  key={option.value}
                  control={control}
                  name={name}
                  render={({ field }: UseControllerReturn<T>) => {
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
                                      (value: string) => value !== option.value
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </PopoverContent> :
            <PopoverContent className="w-full text-sm text-slate-700 text-center"> {emptyPopoverText} </PopoverContent>)
          }
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
