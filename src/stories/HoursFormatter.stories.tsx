import {
    ComponentStory,
    ComponentMeta
} from '@storybook/react';
import {
    Box,
    ChakraProvider,
    IconButton,
    Table,
    TableContainer,
    Tbody,
    Text,
    Th,
    Thead,
    Td,
    Tr,
    theme,
} from '@chakra-ui/react';

import {
    CloseIcon,
    CheckIcon
} from '@chakra-ui/icons';

import {
    hoursIsValid,
    hoursParse
} from '../components/HoursParser';

export default {
    title: 'Utilities/HoursParser',
    component: Box
} as ComponentMeta<typeof Box>;

const HoursRow = ({text}: {text: string}) => {
    const results = hoursParse(text);
    if(hoursIsValid(text)){
	return results.map(({days, hours, notes}: {days: string, hours: string, notes: string}, index: number) =>
	    <Tr key={index}>
		<Td>
		    {index === 0 && <IconButton icon={<CheckIcon />} colorScheme='green' aria-label='valid' />}
		</Td>
		<Td>
		    {index === 0 ? text.split('\n').map(h => <Text key={h}>{h}</Text>) : ''}
		</Td>
		<Td>
		    {days}
		</Td>
		<Td>
		    {hours}
		</Td>
		<Td>
		    {notes}
		</Td>
	    </Tr>
	);
    }else{
	return(
	    <Tr>
		<Td>
		    <IconButton icon={<CloseIcon />} colorScheme='red' aria-label='invalid' />
		</Td>
		<Td>
		    {text.split('\n').map(h => <Text key={h}>{h}</Text>)}
		</Td>
		<Td>

		</Td>
		<Td>

		</Td>
		<Td>

		</Td>
	    </Tr>
	);
    }
}

// @ts-ignore
const Template: ComponentStory<typeof Box> = ({hours}: {hours: string[]}) => {
    return (
	<ChakraProvider theme={theme}>
	    <TableContainer>
		<Table>
		    <Thead>
			<Tr>
			    <Td>

			    </Td>
			    <Td>
				input
			    </Td>
			    <Td>
				days
			    </Td>
			    <Td>
				hours
			    </Td>
			    <Td>
				notes
			    </Td>
			</Tr>
		    </Thead>
		    <Tbody>
			{
			    hours.map((text: string, index: number) => <HoursRow key={index} text={text} />)
			}
		    </Tbody>
		</Table>
	    </TableContainer>
	</ChakraProvider>
    );
};

export const Primary = Template.bind({});

Primary.args = {
    hours: [
	`Sa 12:00PM-02:00PM`,
	`09:00AM-11:00PM "Once a Month, Usually on Friday"`,
	`Mo-Th 10:00AM-02:00PM
Fr 10:00AM-12:00PM`,
	`Tu 11:30AM-01:00PM
Mo,Th 11:00AM-01:00PM`,
	`Mo-Fr "Eat-In Meals"`,
	`Mo-Fr 12:00PM-01:00PM "Eat-In Meals"
Mo-Fr 01:00PM-01:30PM "Grab-and-Go Meal Distribution"`,
	`Mx-Fr 12:00PM-01:00PM "Eat-In Meals"
Mo-Fr 01:00PM-01:30PM "Grab-and-Go Meal Distribution"`,
	`Mo-Sa 09:00AM-10:30AM "Breakfast"
Mo-Sa 11:30AM-01:30PM`
    ]
};
