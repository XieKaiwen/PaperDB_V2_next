import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CustomSelectProps } from "@/src/types/types";
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
  const [isOpen, setIsOpen] = useState(false);

  // Update the open state using the onOpenChange prop
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Find the option that matches the current field value
        const selectedOption = selectOptions.find(
          (option) => option.value === field.value
        );

        return (
          <FormItem className={className}>
            <div className="mb-1">
              {label && (
                <FormLabel className="font-semibold text-sm">{label}</FormLabel>
              )}
              {description && <FormDescription>{description}</FormDescription>}
            </div>
            <Select
              onValueChange={field.onChange}
              // defaultValue={field.value}
              value={field.value}
              onOpenChange={handleOpenChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              {isOpen ? (
                selectOptions.length > 0 ? (
                  <SelectContent className={selectClassName}>
                    {selectOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                ) : (
                  <SelectContent className="text-sm text-slate-700 flex justify-center items-center">
                    {emptySelectText}
                  </SelectContent>
                )
              ) : (
                // Render only the matching option when not open
                <SelectContent className={selectClassName}>
                  {selectedOption && (
                    <SelectItem
                      key={selectedOption.value}
                      value={selectedOption.value}
                    >
                      {selectedOption.label}
                    </SelectItem>
                  )}
                </SelectContent>
              )}
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
