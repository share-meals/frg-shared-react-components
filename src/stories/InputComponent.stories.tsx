import React, { useState } from "react";
import { Meta, Story } from "@storybook/react";
import { Box, Text, ChakraProvider} from "@chakra-ui/react";
import InputComponent, { InputComponentProps } from "../components/InputComponent";
import { ViewIcon } from "@chakra-ui/icons";
import { SubmitHandler, useForm } from "react-hook-form";

export default {
  title: "Components/InputComponent",
  component: InputComponent,
  argTypes: {
    type: {
      control: {
        type: "select",
        options: ["text", "password", "datetime", "color", "search", "file"],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["xs", "sm", "md", "lg"],
      },
    },
    variant: {
      control: {
        type: "select",
        options: ["outline", "unstyled", "flushed", "filled"],
      },
    },
  },
} as Meta;

const Template: Story<InputComponentProps> = (args) => {
  type FormValues = {
    [key: string]: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <ChakraProvider>
      <Box width="400px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputComponent {...args} control={control} error={errors[args.name]} />
          <button type="submit">Submit</button>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export const DefaultWithoutLabel = Template.bind({});
DefaultWithoutLabel.args = {
  type: "text",
  size: "md",
  variant: "outline",
  placeholder: "Enter text",
  name: "defaultInput"
};

export const DefaultWithLabel = Template.bind({});
DefaultWithLabel.args = {
  type: "text",
  size: "md",
  variant: "outline",
  label: "Default",
  placeholder: "Enter text",
  name: "defaultInput"
};

export const PasswordInput = Template.bind({});
PasswordInput.args = {
  type: "password",
  size: "md",
  variant: "outline",
  label: "Password",
  placeholder: "Enter password",
  name: "passwordInput",
};

export const TextInput = Template.bind({});
TextInput.args = {
  type: "text",
  size: "md",
  variant: "outline",
  label: "text",
  placeholder: "Enter text",
  name: "textInput",
};

export const DatetimeInput = Template.bind({});
DatetimeInput.args = {
  type: "datetime",
  size: "md",
  variant: "outline",
  label: "datetime",
  placeholder: "Enter datetime",
  name: "datetimeInput",
};

export const SearchInput = Template.bind({});
SearchInput.args = {
  type: "search",
  size: "md",
  variant: "outline",
  label: "search",
  placeholder: "Enter search",
  name: "searchInput",
};

export const FileInput = Template.bind({});
FileInput.args = {
  type: "file",
  size: "md",
  variant: "outline",
  label: "file",
  placeholder: "Enter file",
  name: "fileInput",
};

export const EmailInput = Template.bind({});
EmailInput.args = {
  type: "email",
  size: "md",
  variant: "outline",
  label: "email",
  placeholder: "Enter email",
  name: "emailInput",
};

export const NumberInput = Template.bind({});
NumberInput.args = {
  type: "number",
  size: "md",
  variant: "outline",
  label: "number",
  placeholder: "Enter number",
  name: "numberInput",
};

export const ControlledInput = () => {
  const [value, setValue] = useState("");
  type FormValues = {
    [key: string]: string;
  };

  const {
    control,
  } = useForm<FormValues>();

  return (
    <ChakraProvider>
      <>
        <Text mb="8px">Value: {value}</Text>
        <Box width="400px">
          <InputComponent
            control={control}
            type="text"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            placeholder="Controlled input"
            label="Controlled Input"
            name="controlledInput"
          />
        </Box>
      </>
    </ChakraProvider>
  );
};

export const SizedInputs = () => {
  const { control } = useForm();
  return (
    <Box>
      <Template control={control} {...{ type: "text", size: "xs", mb: "4", placeholder: "xs", name: "xs" }} />
      <Template control={control} {...{ type: "text", size: "sm", mb: "4", placeholder: "sm", name: "sm" }} />
      <Template control={control} {...{ type: "text", size: "md", mb: "4", placeholder: "md", name: "md" }} />
      <Template control={control} {...{ type: "text", size: "lg", placeholder: "lg", name: "lg" }} />
    </Box>
  );
};

export const Variants = () => {
  const { control } = useForm();
  return (
    <Box>
      <Template control={control} {...{ type: "text", variant: "outline", mb: "4", placeholder: "outline", name: "outline" }} />
      <Template control={control} {...{ type: "text", variant: "unstyled", mb: "4", placeholder: "unstyled", name: "unstyled" }} />
      <Template control={control} {...{ type: "text", variant: "flushed", mb: "4", placeholder: "flushed", name: "flushed" }} />
      <Template control={control} {...{ type: "text", variant: "filled", placeholder: "filled", name: "filled" }} />
    </Box>
  );
};

export const InputsWithAddons = () => {
  const { control } = useForm();
  return (
    <Box>
      <Template control={control} {...{ leftAddon: "https://", rightAddon: ".com", placeholder: "Enter your website", mb: "4", name: "website" }} />
      <Template control={control} {...{ leftAddon: "$", rightAddon: ".00", placeholder: "Enter the amount", type: "number", mb: "4", name: "amount" }} />
    </Box>
  );
};

export const InputsWithAddonsNoLabels = () => {
  const { control } = useForm();
  return (
    <Box>
      <Template control={control} {...{ leftAddon: "https://", rightAddon: ".com", placeholder: "Enter your website", mb: "4", name: "website" }} />
      <Template control={control} {...{ leftAddon: "$", rightAddon: ".00", placeholder: "Enter the amount", type: "number", mb: "4", name: "amount" }} />
    </Box>
  );
};

export const InputsWithElements = () => {
  const { control } = useForm();
  return (
    <Box>
      <Template control={control} {...{ leftElement: <ViewIcon />, placeholder: "Enter item to search", label: "Search", type: "search", mb: "4", name: "search" }} />
      <Template control={control} {...{ rightElement: <ViewIcon />, placeholder: "Enter your email", label: "Email", type: "email", name: "email" }} />
    </Box>
  );
};