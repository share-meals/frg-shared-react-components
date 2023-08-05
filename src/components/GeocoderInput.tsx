import {
    Button
} from '@chakra-ui/react';
import InputComponent from './InputComponent';
import {
    FieldValues,
    useForm
} from 'react-hook-form';
import {
    useEffect,
    useState
} from 'react';
import {useGeocoder} from './useGeocoder';
import GoogleGeocoder from 'react-geocode';

import ILatLng from './interfaces/latlng';
import INominatimSearchResult from './interfaces/nominatimsearchresult';

type TGeocoderInput = {
    address: string
};

const geocodeNominatim = async (data: TGeocoderInput, url: string | null): Promise<ILatLng> => {
    const geocoderResponse = await fetch(`${url}?q=${data.address}&limit=1&format=json`);
    const geocoderJson: INominatimSearchResult[] = await geocoderResponse.json();
    if(geocoderJson.length > 0){
	return {
	    lat: parseFloat(geocoderJson[0].lat),
	    lng: parseFloat(geocoderJson[0].lon)
	};
    }else{
	// todo: error checking
	return {
	    lat: 0,
	    lng: 0
	}
    }
};

const geocodeGoogle = async (data: TGeocoderInput, apiKey: string | null): Promise<ILatLng> => {
    if(apiKey === null){
	// todo: error checking
	return {
	    lat: 0,
	    lng: 0
	}
    }
    GoogleGeocoder.setApiKey(apiKey);
    const response = await GoogleGeocoder.fromAddress(data.address);
    if(response.status === 'OK'){
	return {
	    lat: response.results[0].geometry.location.lat,
	    lng: response.results[0].geometry.location.lng
	};
    }else{
	// todo: error checking
	return {
	    lat: 0,
	    lng: 0
	}
    }
};

export const GeocoderInput = ({
    label,
    onGeocode = (latlng: ILatLng) => {},
    placeholder
}: {
    label?: string,
    onGeocode: (latlng: ILatLng) => void,
    placeholder?: string
}) => {
    const {control, handleSubmit} = useForm<TGeocoderInput>({
	defaultValues: {
	    address: ''
	}
    });
    const [loading, setLoading] = useState(false);
    const {
	platform,
	url,
	apiKey
    } = useGeocoder();
    const onSubmit = handleSubmit(async (data) => {
	setLoading(true);
	// todo: error checking
	switch(platform){
	    case 'nominatim':
		onGeocode(await geocodeNominatim(data, url));
		break;
	    case 'google':
		onGeocode(await geocodeGoogle(data, apiKey));
		break;
	}
	setLoading(false);
    });
    return <>
	<form onSubmit={onSubmit} style={{width: '100%'}}>
	    <InputComponent
		control={control}
		disabled={loading}
		variant={loading ? 'filled' : 'outline'}
		label={label}
		name='address'
		placeholder={placeholder}
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
    </>;
}
