import {
    createContext,
    useContext,
    useState
} from 'react';

const NavigationContext = createContext({
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
    setRoute: null
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({children}) => {
    const [startAddress, setStartAddress] = useState(null);
    const [startCoords, setStartCoords] = useState(null);
    const [endAddress, setEndAddress] = useState(null);
    const [endCoords, setEndCoords] = useState(null);
    const [spotlight, setSpotlight] = useState(null);
    const [route, setRoute] = useState(null);
    
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
	    setRoute
	}}>
	{children}
	</NavigationContext.Provider>
    )
};
