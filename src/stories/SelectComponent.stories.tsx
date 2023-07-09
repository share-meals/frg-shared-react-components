import React from 'react';
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';
import { Meta, Story } from '@storybook/react';
import SelectComponent, { SelectComponentProps } from '../components/SelectComponent';

export default {
  title: 'Components/SelectComponent',
  component: SelectComponent,
} as Meta;

const Template: Story<SelectComponentProps> = (args) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SelectComponent {...args} control={control} error={errors[args.name]} />
      <input type="submit" />
    </form>
  );
};

export const Default = Template.bind({});
Default.args = {
  name: 'options',
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  defaultValue: [{ label: 'Option 1', value: 'option1' }],
};

export const Multiple = Template.bind({});
Multiple.args = {
  ...Default.args,
  isMulti: true,
  defaultValue: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ],
  rules: {
    validate: (value: any) => {
      if (value.length === 0) {
        return 'At least one option must be selected';
      }
      return true;
    },
  },
};