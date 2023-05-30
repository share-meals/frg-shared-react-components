import {
    ChakraProvider,
    theme
} from '@chakra-ui/react';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {
    Map
} from './components/Map';
import food_pantries from './components/data/food_pantries.json';
import soup_kitchens from './components/data/soup_kitchens.json';

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


function App() {
    return (
	<ChakraProvider theme={theme}>
	    <div style={{height: '100vh', width: '100vw'}}>
		<div style={{height: '50%', width: '50%', margin: 'auto'}}>
		<Map
		    layers={[
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
		    ]}
		    center={{
			lat: 40.7127281,
			lng: -74.0060152
		    }}
		    renderer={Renderer}
		    onClick={console.log}>
		</Map>
		</div>
	    </div>
	</ChakraProvider>
    );
}

export default App
