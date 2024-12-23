import React, { useState } from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/utils/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { CustomComboBoxProps } from '@/src/types/types';
import { FieldValues } from 'react-hook-form';

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
  description,
  placeholder,
  commandPlaceholder,
  commandEmptyText,
  className,
}: CustomComboBoxProps<T>) {
  // console.log(options);
  const [isOpen, setIsOpen] = useState(false);

  // Update the open state using the onOpenChange prop
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col', className)}>
          {label && <FormLabel className="text-sm font-semibold">{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
          <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger className="w-[200px] lg:w-[250px] xl:w-[300px]" asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-[250px] justify-between xl:w-[300px]',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value
                    ? options.find((option) => option.value === field.value)?.label
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            {isOpen && (
              <PopoverContent className="w-[200px] p-0 lg:w-[250px] xl:w-[300px]">
                <Command>
                  <CommandInput placeholder={commandPlaceholder} />
                  <CommandList>
                    <CommandEmpty>{commandEmptyText}</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          value={option.label}
                          key={option.value}
                          onSelect={() => {
                            // form.setValue("language", language.value);
                            onSelectChange(name, option.value);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              option.value === field.value ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            )}
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
