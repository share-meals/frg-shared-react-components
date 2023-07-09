/*
Use icons from style guide
Accessibility --> ability to increase text size?
Mobile friendly?  
Icons should resize based on view  
X Are the subway lines necessary?  
Possible to include a 'Get directions' Google Map link in the popup windows?


*/


import {
    Box,
    Button,
    Checkbox,
    CloseButton,
    Flex,
    HStack,
    IconButton,
    Modal,
    ModalContent,
    ModalOverlay,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    Spacer,
    Text,
    VStack,
    useDisclosure,
    useMediaQuery
} from '@chakra-ui/react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    HamburgerIcon
} from '@chakra-ui/icons';
import {
    fromLonLat,
    toLonLat
} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import {Navigation} from './Navigation';
import {Point} from "ol/geom";
import {
    RCircle,
    RFill,
    RIcon,
    RStroke,
    RStyle,
} from 'rlayers/style';
import {
    RControl,
    RFeature,
    RLayerTile,
    RLayerVector,
    RMap,
    ROverlay,
} from 'rlayers';
import {
    ReactElement,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    NavigationProvider,
    useNavigation
} from './useNavigation';

import './Map.css';
import 'ol/ol.css';

const generateStyle = ({
    color,
    type,
    icon,
    radius = 10
}: any) => {
    switch(type){
	case 'Point':
	    if(icon === undefined){
		return (
		    <RStyle>
			<RCircle radius={8}>
			    <RStroke color='white' width='4' />
			    <RFill color={color} />
			</RCircle>
		    </RStyle>
		);
	    }else{
		return (
		    <RStyle>
			<RIcon
			src={icon.src}
			scale={icon.scale}
			/>
		    </RStyle>
		);
	    }
	    break;
	case "LineString":
	    return (
		<RStyle>
		    <RStroke color={color} width={3} />
		</RStyle>
	    );
	    break;
	case 'EmptyCircle':
	    return (
		<RStyle>
		    <RCircle radius={radius}>
			<RStroke color={color} />
		    </RCircle>
		</RStyle>
	    );
	default:
	    return (
		<RStyle>
		    <RCircle radius={radius}>
			<RFill color={color} />
		    </RCircle>
		</RStyle>
	    );
    }
}

export const Map = (props) => {
    return (
	<NavigationProvider>
	    <MapComponent {...props} />
	</NavigationProvider>
    );
}

const MapComponent = ({
    center = {
	lat: 0,
	lng: 0
    },
    geocoder_url = null,
    layers = [],
    renderer = () => {},
    router_url = null,
    zoom = 11,
    spotlight_color = 'red',
    onClick
}: any // todo: better typing
) => {
    const [popupData, setPopupData] = useState([]);
    const {spotlight, route} = useNavigation();
    const {isOpen: isModalOpen, onOpen: openModal, onClose: closeModal} = useDisclosure();
    const [isDesktop] = useMediaQuery('(max-width: 900px)');
    const features = useMemo(() => {
	return layers.map((
	    layer: any // todo: better typing
	) => {
	    const features = new GeoJSON({
		featureProjection: 'EPSG:3857',
            }).readFeatures(layer.geojson);
	    for(const feature of features){
		feature.setProperties({
		    layerName: layer.name
		});
	    }
	    return features;
	});
    }, []);
    const [visibleLayers, setVisibleLayers] = useState(Object.fromEntries(Object.values(layers).map((
	layer: any // todo: better typing
    ) =>
	[
	    layer.name,
	    {
		name: layer.name,
		visible: true,
		color: layer.color,
		icon: layer.icon,
		type: layer.geojson.features[0].geometry.type
	    }
	]
    )));
    const layerToggles: ReactElement[] = useMemo(() => {
	return Object.values(visibleLayers).map((
	    {color, name}: any, // todo: better typing
	    index: number
	) => 
	    <Checkbox
		defaultChecked
		colorScheme='whiteAlpha'
		iconColor={color}
		key={name}
		onChange={(e) => {
		    setVisibleLayers({
			...visibleLayers,
			[name]: {
			    ...visibleLayers[name],
			    visible: e.target.checked
			}
		    });
		}}>
		{name}
	    </Checkbox>
	);
    }, [visibleLayers]);
    const [view, setView] = useState({
	center: fromLonLat([center.lng, center.lat]),
	zoom: zoom
    });

    const layersRendered = useMemo(() => {
	return (Object.values(visibleLayers).map((
	    layer: any, // todo: better typing
	    index: number
	) =>
	    <RLayerVector
		key={layer.name}
		features={features[index]}
		visible={layer.visible}
	    >
		{generateStyle({
		    color: layer.color,
		    type: layer.type,
		    icon: layer.icon
		})}
	    </RLayerVector>
	)).reverse();
    }, [features, visibleLayers]);
    return (
	<HStack h='100%' className='sm_frg'>
	    <Box w={isDesktop ? '67%' : '100%'} h='100%'>
		<RMap
		    height='100%'
		    width='100%'
		    initial={view}
		    view={[view, setView]}
		    onClick={(event) => {
			const features = event.map.getFeaturesAtPixel(event.pixel);
			if(features.length > 0){
			    // todo: don't ignore
			    // @ts-ignore
			    setPopupData(features.map((feature) => {
				const coords = toLonLat(feature.getGeometry().getCoordinates());
				return {
				    ...(feature.getProperties()),
				    coords: {
					lat: coords[1],
					lng: coords[0]
				    }
				};
			    }));
			    event.map.getView().animate({center: event.coordinate});
			    if(onClick){
				const [lng, lat] = toLonLat(event.coordinate);
				onClick({lng, lat});
			    }
				openModal();
			}
		    }}>
		    <RLayerTile
			projection='EPSG:3857'
			url='https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
		    />
		    {layersRendered}
		    <RLayerVector>
			{generateStyle({
			    color: 'red',
			    type: 'LineString',
			})}
			<RFeature geometry={route} />
		    </RLayerVector>
		    <RLayerVector>
			{generateStyle({
			    color: 'red',
			    type: 'EmptyCircle',
			})}
			<RFeature geometry={spotlight} />
		    </RLayerVector>
		    <RControl.RCustom className='layersControl'>
			<Popover>
			    <PopoverTrigger>
				<button>
				    <HamburgerIcon />
				</button>
			    </PopoverTrigger>
			    <PopoverContent p='0'>
				<PopoverArrow />
				<PopoverCloseButton />
				<PopoverBody>
				    <VStack align='start'>
					{layerToggles}
				    </VStack>
				</PopoverBody>
			    </PopoverContent>
			</Popover>
		    </RControl.RCustom>
		</RMap>		
	    </Box>
	    {isDesktop &&
	     <Box w='33%' h='100%'>
		 <Renderer data={popupData} key={JSON.stringify(popupData)} PageRenderer={renderer}/>
		 <Navigation {...{geocoder_url, router_url}} />
	     </Box>
	    }
	    {
		!isDesktop &&
		<>
		    <Modal isOpen={isModalOpen} onClose={closeModal}>
			<ModalOverlay />
			<ModalContent>
			    <Box p='4'>
				<Renderer data={popupData} key={JSON.stringify(popupData)} PageRenderer={renderer} closeModal={closeModal} />
				<Navigation {...{geocoder_url, router_url}} />
			    </Box>
			</ModalContent>
		    </Modal>
		</>
	    }
	</HStack>
    );
}

const Renderer = ({
    closeModal,
    data,
    PageRenderer
}) => {
    const [page, setPage] = useState(0);
    const {
	endAddress,
	setEndAddress,
	endCoords,
	setEndCoords,
	setSpotlight
    } = useNavigation();
    useEffect(() => {
	if(data !== undefined
	   && data.length > 0){
	    setEndAddress(data[page].address);
	    setEndCoords(data[page].coords);
	    setSpotlight(new Point(fromLonLat([data[page].coords.lng, data[page].coords.lat])));
	}
    }, [data, page, setEndCoords, setEndAddress])
    if(data === undefined
       || data.length === 0){
	return (
	    <>
		<Text>
		    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend est non aliquet bibendum. Fusce vitae neque nec tellus pulvinar consequat a vitae mi. Nunc tristique vel arcu congue ultrices. Morbi vitae massa sit amet orci consequat maximus. Sed ac dolor eros. Fusce vel diam porta, sollicitudin lacus eget, consequat libero.
		</Text>
		<Text>
		    Ut gravida aliquam purus. Pellentesque ut tellus eu metus egestas blandit sed et velit. Mauris lobortis nulla eu massa aliquam, vitae bibendum enim molestie. Curabitur blandit metus magna, ac dapibus magna ultricies at. Donec porttitor porta erat, sit amet interdum ex euismod sed. Morbi et ipsum felis. Sed blandit urna ut ipsum molestie, sit amet maximus lacus finibus.
		</Text>
	    </>
	);
    }else{
	return (
	    <>
		<Flex mb='4'>
	    	    {data.length > 1 &&
		     <>
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
		     </>
		    }
		    {
			closeModal && <>
			    <Spacer />
			    <IconButton
				icon={<CloseIcon />}
				onClick={closeModal}
				size='xs'
			    />
			</>
		    }
		</Flex>
		<PageRenderer data={data[page]} />
	    </>
	);
    }

}
