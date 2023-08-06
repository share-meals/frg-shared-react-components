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
    Card,
    CardBody,
    Checkbox,
    CloseButton,
    Divider,
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
    PopoverHeader,
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
import {Coordinate} from 'ol/coordinate';
import {
    fromLonLat,
    toLonLat
} from 'ol/proj';
import {
    GeocoderInput
} from './GeocoderInput';
import {
    GeocoderProvider,
    useGeocoder
} from './useGeocoder';
import GeoJSON from 'ol/format/GeoJSON';
import {Navigation} from './Navigation';
import {
    Geometry,
    Point
} from "ol/geom";
import {
    RCircle,
    RFill,
    RIcon,
    RStroke,
    RStyle,
} from 'rlayers/style';
import {
    RFeature,
    RLayerTile,
    RLayerVector,
    RMap,
    ROverlay
} from 'rlayers';
import {
    FunctionComponent,
    ReactElement,
    ReactNode,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    NavigationProvider,
    useNavigation
} from './useNavigation';

import ILatLng from './interfaces/latlng';

import 'ol/ol.css';

const generateStyle = ({
    color,
    type,
    icon,
    radius = 8,
    width = 8
}: any) => {
    switch(type){
	case 'Point':
	    if(icon === undefined){
		return (
		    <RStyle>
			<RCircle radius={radius}>
			    <RStroke color='white' width={width * 0.25} />
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
	case 'LineString':
	    return (
		<RStyle>
		    <RStroke color={color} width={width} />
		</RStyle>
	    );
	    break;
	case 'EmptyCircle':
	    return (
		<RStyle>
		    <RCircle radius={radius}>
			<RStroke color={color} width={width}/>
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

export type MapType = {
    apiKey: string | null,
    center: {
	lat: number,
	lng: number
    },
    geocoderPlatform: 'nominatim' | 'google',
    geocoderUrl: string,
    layers: any[],
    renderer: FunctionComponent,
    routerUrl: string,
    zoom: number,
    spotlightColor: string,
    onClick: any,
    maxZoom: number,
    minZoom: number,
    osrmVersion: string
}

export const Map = (props: MapType) => {
    return (
	<NavigationProvider>
	    <GeocoderProvider>
		<MapComponent {...props} />
	    </GeocoderProvider>
	</NavigationProvider>
    );
}

const MapComponent = ({
    apiKey = null,
    center = {
	lat: 0,
	lng: 0
    },
    geocoderPlatform,
    geocoderUrl,
    layers = [],
    renderer,
    routerUrl,
    zoom = 16,
    spotlightColor = 'red',
    onClick,
    maxZoom = 18,
    minZoom = 13,
    osrmVersion = 'v5'
}: MapType
) => {
    const [view, setView] = useState({
	center: fromLonLat([center.lng, center.lat]),
	zoom: zoom
    });
    const [popupData, setPopupData] = useState([]);
    const {spotlight, route, setSpotlight} = useNavigation();
    const {isOpen: isModalOpen, onOpen: openModal, onClose: closeModal} = useDisclosure();
    const [isDesktop] = useMediaQuery('(min-width: 900px)');
    const features = useMemo(() => {
	return layers.map((
	    layer: any, // todo: better typing
	    index: number
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
		iconColor={color}
		// @ts-ignore
		style={{'--chakra-colors-blue-500': color}}
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
		{
		    generateStyle({
			color: layer.color,
			type: layer.type,
			icon: layer.icon
		    })
		}
	    </RLayerVector>
	)).reverse();
    }, [features, visibleLayers]);

    const {
	setPlatform: setGeocoderPlatform,
	setUrl: setGeocoderUrl,
	setApiKey
    } = useGeocoder();
    
    useEffect(() => {
	setGeocoderPlatform(geocoderPlatform);
	setGeocoderUrl(geocoderUrl);
	setApiKey(apiKey)
    }, [geocoderPlatform, geocoderUrl, apiKey]);
    
    return (
	<HStack h='100%'>
	    <Box w={isDesktop ? '67%' : '100%'} h='100%'>
		<HStack mb={4}>
		    <Popover>
			<PopoverTrigger>
			    <IconButton colorScheme='blue' aria-label='menu'>
				<HamburgerIcon />
			    </IconButton>
			</PopoverTrigger>
			<PopoverContent p='0'>
			    <PopoverArrow />
			    <PopoverCloseButton />
			    <PopoverHeader>
				Layers
			    </PopoverHeader>
			    <PopoverBody p={4}>
				<VStack align='start'>
				    {layerToggles}
				</VStack>
			    </PopoverBody>
			</PopoverContent>
		    </Popover>
		    <GeocoderInput
			placeholder='Go to address ...'
			onGeocode={(latlng: ILatLng) => {
			    const point = fromLonLat([latlng.lng, latlng.lat]);
			    setView({
				center: point,
				zoom: view.zoom
			    });
			    setSpotlight!(new Point(point));
			}}/>
		</HStack>
		<RMap
		    maxZoom={maxZoom}
		    minZoom={minZoom}
		    noDefaultControls={true}
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
				// @ts-ignore
				const coords: Coordinate = toLonLat(feature.getGeometry()?.getCoordinates());
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
			<RFeature geometry={route as Geometry} />
		    </RLayerVector>
		    <RLayerVector>
			{generateStyle({
			    color: 'red',
			    type: 'EmptyCircle',
			    width: 8
			})}
			<RFeature geometry={spotlight} />
		    </RLayerVector>
		</RMap>
	    </Box>
	    {isDesktop &&
	     <Box w='33%' h='100%' p={4}>
		 <Renderer data={popupData} key={JSON.stringify(popupData)} PageRenderer={renderer}/>
		 {popupData.length > 0 &&
		  <>
		      <Divider my={4} />
		      <Navigation {...{geocoderUrl, routerUrl, osrmVersion}} />
		  </>
		 }
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
				<Divider my={4} />
				<Navigation {...{geocoderUrl, routerUrl, osrmVersion}} />
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
}: {
    closeModal?: any,
    data: any,
    PageRenderer: FunctionComponent<any>
}) => {
    const [page, setPage] = useState(0);
    const {
	endAddress,
	setEndAddress,
	setEndCoords,
	setRoute,
	setSpotlight,
	setInstructions
    } = useNavigation();
    useEffect(() => {
	if(data !== undefined
	   && data.length > 0){
	    setEndAddress!(data[page].address);
	    setEndCoords!(data[page].coords);
	    setSpotlight!(new Point(fromLonLat([data[page].coords.lng, data[page].coords.lat])));
	    setInstructions!(null);
	    setRoute!(null);
	}
    }, [data, page, setEndCoords, setEndAddress])
    if(data === undefined
       || data.length === 0){
	return (
	    <>
		<PageRenderer data={null} />
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
				aria-label='close'
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
