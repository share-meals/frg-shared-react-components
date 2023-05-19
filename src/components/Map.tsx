import {
    Box,
    Checkbox,
    CloseButton,
    Flex,
    HStack,
    IconButton,
    Spacer,
    VStack
} from '@chakra-ui/react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
} from '@chakra-ui/icons';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import {Point} from "ol/geom";
import {
    RCircle,
    RFill,
    RStroke,
    RStyle,
} from 'rlayers/style';
import {
    RFeature,
    RLayerTile,
    RLayerVector,
    RMap,
    ROverlay,
} from 'rlayers';
import {
    useMemo,
    useState,
} from 'react';

import 'ol/ol.css';
import './Map.css';

export const Map = ({
    center = {
	lat: 0,
	lng: 0
    },
    layers = [],
    zoom = 11,
    popupRenderer = () => {},
}: props) => {
    const [popup, setPopup] = useState({
	visible: false,
	coordinate: [0, 0]
    });
    const [popupData, setPopupData] = useState([]);
    const features = useMemo(() => {
	return layers.map((layer) => {
	    return new GeoJSON({
		featureProjection: 'EPSG:3857',
            }).readFeatures(layer.geojson);
	});
    });
    const [visibleLayers, setVisibleLayers] = useState(Object.fromEntries(Object.values(layers).map((layer) =>
	[
	    layer.name,
	    {
		name: layer.name,
		visible: true,
		color: layer.color
	    }
	]
    )));
    const layerToggles = useMemo(() => {
	return Object.values(visibleLayers).map(({color, name}, index) => 
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
    });
    const [view, setView] = useState({
	center: fromLonLat([center.lng, center.lat]),
	zoom: zoom
    });
    const [page, setPage] = useState(0);
    const popupFeature = useMemo(() => {
	return (
	    <RFeature geometry={new Point(popup.coordinate)}>
		<ROverlay className={!popup.visible && 'hidden'}>
		    <div id='triangle'></div>
		    <Box className='popup'>
		    <Flex>
			<Box>
			    {popupData.length > 1 &&
			     <>
			     <IconButton
				 size='xs'
				 icon={<ChevronLeftIcon />}
				 isDisabled={page === 0}
				 onClick={() => {setPage(page - 1);}}
			     />
			     {page + 1} of {popupData.length}
			     <IconButton
				 size='xs'
				 icon={<ChevronRightIcon />}
				 isDisabled={page === popupData.length - 1}
				 onClick={() => {setPage(page + 1);}}
			     />
			    </>
			    }
			</Box>
			<Spacer />
			<Box>
			    <IconButton
				icon={<CloseIcon />}
				size='xs'
				onClick={() => {
				setPopup({
				    coordinate: [0, 0],
				    visible: false
				});
			}} />
			</Box>
		    </Flex>
		    {popupRenderer({data: popupData[page]})}
		    </Box>
		</ROverlay>
	    </RFeature>
	);
    }, [JSON.stringify(popup), JSON.stringify(popupData), page])
    return (
	<>
	    <HStack style={{height: '100%'}}>
	    <div id='map_wrapper'>
		<RMap
		    className='RMap'
		    initial={view}
		    view={[view, setView]}
		    onClick={(event, a) => {
			const features = event.map.getFeaturesAtPixel(event.pixel);
			if(features.length > 0){
			    setPopup({
				visible: true,
				coordinate: event.coordinate
			    });
			    setPopupData(features.map((feature) => feature.getProperties()));
			    setPage(0);
			    setView({
				center: features[0].getGeometry().getCoordinates(),
				zoom: view.zoom
			    });
			}
		    }}
		>
		    <RLayerTile
			projection='EPSG:3857'
			url='https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
		    />
		    {
			Object.values(visibleLayers).map((layer, index) =>
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
		    <RLayerVector>
			<RStyle>
			    
			</RStyle>
			{popupFeature}
		    </RLayerVector>
		</RMap>
		
	    </div>
	    <VStack align='start' id='controls_wrapper'>
		{layerToggles}
	    </VStack>
	    </HStack>
	</>
    );
}
