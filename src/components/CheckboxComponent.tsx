import React from 'react';
import {
  Checkbox as ChakraCheckbox,
  CheckboxGroup,
  CheckboxProps as ChakraCheckboxProps,
  Stack,
  StackProps,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Controller, Control, FieldError, FieldValues } from 'react-hook-form';

interface CheckboxOption {
  label: string;
  value: string;
  colorScheme?: string; 
}

export type CheckboxGroupProps = {
  control: Control<FieldValues>;
  defaultValue?: string[];
  disabled?: boolean;
  // isInvalid?: boolean;
  options: CheckboxOption[];
  stackProps?: StackProps;
  groupLabel?: string;
  name: string;
  helperText?: string;
  rules?: any;
  error?: FieldError | undefined;
  onChange?: (value: string[]) => void;
} & ChakraCheckboxProps;

const CheckboxComponent: React.FC<CheckboxGroupProps> = ({
  control,
  defaultValue = [],
  disabled = false,
  // isInvalid = false,
  options,
  stackProps = {},
  groupLabel,
  name,
  helperText,
  rules,
  error,
  ...props
}) => {

  return (
    <FormControl isInvalid={error !== null}>
      {groupLabel && <FormLabel>{groupLabel}</FormLabel>}
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => (
          <CheckboxGroup {...field} value={field.value || []} onChange={props.onChange}>
            <Stack {...stackProps}>
              {options.map((option) => (
                <ChakraCheckbox
                  key={option.value}
                  value={option.value}
                  isDisabled={disabled}
                  isInvalid={error === null}
                  colorScheme={option.colorScheme}
                  {...props}
                >
                  {option.label}
                </ChakraCheckbox>
              ))}
            </Stack>
          </CheckboxGroup>
        )}
      />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>  }  
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default CheckboxComponent;
