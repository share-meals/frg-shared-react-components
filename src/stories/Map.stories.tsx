import {
    useEffect,
    useState
} from 'react';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';
import {
    ComponentStory,
    ComponentMeta
} from '@storybook/react';
import {
    Map
} from '../components/Map';
import {
    Button,
    Box,
    ChakraProvider,
    Flex,
    IconButton,
    List,
    ListItem,
    Spacer,
    Text,
    theme,
    useClipboard
} from '@chakra-ui/react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';

export default {
    title: 'Components/Map',
    component: Map
} as ComponentMeta<typeof Map>;

import food_pantries from './data/food_pantries.json';
import soup_kitchens from './data/soup_kitchens.json';
import cpds from './data/cpds.json';
import cpd_truck from './data/cpd_truck.png';

const Renderer = ({data}: any) => {
    const {onCopy, value: clipboardValue, setValue: setClipboardValue, hasCopied} = useClipboard("");
    useEffect(() => {
	if(data !== null){
	    setClipboardValue(`${data.name}
${data.address}
${data.city}, ${data.state} ${data.zip}

${data.hours}${data.notes ? '\n\n' + data.notes : ''}`);
	}
    }, [JSON.stringify(data)]);
    if(data === null){
	return (
	    <>
		<Text>
		    Welcome to the City Harvest Resource Map! Here are all of the food pantries, soup kitchens, community partners. Click on any marker for more information.
		</Text>
	    </>
	);
    }else{
	return (
	    <>
		<Flex>
		    <Text>
			<strong>{data.name}</strong>
		    </Text>
		    <Spacer />
		    <Button
			isDisabled={hasCopied}
			onClick={onCopy}
			color='blue'
			size='xs'
		    >
			{hasCopied ? 'copied!' : 'copy'}
		    </Button>
		</Flex>
		<Text>
		    {data.address}
		</Text>
		<Text>
		    {data.city}, {data.state} {data.zip}
		</Text>
		<List mt={4}>
		    {data.hours.split('\n').map((hour: string) => <ListItem>{hour}</ListItem>)}
		</List>
		{data.notes &&
		 <Box mt={4}>
		     <ReactMarkdown
			 components={ChakraUIRenderer()}
			 children={data.notes}
			 skipHtml
		     />
		 </Box>
		}
	    </>
	);
    }
}

const Template: ComponentStory<typeof Map> = (args) =>
    <ChakraProvider theme={theme}>
	<div style={{height: '50vh'}}>
	    <Map
	    {...args}
	        layers={[
		    {
			name: 'Community Partner Distributions',
			geojson: cpds,
			color: '#23B0F0',
			icon: {
			    src: cpd_truck,
			    scale: 0.4
			}
		    },
		    {
			name: 'Food Pantries',
			geojson: food_pantries,
			color: '#64A70B'
		    },
		    {
			name: 'Soup Kitchens',
			geojson: soup_kitchens,
			color: '#FFD100'
		    }
		]}
		center={{
		    lat: 40.7127281,
		    lng: -74.0060152
		}}
		renderer={Renderer}
		onClick={console.log}
		routerUrl='http://router.project-osrm.org'
	    />
	</div>
    </ChakraProvider>
;

export const Primary = Template.bind({});

Primary.args = {
    geocoderPlatform: 'nominatim',
    geocoderUrl: 'https://nominatim.openstreetmap.org/search'
};

export const GoogleGeocoder = Template.bind({});

GoogleGeocoder.args = {
    geocoderPlatform: 'google'
};
