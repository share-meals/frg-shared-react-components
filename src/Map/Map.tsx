import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
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
    ROSM,
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
    strokeColor,
    fillColor,
    type,
    icon,
    radius = 12,
    width = 12,
    zoomPercentage = 1
}: any) => {
    switch(type){
	case 'Point':
	    if(icon === undefined){
		return (
		    <RStyle>
			<RCircle radius={radius * zoomPercentage}>
			    <RStroke color={strokeColor} width={width * 0.25 * zoomPercentage} />
			    <RFill color={fillColor} />
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
		    <RStroke color={strokeColor} width={width} />
		</RStyle>
	    );
	    break;
	case 'Spotlight':
	    return (
		<RStyle>
		    <RCircle radius={radius * zoomPercentage}>
			<RFill color={strokeColor} />
		    </RCircle>
		</RStyle>
	    );
	default:
	    return (
		<RStyle>
		    <RCircle radius={radius}>
			<RFill color={strokeColor} />
		    </RCircle>
		</RStyle>
	    );
    }
}

export type Map = {
    apiKey: string | null,
    center: {
	lat: number,
	lng: number
    },
    featureRadius: number,
    featureWidth: number,
    geocoderLabel: string,
    geocoderPlatform: 'nominatim' | 'google',
    geocoderUrl: string,
    layers: any[],
    layersLabel: string,
    noDefaultControls: boolean,
    renderer: FunctionComponent,
    routerUrl: string,
    zoom: number,
    spotlightColor: string,
    spotlightRadius: number,
    onClick: any,
    onCenter: any,
    maxZoom: number,
    minZoom: number,
}

export const Map = (props: Map) => {
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
    featureRadius,
    featureWidth,
    geocoderLabel,
    geocoderPlatform,
    geocoderUrl,
    layers = [],
    layersLabel,
    noDefaultControls = true,
    renderer,
    routerUrl,
    zoom = 10,
    spotlightColor,
    spotlightRadius,
    onClick = null,
    onCenter = null,
    maxZoom,
    minZoom,
}: Map
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
		fillColor: layer.fillColor,
		strokeColor: layer.strokeColor,
		icon: layer.icon,
		type: layer.geojson.features[0].geometry.type
	    }
	]
    )));
    const layerToggles: ReactElement[] = useMemo(() => {
	return Object.values(visibleLayers).map((
	    {fillColor, name}: any, // todo: better typing
	    index: number
	) => 
	    <Checkbox
		defaultChecked
		iconColor={fillColor}
		// @ts-ignore
		style={{'--chakra-colors-blue-500': fillColor}}
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
			fillColor: layer.fillColor,
			strokeColor: layer.strokeColor,
			type: layer.type,
			icon: layer.icon,
			radius: featureRadius,
			width: featureWidth,
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

    const layersButton = <Popover>
	<PopoverTrigger>
	    <IconButton
		aria-label='menu'
		colorScheme='blue'
		icon={<HamburgerIcon />}>
	    </IconButton>
	</PopoverTrigger>
	<PopoverContent p='0'>
	    <PopoverArrow />
	    <PopoverCloseButton />
	    <PopoverBody p={4}>
		<VStack align='start'>
		    {layerToggles}
		</VStack>
	    </PopoverBody>
	</PopoverContent>
    </Popover>;

    const geocoderInput = <GeocoderInput
			      placeholder={geocoderLabel}
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
			      }}/>;
    const map = <RMap
		    maxZoom={maxZoom}
		    minZoom={minZoom}
		    noDefaultControls={noDefaultControls}
		    height='100%'
		    width='100%'
		    initial={view}
		    view={[view, setView]}
		    onClick={(event) => {
			const features = event.map.getFeaturesAtPixel(
			    event.pixel,
			    {
				hitTolerance: 10 * zoomPercentage
			    }
			);
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
	<ROSM />
	{layersRendered}
	<RLayerVector>
	    {generateStyle({
		strokeColor: spotlightColor,
		type: 'Spotlight',
		radius: spotlightRadius,
		zoomPercentage
	    })}
	    <RFeature geometry={spotlight} />
	</RLayerVector>
    </RMap>;

    if(isDesktop){
	return <>
	    <HStack h='100%' alignItems='stretch'>
		<Box w='67%' h='100%'>
		    {map}
		</Box>
		<Box w='33%' h='100%' pl={4}>
		    <Box pb='8'>
			<Accordion defaultIndex={[0]} allowMultiple>
			    <AccordionItem>
				<h2>
				    <AccordionButton>
					<Box as="span" flex='1' textAlign='left'>
					    {layersLabel}
					</Box>
					<AccordionIcon />
				    </AccordionButton>
				</h2>
				<AccordionPanel>
				    <VStack align='start'>
					{layerToggles}
				    </VStack>
				</AccordionPanel>
			    </AccordionItem>
			</Accordion>
			<Box pt='4'>
			    {geocoderInput}
			</Box>
		    </Box>
		    <Renderer data={popupData} key={JSON.stringify(popupData)} PageRenderer={renderer}/>		    
		</Box>
	    </HStack>
	</>
    }else{
	return <>
	    <VStack h='100%'>
	    	<HStack w='100%'>
		    {layersButton}
		    {geocoderInput}
		</HStack>
		<Box w='100%' h='100%'>
		    {map}
		</Box>
	    </VStack>
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
			     colorScheme='green'
			     icon={<ChevronLeftIcon />}
			     isDisabled={page === 0}
			     onClick={() => {setPage(page - 1);}}
			     size='xs'
			 />
			 <Text ml='4' mr='4'>
			     {page + 1} of {data.length}
			 </Text>
			 <IconButton
			     aria-label='next page'
			     colorScheme='green'
			     icon={<ChevronRightIcon />}
			     isDisabled={page === data.length - 1}
			     onClick={() => {setPage(page + 1);}}
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
