import {
    Box,
    Button,
    Checkbox,
    CloseButton,
    Flex,
    HStack,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    Spacer,
    Text,
    VStack,
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
import {Point} from "ol/geom";
import {
    RCircle,
    RFill,
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
    useMemo,
    useState,
} from 'react';

import './Map.css';
import 'ol/ol.css';

export const Map = ({
    center = {
	lat: 0,
	lng: 0
    },
    layers = [],
    zoom = 11,
    renderer = () => {},
    onClick
}: any // todo: better typing
) => {
    const [popupData, setPopupData] = useState([]);
    const features = useMemo(() => {
	return layers.map((
	    layer: any // todo: better typing
	) => {
	    return new GeoJSON({
		featureProjection: 'EPSG:3857',
            }).readFeatures(layer.geojson);
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
		color: layer.color
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
		colorScheme={color}
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
    const [page, setPage] = useState(0);
    return (
	<HStack h='100%' className='sm_frg'>
	    <Box w='67%' h='100%'>
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
			    setPopupData(features.map((feature) => feature.getProperties()));
			    setPage(0);
			    event.map.getView().animate({center: event.coordinate});
			    if(onClick){
				const [lng, lat] = toLonLat(event.coordinate);
				onClick({lng, lat});
			    }
			}
		    }}>
		    <RLayerTile
		    projection='EPSG:3857'
		    url='https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
		    />
		    {
			Object.values(visibleLayers).map((
			    layer: any, // todo: better typing
			    index: number
			) =>
			    <RLayerVector
				features={features[index]}
				visible={layer.visible}
			    >
				<RStyle>
				    <RCircle radius={Math.round(view.zoom / 3)}>
					<RFill color={layer.color} />
				    </RCircle>
				</RStyle>
			    </RLayerVector>
			)
		    }
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
	    <Box w='33%' h='100%'>
		{popupData.length > 1 &&
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
			 {page + 1} of {popupData.length}
		     </Text>
		     <IconButton
			 aria-label='next page'
			 size='xs'
			 icon={<ChevronRightIcon />}
			 isDisabled={page === popupData.length - 1}
			 onClick={() => {setPage(page + 1);}}
		     />
		 </Flex>
		}
		{renderer({data: popupData[page]})}
	    </Box>
	</HStack>
    );
}
