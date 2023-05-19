import {
    useState
} from 'react';
import {
    ComponentStory,
    ComponentMeta
} from '@storybook/react';
import {
    Layer,
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



const PopupRenderer = ({
    data
}) => {
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

/*
	    <Layer
	    zIndex={1}
		id='food_pantries'
		name='Food Pantries'
		renderStyle={{
		type: 'circle',
		radius: 6,
		    stroke: {
			color: 'blue',
			width: 2
		    },
		    fill: {
			color: 'rgba(0, 0, 255, 0.2)'
		    }
		}}
		onClick={(event) => {console.log(event);}}
		PopupRenderer={PopupRenderer}
		geojson={food_pantries}
		key={1}
	    />

*/

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
    popupRenderer: PopupRenderer
};
