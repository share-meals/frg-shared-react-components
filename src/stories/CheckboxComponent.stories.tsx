import React from 'react';
import { FieldValues, useForm, SubmitHandler, FieldError } from 'react-hook-form';
import { Meta, Story } from '@storybook/react';
import { Box, ChakraProvider, Button } from '@chakra-ui/react';
import CheckboxComponent, { CheckboxGroupProps } from '../components/CheckboxComponent';

export default {
  title: 'Components/CheckboxComponent',
  component: CheckboxComponent,
} as Meta;

const Template: Story<CheckboxGroupProps> = (args) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      options: args.defaultValue!,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  console.log('control: ', control);

  return (
    <ChakraProvider>
      <Box width="300px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CheckboxComponent {...args} control={control} error={errors[args.name] as FieldError | undefined} />
          <Button type="submit" mt="4">
            Submit
          </Button>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  groupLabel: 'Options',
  name: 'options',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    {label: 'Option 3', value: 'option3' },
  ],
  defaultValue: ['option1'],
  helperText: 'Choose one or more options',
  rules: { required: 'At least one option must be selected' },
  onChange: (values: string) => console.log(values), 
};

export const Disabled = Template.bind({});
Disabled.args = {
  groupLabel: 'Options',
  name: 'options',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    {label: 'Option 3', value: 'option3' },
  ],
  defaultValue: ['option1'],
  helperText: 'Choose one or more options',
  rules: { required: 'At least one option must be selected' },
  disabled: true, 
};

export const Colored = Template.bind({});
Colored.args = {
  groupLabel: 'Options',
  name: 'options',
  options: [
    { label: 'Option 1', value: 'option1', colorScheme: 'red' },
    { label: 'Option 2', value: 'option2', colorScheme: 'green' },
    { label: 'Option 3', value: 'option3', colorScheme: 'blue' },
  ],
  defaultValue: ['option1'],
  helperText: 'Choose one or more options',
  rules: { required: 'At least one option must be selected' },
};

