import InputComponent from './InputComponent';
import {
    useNavigation,
} from './useNavigation';
import {useForm} from 'react-hook-form';
import {
    useEffect,
    useState
} from 'react';
import {
    Button,
    Divider,
    Text
} from '@chakra-ui/react';
import { Polyline } from 'ol/format';

const polyReader = new Polyline();

const parseRoute = (routes) => {
  if (routes && routes.length > 0) {
    const f = polyReader.readFeature(routes[0].geometry);
    f.getGeometry().transform("EPSG:4326", "EPSG:3857");
    return f.getGeometry() as LineString;
  }
  return null;
}

export const Navigation = ({
    geocoder_url,
    router_url
}) => {
    const {control, handleSubmit} = useForm({
	defaultValues: {
	    startAddress: ''
	}
    });
    const {startAddress, setStartAddress, startCoords, setStartCoords, endAddress, endCoords, setRoute} = useNavigation();
    const [loading, setLoading] = useState(false);
    const onSubmit = handleSubmit(async (data) => {
	setLoading(true);
	// todo: error checking
	const geocoder_response = await fetch(`${geocoder_url}?q=${data.startAddress}&limit=1&format=json`);
	const geocoder_json = await geocoder_response.json();
	const coords = {lat: geocoder_json[0].lat, lng: geocoder_json[0].lon};

	const routing_response = await fetch(`${router_url}/route/v1/driving/${coords.lng},${coords.lat};${endCoords.lng},${endCoords.lat}?steps=true&annotations=true`);
	const routing_json = await routing_response.json();
	const line = parseRoute(routing_json.routes);
	setRoute(line);
	setStartAddress(data.startAddress);
	setStartCoords(coords);
	setLoading(false);
    });
    return (
	<>
	    <Divider my='4' />
	    <Text textAlign='center'>
		Get Directions
	    </Text>
	    <form onSubmit={onSubmit}>
		<InputComponent
		control={control}
		disabled={loading}
		variant={loading ? 'filled' : 'outline'}
		label='Start Address'
		name='startAddress'
		type='text'
		    rightElement={
			<Button
			    colorScheme='green'
			    isLoading={loading}
			    type='submit'>
			    Go
			</Button>
			
		    }
		/>
	    </form>
	</>
    );
    return (
	<PromptStartAddress {...{geocoder_url}} />
    );
}
