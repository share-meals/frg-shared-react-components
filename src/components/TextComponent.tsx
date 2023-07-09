import React from 'react';
import { Textarea, Input, TextareaProps, InputProps, FormControl, FormErrorMessage } from '@chakra-ui/react';
import { Control, Controller, FieldError, FieldValues } from 'react-hook-form';

export interface TextOrTextareaProps {
  multiline?: boolean; 
  control: Control<FieldValues>;
  name: string;
  error?: FieldError | undefined;
  rules?: any;
  defaultValue?: string;
  inputProps?: InputProps;
  textareaProps?: TextareaProps;
}

const Text: React.FC<TextOrTextareaProps> = ({
  multiline = false,
  control,
  name,
  error,
  rules,
  defaultValue = '',
  inputProps,
  textareaProps,
}) => {
  return (
    <FormControl isInvalid={!!error}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => multiline 
          ? <Textarea isInvalid={!!error} {...textareaProps} {...field} /> 
          : <Input isInvalid={!!error} {...inputProps} {...field} />
        }
      />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default Text;