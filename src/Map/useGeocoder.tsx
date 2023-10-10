import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from 'react';

type GeocoderContextType = {
    url: string | null,
    setUrl: Dispatch<SetStateAction<string | null>>,
    platform: 'google' | 'nominatim' | null,
    setPlatform: Dispatch<SetStateAction<'google' | 'nominatim' | null>>,
    apiKey: string | null,
    setApiKey: Dispatch<SetStateAction<string | null>>
}

const GeocoderContext = createContext<GeocoderContextType>({
    url: null,
    setUrl: () => {},
    platform: null,
    setPlatform: () => {},
    apiKey: null,
    setApiKey: () => {}
});

export const useGeocoder = () => useContext(GeocoderContext);

export const GeocoderProvider = ({children}: {children: ReactNode}) => {
    const [url, setUrl] = useState<string | null>(null);
    const [platform, setPlatform] = useState<'nominatim' | 'google' | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    return (
	<GeocoderContext.Provider value={{
	    url,
	    setUrl,
	    platform,
	    setPlatform,
	    apiKey,
	    setApiKey
	}}>
	{children}
	</GeocoderContext.Provider>
    );
}
