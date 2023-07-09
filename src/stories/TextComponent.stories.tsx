import { FieldValues, useForm, SubmitHandler, FieldError } from 'react-hook-form';
import { Box, ChakraProvider, Button } from '@chakra-ui/react';
import { Meta, Story } from '@storybook/react';
import Text, { TextOrTextareaProps } from '../components/TextComponent';

export default {
  title: 'Components/TextComponent',
  component: Text,
} as Meta;

const Template: Story<TextOrTextareaProps> = (args) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FieldValues>({
      defaultValues: {
        [args.name]: args.defaultValue!,
      },
    });
  
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
      console.log(data);
    };
  
    return (
      <ChakraProvider>
        <Box width="300px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Text {...args} control={control} error={errors[args.name] as FieldError | undefined} />
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
    name: 'input',
    defaultValue: 'Default value',
    inputProps: {
      placeholder: 'Type here...',
    },
    rules: {
      required: 'This field is required',
    },
};
  
export const Multiline = Template.bind({});
Multiline.args = {
    ...Default.args,
    multiline: true,
    name: 'textarea',
    textareaProps: {
      placeholder: 'Type here...',
    },
};