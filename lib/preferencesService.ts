import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCES_STORAGE_KEY = '@sky_hue_preferences';

export type TemperatureUnit = 'F' | 'C';

interface Preferences {
    temperatureUnit: TemperatureUnit;
}

const DEFAULT_PREFERENCES: Preferences = {
    temperatureUnit: 'F',
};

/**
 * Load all preferences from AsyncStorage
 */
export async function loadPreferences(): Promise<Preferences> {
    try {
        const preferencesJson = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
        if (preferencesJson) {
            return JSON.parse(preferencesJson);
        }
        return DEFAULT_PREFERENCES;
    } catch (error) {
        console.error('Error loading preferences from storage:', error);
        return DEFAULT_PREFERENCES;
    }
}

/**
 * Save preferences to AsyncStorage
 */
export async function savePreferences(preferences: Preferences): Promise<void> {
    try {
        const preferencesJson = JSON.stringify(preferences);
        await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, preferencesJson);
    } catch (error) {
        console.error('Error saving preferences to storage:', error);
        throw error;
    }
}

/**
 * Load temperature unit preference
 */
export async function loadTemperatureUnit(): Promise<TemperatureUnit> {
    try {
        const preferences = await loadPreferences();
        return preferences.temperatureUnit;
    } catch (error) {
        console.error('Error loading temperature unit:', error);
        return DEFAULT_PREFERENCES.temperatureUnit;
    }
}

/**
 * Save temperature unit preference
 */
export async function saveTemperatureUnit(unit: TemperatureUnit): Promise<void> {
    try {
        const preferences = await loadPreferences();
        preferences.temperatureUnit = unit;
        await savePreferences(preferences);
    } catch (error) {
        console.error('Error saving temperature unit:', error);
        throw error;
    }
}
