import React from 'react';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input as ChakraInput
} from '@chakra-ui/react';

type props_type = {
    label: string,
    helper_text: string
};

export default function Input({
    label,
    helper_text
}: props_type){
    return (
	<FormControl variant='floating'>
	    {/* It is important that the Label comes after the Control due to css selectors */}
	    <ChakraInput />
	    {label &&
	     <FormLabel>
		 {label}
	     </FormLabel>}
	    {helper_text &&
	     <FormHelperText>
		 {helper_text}
	     </FormHelperText>
	    }
	</FormControl>
    );
}
