import React from 'react';
import {
  Radio as ChakraRadio,
  RadioGroup,
  RadioProps as ChakraRadioProps,
  Stack,
  StackProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Controller, Control, FieldError, FieldValues } from 'react-hook-form';

interface RadioOption {
  label: string;
  value: string;
}

export type RadioGroupProps = {
  control: Control<FieldValues>;
  defaultValue?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  options: RadioOption[];
  stackProps?: StackProps;
  groupLabel?: string;
  name: string;
  helperText?: string;
  error?: FieldError;
  validationRules?: any;
  direction?: 'row' | 'column';
} & ChakraRadioProps;

const RadioComponent: React.FC<RadioGroupProps> = ({
  control,
  defaultValue = '',
  disabled = false,
  isInvalid = false,
  options,
  stackProps = {},
  groupLabel,
  name,
  helperText,
  error,
  validationRules,
  direction = 'column',
  ...props
}) => {
  return (
    <FormControl id={name} isInvalid={isInvalid || !!error}>
      {groupLabel && <FormLabel>{groupLabel}</FormLabel>}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={validationRules}
        render={({ field }) => (
          <RadioGroup {...field} value={field.value || ''}>
            <Stack direction={direction} {...stackProps}>
              {options.map((option) => (
                <ChakraRadio
                  key={option.value}
                  value={option.value}
                  isDisabled={disabled}
                  {...props}
                >
                  {option.label}
                </ChakraRadio>
              ))}
            </Stack>
          </RadioGroup>
        )}
      />
      <FormErrorMessage>{error?.message || helperText}</FormErrorMessage>
    </FormControl>
  );
};

export default RadioComponent;