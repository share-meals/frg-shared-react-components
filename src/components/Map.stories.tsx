import {
    useState
} from 'react';
import {
    ComponentStory,
    ComponentMeta
} from '@storybook/react';
import {
    Map
} from './Map';
import {
    ChakraProvider,
    Box,
    theme
} from '@chakra-ui/react';

export default {
    title: 'Components/Map',
    component: Map
} as ComponentMeta<typeof Map>;
import food_pantries from './data/food_pantries.json';
import soup_kitchens from './data/soup_kitchens.json';



const Renderer = ({
    data
}: any // todo: better typing
) => {
    if(data === undefined){
	return (
	    <>
		These are the instructions.
	    </>
	);
    }else{
	return (
	    <>
		<strong>{data?.name}</strong>
		<br />
		{data?.address}
		<br />
		{data?.city}, {data?.state} {data?.zip}
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
	    name: 'Food Pantries',
	    geojson: food_pantries,
	    color: 'red'
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
    renderer: Renderer,
    onClick: console.log
};
