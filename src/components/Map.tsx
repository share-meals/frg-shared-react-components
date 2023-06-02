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
    useMemo,
    useState,
} from 'react';

import './Map.css';
import 'ol/ol.css';

const generateStyle = ({color, type, icon}: any) => {
    switch(type){
	case 'Point':
	    if(icon === undefined){
		return (
		    <RStyle>
			<RCircle radius={3}>
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
	default:
	    return (
		<RStyle>
		    <RCircle radius={3}>
			<RFill color={color} />
		    </RCircle>
		</RStyle>
	    );
    }
}

export const Map = ({
    center = {
	lat: 0,
	lng: 0
    },
    layers = [],
    zoom = 11,
    Renderer = () => {},
    onClick
}: any // todo: better typing
) => {
    const [popupData, setPopupData] = useState([]);
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
	return Object.values(visibleLayers).map((
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
	)
    }, [features, visibleLayers]);
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
		    {layersRendered}
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
		<Renderer data={popupData} key={JSON.stringify(popupData)} />
	    </Box>
	</HStack>
    );
}
