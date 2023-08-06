import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import {
    LineString,
    Point
} from "ol/geom";

export type Coordinate = {
    lat: number,
    lng: number
}

type NavigationContextType = {
    startAddress: string | null,
    setStartAddress: Dispatch<SetStateAction<string | null>> | null,
    startCoords: Coordinate | null,
    setStartCoords: Dispatch<SetStateAction<Coordinate | null>> | null,
    endAddress: string | null,
    setEndAddress: Dispatch<SetStateAction<string | null>> | null,
    endCoords: Coordinate | null,
    setEndCoords: Dispatch<SetStateAction<Coordinate | null>> | null,
    spotlight: any | null,
    setSpotlight: Dispatch<SetStateAction<Point | null>> | null,
    route: LineString | null,
    setRoute: Dispatch<SetStateAction<LineString | null>> | null,
    instructions: any | null,
    setInstructions: Dispatch<SetStateAction<string[] | null>> | null;
}

const NavigationContext = createContext<NavigationContextType>({
    startAddress: null,
    setStartAddress: null,
    startCoords: null,
    setStartCoords: null,
    endAddress: null,
    setEndAddress: null,
    endCoords: null,
    setEndCoords: null,
    spotlight: null,
    setSpotlight: null,
    route: null,
    setRoute: null,
    instructions: null,
    setInstructions: null
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({children}: {children: ReactNode}) => {
    const [startAddress, setStartAddress] = useState<string | null>(null);
    const [startCoords, setStartCoords] = useState<Coordinate | null>(null);
    const [endAddress, setEndAddress] = useState<string | null>(null);
    const [endCoords, setEndCoords] = useState<Coordinate | null>(null);
    const [spotlight, setSpotlight] = useState<Point | null>(null);
    const [route, setRoute] = useState<LineString | null>(null);
    const [instructions, setInstructions] = useState<string[] | null>(null);
    
    return (
	<NavigationContext.Provider value={{
	    startAddress,
	    setStartAddress,
	    startCoords,
	    setStartCoords,
	    endAddress,
	    setEndAddress,
	    endCoords,
	    setEndCoords,
	    spotlight,
	    setSpotlight,
	    route,
	    setRoute,
	    instructions,
	    setInstructions
	}}>
	{children}
	</NavigationContext.Provider>
    )
};
