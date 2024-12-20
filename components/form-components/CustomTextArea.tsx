import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Control, FieldValues, Path } from "react-hook-form";


interface CustomTextAreaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder: string;
  className?: string;
  textAreaClassName?: string;
}


const CustomTextArea = React.memo(
  function CustomTextArea<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    className,
    textAreaClassName,
  }: CustomTextAreaProps<T>) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Textarea
                className={textAreaClassName}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
) as <T extends FieldValues>(props: CustomTextAreaProps<T>) => JSX.Element;


export default CustomTextArea;