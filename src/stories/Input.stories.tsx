import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Input from './Input';

export default {
    title: 'Input',
    component: Input,
    argTypes: {

    }
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};

export const WithLabel = Template.bind({});
WithLabel.args = {
    label: 'input label'
};

export const WithHelperText = Template.bind({});
WithHelperText.args = {
    helper_text: 'this is helper text'
};
