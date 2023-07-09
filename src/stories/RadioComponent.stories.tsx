// src/stories/Radio.stories.tsx
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import RadioComponent, { RadioGroupProps } from '../components/RadioComponent';
import { useForm, FormProvider, FieldValues } from 'react-hook-form';
import { Button } from '@chakra-ui/react';

export default {
  title: 'Components/Radio',
  component: RadioComponent,
} as Meta;

const Template: Story<RadioGroupProps> = (args) => {
  const methods = useForm<FieldValues>({
    defaultValues: {
      options: args.defaultValue,
    },
    mode: 'onSubmit',
  });  
  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <ChakraProvider>
      <Box width="300px">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RadioComponent {...args} control={methods.control}/>
            <Button mt={3} type="submit" colorScheme="blue">
              Submit
            </Button>
          </form>
        </FormProvider>
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
    { label: 'Option 3', value: 'option3' },
  ],
  defaultValue: 'option1',
  helperText: 'This is helper text',
  validationRules: {
    required: 'This field is required',
  },
};

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {
  name: 'options',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  defaultValue: 'option1',
  helperText: 'This is helper text',
  validationRules: {
    required: 'This field is required',
  },
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  groupLabel: 'Options',
  name: 'options',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  defaultValue: 'option1',
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  name: 'options',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  defaultValue: 'option1',
};


export const Horizontal = Template.bind({});
Horizontal.args = {
  groupLabel: 'Options',
  name: 'options',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  defaultValue: 'option1',
  direction: 'row',
};

export const Vertical = Template.bind({});
Vertical.args = {
  groupLabel: 'Options',
  name: 'options',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  defaultValue: 'option1',
  direction: 'column',
};