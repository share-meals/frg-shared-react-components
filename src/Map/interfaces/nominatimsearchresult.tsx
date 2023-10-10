export default interface INominatimSearchResult {
    place_id: number,
    licence: string,
    osm_type: string,
    osm_id: number,
    boundingbox: string[],
    lat: string,
    lon: string,
    display_name: string,
    class: string,
    type: string,
    importance: number,
    // Defined when SearchOptions.addressdetails is provided
    address?: {
	road: string,
	suburb: string,
	city_district: string,
	city: string,
	county: string,
	state: string,
	postcode: string,
	country: string,
	country_code: string,
    }
};
