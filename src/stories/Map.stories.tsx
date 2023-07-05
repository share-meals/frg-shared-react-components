import {
    useEffect,
    useState
} from 'react';
import {
    ComponentStory,
    ComponentMeta
} from '@storybook/react';
import {
    Map
} from '../components/Map';
import {
    ChakraProvider,
    Box,
    Flex,
    IconButton,
    Spacer,
    Text,
    theme
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
import subway_lines from './data/subway_lines.json';
import green_truck from './data/green_truck.png';
import blue_truck from './data/blue_truck.png';

const Renderer = ({data}: any) => {
    const [page, setPage] = useState(0);
    if(data === undefined
       || data.length === 0){
	return (
	    <>
		These are the instructions.
	    </>
	);
    }else{
	return (
	    <>
		{data.length > 1 &&
		 <Flex>
		     <Spacer />
		     <IconButton
			 aria-label='previous page'
			 size='xs'
			 icon={<ChevronLeftIcon />}
			 isDisabled={page === 0}
			 onClick={() => {setPage(page - 1);}}
		     />
		     <Text ml='4' mr='4'>
			 {page + 1} of {data.length}
		     </Text>
		     <IconButton
			 aria-label='next page'
			 size='xs'
			 icon={<ChevronRightIcon />}
			 isDisabled={page === data.length - 1}
			 onClick={() => {setPage(page + 1);}}
		     />
		 </Flex>
		}
		<strong>{data[page].name}</strong>
		<br />
		{data[page].address}
		<br />
		{data[page].city}, {data[page].state} {data[page].zip}
	    </>
	);
    }
}

const Template: ComponentStory<typeof Map> = (args) =>
    <ChakraProvider theme={theme}>
	<div style={{height: '50vh'}}>
	    <Map {...args}>
	    </Map>
	</div>
    </ChakraProvider>
;

export const Primary = Template.bind({});

Primary.args = {
    layers: [
	{
	    name: 'Subway Lines',
	    geojson: subway_lines,
	    color: 'purple'
	},
	{
	    name: 'Food Pantries',
	    geojson: food_pantries,
	    color: 'red',
	    icon: {
		src: blue_truck,
		scale: 0.4
	    }
	},
	{
	    name: 'Soup Kitchens',
	    geojson: soup_kitchens,
	    color: 'blue'
	}
    ],
    center: {
	lat: 40.7127281,
	lng: -74.0060152
    },
    Renderer: Renderer,
    onClick: console.log
};
