import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
  InputProps,
  InputGroupProps,
  InputAddonProps,
  InputElementProps,
  FormControlProps,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Control, Controller, FieldError } from "react-hook-form";

export interface InputComponentProps extends FormControlProps {
  control: Control;
  name: string;
  error?: FieldError;
    inputProps?: InputProps;
    groupProps?: InputGroupProps;
    leftAddon?: React.ReactNode;
    leftAddonProps?: InputAddonProps;
    rightAddon?: React.ReactNode;
    rightAddonProps?: InputAddonProps;
    leftElement?: React.ReactNode;
    leftElementProps?: InputElementProps;
    rightElement?: React.ReactNode;
    rightElementProps?: InputElementProps;
    type?: "text" | "password" | "datetime" | "color" | "search" | "file" | "email" | "number";
    size?: "xs" | "sm" | "md" | "lg";
    variant?: "outline" | "unstyled" | "flushed" | "filled";
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

const InputComponent: React.FC<InputComponentProps> = ({
    control,
    name,
    error,
    groupProps,
    leftAddon,
    leftAddonProps,
    rightAddon,
    rightAddonProps,
    leftElement,
    leftElementProps,
    rightElement,
    rightElementProps,
    type = "text",
    size = "md",
    variant = "outline",
    value,
    onChange,
    label,
    ...props
}) => {

    const [showPassword, setShowPassword] = useState(false);
    const handleClick = () => setShowPassword(!showPassword);

    const passwordToggle = (
        <button onClick={handleClick}>{showPassword ? <ViewOffIcon /> : <ViewIcon />}</button>
    );

         
    return (
        <FormControl>
            {label && <FormLabel>{label}</FormLabel>}
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <InputGroup {...groupProps}>
                        {leftAddon && <InputLeftAddon {...leftAddonProps}>{leftAddon}</InputLeftAddon>}
                        {leftElement && (
                            <InputLeftElement {...leftElementProps}>{leftElement}</InputLeftElement>
                        )}
                        <Input
                            {...props}
                            type={type === "password" && !showPassword ? "password" : type}
                            value={value}
                            onChange={onChange}
                        />
                        {rightElement && (
                        <InputRightElement {...rightElementProps}>
                            {type === "password" ? passwordToggle : rightElement}
                        </InputRightElement>
                        )}
                        {rightAddon && <InputRightAddon {...rightAddonProps}>{rightAddon}</InputRightAddon>}
                    </InputGroup>
                )}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
    );
};

export default InputComponent;
