import AsyncStorage from '@react-native-async-storage/async-storage';

const CITIES_STORAGE_KEY = '@sky_hue_cities';

export interface SavedCity {
    id: string;
    name: string;
    state?: string;
    country: string;
    lat: number;
    lon: number;
    isCurrentLocation?: boolean;
}

export interface CityWithWeather extends SavedCity {
    temperature?: number;
    condition?: string;
    weatherData?: any;
}

/**
 * Load all saved cities from AsyncStorage
 */
export async function loadCities(): Promise<SavedCity[]> {
    try {
        const citiesJson = await AsyncStorage.getItem(CITIES_STORAGE_KEY);
        if (citiesJson) {
            return JSON.parse(citiesJson);
        }
        return [];
    } catch (error) {
        console.error('Error loading cities from storage:', error);
        return [];
    }
}

/**
 * Save cities to AsyncStorage
 */
export async function saveCities(cities: SavedCity[]): Promise<void> {
    try {
        const citiesJson = JSON.stringify(cities);
        await AsyncStorage.setItem(CITIES_STORAGE_KEY, citiesJson);
    } catch (error) {
        console.error('Error saving cities to storage:', error);
        throw error;
    }
}

/**
 * Add a new city to saved cities
 */
export async function addCity(city: SavedCity): Promise<SavedCity[]> {
    try {
        const cities = await loadCities();

        // Check if city already exists
        const exists = cities.some(c =>
            c.lat === city.lat && c.lon === city.lon
        );

        if (exists) {
            return cities;
        }

        const updatedCities = [...cities, city];
        await saveCities(updatedCities);
        return updatedCities;
    } catch (error) {
        console.error('Error adding city:', error);
        throw error;
    }
}

/**
 * Remove a city from saved cities
 */
export async function removeCity(cityId: string): Promise<SavedCity[]> {
    try {
        const cities = await loadCities();
        const updatedCities = cities.filter(c => c.id !== cityId);
        await saveCities(updatedCities);
        return updatedCities;
    } catch (error) {
        console.error('Error removing city:', error);
        throw error;
    }
}

/**
 * Update current location city
 */
export async function updateCurrentLocationCity(city: SavedCity): Promise<SavedCity[]> {
    try {
        const cities = await loadCities();

        // Remove any existing current location city
        const filteredCities = cities.filter(c => !c.isCurrentLocation);

        // Add new current location city at the beginning
        const updatedCities = [{ ...city, isCurrentLocation: true }, ...filteredCities];
        await saveCities(updatedCities);
        return updatedCities;
    } catch (error) {
        console.error('Error updating current location city:', error);
        throw error;
    }
}

/**
 * Clear all saved cities
 */
export async function clearCities(): Promise<void> {
    try {
        await AsyncStorage.removeItem(CITIES_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing cities:', error);
        throw error;
    }
}
