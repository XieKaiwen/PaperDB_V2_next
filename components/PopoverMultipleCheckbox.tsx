'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PopoverMultipleCheckboxProps {
  label: string;
  options: { value: string; label: string }[];
  checkedOptions: string[];
  onCheckChange: Dispatch<SetStateAction<string[]>>;
}

export default function PopoverMultipleCheckbox({
  label,
  options,
  checkedOptions,
  onCheckChange,
}: PopoverMultipleCheckboxProps) {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    onCheckChange((prev: string[]) => {
      if (checked) {
        if (prev.includes(optionValue)) {
          return prev;
        }
        return [...prev, optionValue];
      }
      return prev.filter((item) => item !== optionValue);
    });
  };

  return (
    <div className="space-y-2">
      <div className="font-medium">{label}</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-32">
            {checkedOptions.length > 0 ? `${checkedOptions.length} selected` : 'Select...'}
            {open ? (
              <ChevronUp className="ml-1" size={16} />
            ) : (
              <ChevronDown className="ml-1" size={16} />
            )}
          </Button>
        </PopoverTrigger>
        {open &&
          (options.length > 0 ? (
            <PopoverContent className="min-w-56 space-y-2 p-2">
              {options.map((option) => {
                const isChecked = checkedOptions.includes(option.value);
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(option.value, checked === true)
                      }
                      id={`checkbox-${option.value}`}
                    />
                    <label htmlFor={`checkbox-${option.label}`} className="cursor-pointer text-sm">
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </PopoverContent>
          ) : (
            <PopoverContent className="w-full text-center text-sm text-slate-700">
              {' '}
              No options available...{' '}
            </PopoverContent>
          ))}
      </Popover>
    </div>
  );
}

export const MemoizedPopoverMultipleCheckbox = React.memo(PopoverMultipleCheckbox);
