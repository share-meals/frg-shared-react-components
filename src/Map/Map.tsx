import {
    AspectRatio,
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
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
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
    useToast,
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
import {
    Geometry,
    Point
} from 'ol/geom';
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

import ILatLng from './interfaces/latlng';

import 'ol/ol.css';

const generateStyle = ({
    color,
    type,
    icon,
    radius = 8,
    width = 8,
    zoomPercentage = 1
}: any) => {
    switch(type){
	case 'Point':
	    if(icon === undefined){
		return (
		    <RStyle>
			<RCircle radius={radius * zoomPercentage}>
			    <RStroke color='white' width={width * 0.25 * zoomPercentage} />
			    <RFill color={color} />
			</RCircle>
		    </RStyle>
		);
	    }else{
		return (
		    <RStyle>
			<RIcon
			src={icon.src}
			scale={icon.scale * zoomPercentage}
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
    noDefaultControls: boolean,
    renderer: FunctionComponent,
    routerUrl: string,
    zoom: number,
    spotlightColor: string,
    onClick: any,
    onCenter: any,
    maxZoom: number,
    minZoom: number,
    osrmVersion: string
}

export const Map = (props: MapType) => {
    return (
	<GeocoderProvider>
	    <MapComponent {...props} />
	</GeocoderProvider>
    );
}

const calculateZoomLevel = ({
    zoom,
    minZoom,
    maxZoom
}: {
    zoom: number,
    minZoom: number,
    maxZoom: number
}) => {
    const newZoomPercentage = (zoom - minZoom) / (maxZoom - minZoom);
    if(newZoomPercentage <= 0.25){
	return 0.5;
    }else if(newZoomPercentage <= 0.5){
	return 0.75;
    }else if(newZoomPercentage <= 0.75){
	return 1;
    }else{
	return 1.5;
    }
};

const MapComponent = ({
    apiKey = null,
    center = {
	lat: 0,
	lng: 0
    },
    geocoderPlatform,
    geocoderUrl,
    layers = [],
    noDefaultControls = true,
    renderer,
    routerUrl,
    zoom = 10,
    spotlightColor = 'red',
    onClick = null,
    onCenter = null,
    maxZoom = 18,
    minZoom = 10,
    osrmVersion = 'v5'
}: MapType
) => {
    const toast = useToast();
    const [view, setView] = useState({
	center: fromLonLat([center.lng, center.lat]),
	zoom: zoom
    });
    const [zoomPercentage, setZoomPercentage] = useState(1);
    const [popupData, setPopupData] = useState([]);
    const [spotlight, setSpotlight] = useState();
    const {isOpen: isModalOpen, onOpen: openModal, onClose: closeModal} = useDisclosure({defaultIsOpen: true});
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
			icon: layer.icon,
			zoomPercentage
		    })
		}
	    </RLayerVector>
	)).reverse();
    }, [features, visibleLayers, zoomPercentage]);

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

    useEffect(() => {
	const newZoomPercentage = calculateZoomLevel({
	    zoom: view.zoom,
	    minZoom,
	    maxZoom
	});
	if(newZoomPercentage !== zoomPercentage){
	    setZoomPercentage(newZoomPercentage);
	}
    }, [view]);
    return (
	<HStack h='100%' alignItems='stretch'>
	    <Box w={isDesktop ? '67%' : '100%'} h='100%'>
		<HStack mb={4}>
		    <Popover>
			<PopoverTrigger>
			    <Button
				colorScheme='blue'
				aria-label='menu'
				leftIcon={<HamburgerIcon />}
			    >
				Layers
			    </Button>
			</PopoverTrigger>
			<PopoverContent p='0'>
			    <PopoverArrow />
			    <PopoverCloseButton />
			    <PopoverHeader>
				Layers - click to toggle
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
		    onGeocode={(latlng: ILatLng | null, address: string) => {
			    if(onCenter !== null){
				onCenter({
				    ...latlng,
				    address
				});
			    }
			    if(latlng !== null){
				const point = fromLonLat([latlng.lng, latlng.lat]);
				setView({
				    center: point,
				    zoom: view.zoom
				});
				// @ts-ignore
				setSpotlight!(new Point(point));
			    }else{
				/////////
				toast({
				    title: 'Address not found',
				    description: "Please try another address",
				    status: 'error',
				    isClosable: true,
				    position: 'top'
				})
			    }
			}}/>
		</HStack>
		<AspectRatio maxH='100%' ratio={1}>
		    <RMap
			maxZoom={maxZoom}
			minZoom={minZoom}
			noDefaultControls={noDefaultControls}
			height='calc(100% - 56px)'
			width='100%'
			initial={view}
			view={[view, setView]}
			onClick={(event) => {
			    const features = event.map.getFeaturesAtPixel(event.pixel);
			    if(features.length > 0){
				// todo: don't ignore
				// @ts-ignore
				setPopupData(features
				    .filter((feature) => {
					return (feature.getProperties()).id !== undefined;
				    })
				    .map((feature) => {
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
				// @ts-ignore
				const lnglat = toLonLat(features[0].getGeometry()?.getCoordinates());
				const newCenter = fromLonLat(lnglat);

				// todo: animate map
				/*
				event.map.getView().fit(features[0].getGeometry().getExtent(), {
				    duration: 25,
				    maxZoom: 15
				});
				 */

				// @ts-ignore
				setSpotlight(new Point(newCenter));
				if(onClick !== null){
				    onClick({
					lng: lnglat[0],
					lat: lnglat[1]
				    });
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
				type: 'EmptyCircle',
				width: 4,
				zoomPercentage
			    })}
			    <RFeature geometry={spotlight} />
			</RLayerVector>
		    </RMap>
		</AspectRatio>
	    </Box>
	    {isDesktop &&
	     <Box w='33%' h='100%' p={4}>
		 <Renderer data={popupData} key={JSON.stringify(popupData)} PageRenderer={renderer}/>
	     </Box>
	    }
	    {
		!isDesktop &&
		<>
		    <Modal isOpen={isModalOpen} onClose={closeModal}>
			<ModalOverlay />
			<ModalContent>
			    <ModalHeader />
			    <ModalCloseButton />
			    <ModalBody>
				<Renderer data={popupData} key={JSON.stringify(popupData)} PageRenderer={renderer} />
			    </ModalBody>
			    <ModalFooter />
			</ModalContent>
		    </Modal>
		</>
	    }
	</HStack>
    );
}

const Renderer = ({
    data,
    PageRenderer
}: {
    data: any,
    PageRenderer: FunctionComponent<any>
}) => {
    const [page, setPage] = useState(0);
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
		</Flex>
		<PageRenderer data={data[page]} />
	    </>
	);
    }
}
