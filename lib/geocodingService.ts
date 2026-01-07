const API_KEY = "8bfe02f37a709411058126bffc4d3352";
const GEOCODING_URL = "http://api.openweathermap.org/geo/1.0";

export interface CitySearchResult {
    name: string;
    state?: string;
    country: string;
    lat: number;
    lon: number;
}

/**
 * Search for cities by name using OpenWeather Geocoding API
 */
export async function searchCities(query: string): Promise<CitySearchResult[]> {
    if (!query || query.trim().length < 2) {
        return [];
    }

    try {
        const response = await fetch(
            `${GEOCODING_URL}/direct?q=${encodeURIComponent(query)}&limit=10&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform the response to our format
        const results: CitySearchResult[] = data.map((item: any) => ({
            name: item.name,
            state: item.state,
            country: item.country,
            lat: item.lat,
            lon: item.lon,
        }));

        return results;
    } catch (error) {
        console.error('Error searching cities:', error);
        throw error;
    }
}

/**
 * Get city name from coordinates using reverse geocoding
 */
export async function getCityFromCoordinates(lat: number, lon: number): Promise<CitySearchResult | null> {
    try {
        const response = await fetch(
            `${GEOCODING_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Reverse geocoding API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            return null;
        }

        const item = data[0];
        return {
            name: item.name,
            state: item.state,
            country: item.country,
            lat: item.lat,
            lon: item.lon,
        };
    } catch (error) {
        console.error('Error getting city from coordinates:', error);
        return null;
    }
}
