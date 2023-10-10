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
    formatDays,
    formatHour,
    isValid,
    IHours,
    IDictionary
} from './HoursFormatter';

export default {
    title: 'Utilities/HoursFormatter',
    component: Box
} as ComponentMeta<typeof Box>;


interface ITime {
    time_start: string,
    time_end?: string,
    time_zone: string
}

const TimeDisplay = ({
    time
}: {
    time: ITime
}) => {
    let payload_New_York = '';
    payload_New_York += formatHour({
	time: time.time_start,
	format: 'h:mmA',
	time_zone: time.time_zone,
	//time_zone_display: 'America/New_York'
    });
    if(time.time_end){
	payload_New_York += ' - ';
	payload_New_York += formatHour({
	    time: time.time_end,
	    format: 'h:mmA',
	    time_zone: time.time_zone,
	    //time_zone_display: 'America/New_York'
	});
    }
    let payload_Berlin = '';
    payload_Berlin += formatHour({
	time: time.time_start,
	format: 'h:mmA',
	time_zone: time.time_zone,
	time_zone_display: 'Europe/Berlin'
    });
    if(time.time_end){
	payload_Berlin += ' - ';
	payload_Berlin += formatHour({
	    time: time.time_end,
	    format: 'h:mmA',
	    time_zone: time.time_zone,
	    time_zone_display: 'Europe/Berlin'
	});
    }
    return <>
	{payload_New_York}
	<br />
	{payload_Berlin}
    </>
}

const HoursRow = ({
    hour,
    dictionary
}: {
    hour: IHours,
    dictionary: IDictionary
}) => {
    const days = hour.days ? formatDays({days: hour.days, dictionary}) : '';
    if(isValid(hour)){
	return (
	    <Tr>
		<Td>
		    <IconButton icon={<CheckIcon />} colorScheme='green' aria-label='valid' />
		</Td>
		<Td>
		    <Box display='block' whiteSpace='pre'>{JSON.stringify(hour, null, ' ')}</Box>
		</Td>
		<Td>
		    {days}
		</Td>
		<Td>
		    {hour.time_start !== null && hour.time_zone !== null && <TimeDisplay time={hour as ITime} />}
		</Td>
		<Td>
		    {hour.notes}
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
		    <Box display='block' whiteSpace='pre'>{JSON.stringify(hour, null, ' ')}</Box>
		</Td>
		<Td />
		<Td />
	    </Tr>
	);
    }
}


// @ts-ignore
const Template: ComponentStory<typeof Box> = (
    {
	hours,
	dictionary
    }: {
	hours: IHours[],
	dictionary: IDictionary
    }
) => {
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
			    hours.map((hour: IHours, index: number) => 
				<HoursRow key={index} hour={hour} dictionary={dictionary} />
			    )
			}
		    </Tbody>
		</Table>
	    </TableContainer>
	</ChakraProvider>
    );
};

const hoursData = [
    {
	days: 'x6',
	time_start: '12:00',
	time_end: '14:00',
	notes: null,
	time_zone: 'America/New_York'
    },
    {
	days: null,
	time_start: '9:00',
	time_end:'11:00',
	notes: 'Once a month, usually on Friday',
	time_zone: 'America/New_York'
    },
    {
	days: '1234',
	time_start: '10:00',
	time_end:'14:00',
	notes: null,
	time_zone: 'America/New_York'
    },
    {
	days: '5',
	time_start: '10:00',
	time_end: '12:00',
	notes: null,
	time_zone: 'America/New_York'
    },
    {
	days: '2',
	time_start: '11:30',
	time_end:'13:00',
	notes: '',
	time_zone: 'America/New_York'
    },
    {
	days: '14',
	time_start: '11:00',
	time_end: '13:00',
	notes: null,
	time_zone: 'America/New_York'
    },
    {
	days: '12345',
	time_start: null,
	time_end: null,
	notes: 'Eat-In Meals',
	time_zone: 'America/New_York'
    },
    {
	days: '12345',
	time_start: '12:00',
	time_end: '13:00',
	notes: 'Eat-In Meals',
	time_zone: 'America/New_York'
    },
    {
	days: '12345',
	time_start: '13:00',
	time_end: '13:30',
	notes: 'Grab-and-Go Meal Distribution',
	time_zone: 'America/New_York'
    },
    {
	days: '02345',
	time_start: '12:00',
	time_end: '13:00',
	notes: 'Eat-In Meals',
	time_zone: 'America/New_York'
    },
    {
	days: '12345',
	time_start: '13:00',
	time_end: '13:30',
	notes: 'Grab-and-Go Meal Distribution',
	time_zone: 'America/New_York'
    },
    {
	days: '123456',
	time_start: '9:00',
	time_end: '10:30',
	notes: 'Breakfast',
	time_zone: 'America/New_York'
    },
    {
	days: '123456',
	time_start: '11:00',
	time_end: '13:30',
	notes: null,
	time_zone: 'America/New_York'
    },
    {
	days: '123',
	time_start: '15:00',
	time_end: '13:30',
	notes: null,
	time_zone: 'America/New_York'
    }
];

export const Primary = Template.bind({});

Primary.args = {
    hours: hoursData,
    dictionary: {
	and: ' and ',
	comma: ', ',
	lastComma: ', and ',
	'1': 'Mondays',
	'2': 'Tuesdays',
	'3': 'Wednesdays',
	'4': 'Thursdays',
	'5': 'Fridays',
	'6': 'Saturdays',
	'7': 'Sundays'
    }
};
