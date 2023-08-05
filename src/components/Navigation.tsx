import {
    useNavigation,
} from './useNavigation';
import {
    Route,
    RouteLeg,
    RouteStep
} from 'osrm';

import {
    Box,
    Button,
    Flex,
    Icon,
    IconButton,
    ListItem,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    OrderedList,
    Select,
    Spacer,
    Text,
    useClipboard
} from '@chakra-ui/react';
import {
    MdDirectionsBike,
    MdDirectionsCar,
    MdDirectionsWalk
} from 'react-icons/md';
import {GeocoderInput} from './GeocoderInput';
import ILatLng from './interfaces/latlng';
import {Polyline} from 'ol/format';
// @ts-ignore
import osrmTextInstructions from 'osrm-text-instructions';
import {useState} from 'react';
import {LineString} from "ol/geom";

const polyReader = new Polyline();

const parseRoute = (route: Route): LineString => {
    const f = polyReader.readFeature(route.geometry);
    f.getGeometry()?.transform("EPSG:4326", "EPSG:3857");
    return f.getGeometry() as LineString;
}

const WalkIcon = <Icon as={MdDirectionsWalk} />;
const DriveIcon = <Icon as={MdDirectionsCar} />;
const BikeIcon = <Icon as={MdDirectionsBike} />;

export const Navigation = ({
    geocoderUrl,
    routerUrl,
    osrmVersion,
    language = 'en'
}: {
    geocoderUrl: string,
    routerUrl: string,
    osrmVersion: string,
    language?: string
}) => {
    const [directionsProfile, setDirectionsProfile] = useState('walking');
    const getTextDirections = osrmTextInstructions(osrmVersion);
    const {onCopy, value: clipboardValue, setValue: setClipboardValue, hasCopied} = useClipboard("");
    const [distance, setDistance] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);
    const {
	startAddress,
	setStartAddress,
	startCoords,
	setStartCoords,
	endAddress,
	endCoords,
	setRoute,
	instructions,
	setInstructions
    } = useNavigation();
    return (
	<>
	    <Flex align='center'>
	    <Text mr='4'>
		Get Directions
	    </Text>
	    <Menu>
		<MenuButton
		as={IconButton}
		icon={directionsProfile == 'walking' ? WalkIcon
		    : directionsProfile == 'biking' ? BikeIcon
		    : DriveIcon}
		variant='ghost'
		/>
		<MenuList>
		    <MenuItem icon={WalkIcon} onClick={() => setDirectionsProfile('walking')}>
			Walking
		    </MenuItem>
		    <MenuItem icon={BikeIcon} onClick={() => setDirectionsProfile('biking')}>
			Biking
		    </MenuItem>
		    <MenuItem icon={DriveIcon} onClick={() => setDirectionsProfile('driving')}>
			Driving
		    </MenuItem>
		</MenuList>
	    </Menu>
	    </Flex>
	    <GeocoderInput
		placeholder='Starting from ...'
		onGeocode={async (coordinates: ILatLng) => {
		    const coords = {lat: coordinates.lat, lng: coordinates.lng};
		    const routingResponse = await fetch(`${routerUrl}/route/v1/${directionsProfile}/${coords.lng},${coords.lat};${endCoords?.lng},${endCoords?.lat}?steps=true&annotations=true`);
		    const routingJson = await routingResponse.json();
		    if(routingJson.routes.length > 0){
			const route = routingJson.routes[0];
			const distance: string = `${Math.round(route.distance * 10 * 0.000621371) / 10}miles`;
			const duration: string = `${Math.round(route.duration * 10 / 60) / 10}min`;
			setDistance(distance);
			setDuration(duration);
			const instructionsArray: string[] = route.legs.map((leg: RouteLeg) => {
			    return leg.steps.map((step: RouteStep) => {
				return getTextDirections.compile(language, step);
			    });
			}).flat();
			setInstructions!(instructionsArray);
			
			const textInstructions = instructionsArray.map((instruction: string, index: number) => `${index + 1}. ${instruction}`).join('\n');
			const clipboardText = `${directionsProfile} directions from ${startAddress} to ${endAddress}
${duration} ${distance}

${textInstructions}`;
			setClipboardValue(clipboardText);
			const line: LineString = parseRoute(route);
			setRoute!(line);
			//setStartAddress(data.startAddress);
			//setStartCoords(coords);
		    }else{
			// todo: no route found
		    }
		}} />
	    {
		instructions !== null &&
		<>
		    <Box mt={8}>
			<Flex align='center'>
			    <Text>
				{duration} {distance}
			    </Text>
			    <Spacer />
			    <Button
				isDisabled={hasCopied}
				onClick={onCopy}
				size='xs'
			    >
				{hasCopied ? 'copied!' : 'copy'}
			    </Button>
			</Flex>
			<OrderedList>
			    {instructions.map((instruction: string, index: number) => <ListItem key={index}>{instruction}</ListItem>)}
			</OrderedList>
		    </Box>
		</>
	    }
	</>
    );
}
