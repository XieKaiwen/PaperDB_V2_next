import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/utils/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { valuesIn } from "lodash";
import { CustomComboBoxProps } from "@/types/types";
import { FieldValues } from "react-hook-form";

// TODO Add types and props

/**Example data for shadcn
 * const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
    { value: "zh", label: "Chinese" },
  ];
 */

/**
 * My data passed into this will look more like
 * const subjects = [
 *   { value: *uuid*, label: "Mathematics" },]
 */

export default function CustomComboBox<T extends FieldValues>({
  control,
  name,
  options,
  onSelectChange,
  label,
  placeholder,
  className,
}: CustomComboBoxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormDescription>
            This is the language that will be used in the dashboard.
          </FormDescription>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {/* {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select language"} */}
                  {field.value
                        ? options.find(
                            (option) => option.value === field.value
                          )?.label
                        : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option.value}
                        key={option.value}
                        onSelect={() => {
                          // form.setValue("language", language.value);
                          onSelectChange(name, option.value);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            option.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
