import React from 'react';
import { Controller, Control } from 'react-hook-form';
import Select from 'react-select';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';

interface OptionType {
  label: string;
  value: string;
}

export interface SelectComponentProps {
  control: Control;
  name: string;
  options: OptionType[];
  defaultValue?: OptionType[];
  isMulti?: boolean;
  rules?: any;
  error?: any;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ control, name, options, defaultValue, isMulti, rules, error }) => {
  return (
    <FormControl isInvalid={!!error}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti={isMulti}
            closeMenuOnSelect={!isMulti}
            defaultValue={defaultValue}
          />
        )}
      />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default SelectComponent;