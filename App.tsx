import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Search, MoreHorizontal, MapPin, List, Settings } from "lucide-react-native";
import * as Location from "expo-location";
import CityWeatherView from "./components/weather/CityWeatherView";
import SearchModal from "./components/modals/SearchModal";
import CityListModal from "./components/modals/CityListModal";
import SettingsModal from "./components/modals/SettingsModal";
import { WeatherCondition } from "./components/weather/WeatherIcon";
import { gradients } from "./styles/gradients";
import { getAllWeatherData } from "./lib/weatherService";
import {
  loadCities,
  updateCurrentLocationCity,
  addCity,
  removeCity,
  SavedCity,
  CityWithWeather,
} from "./lib/storageService";
import {
  loadTemperatureUnit,
  saveTemperatureUnit,
  TemperatureUnit,
} from "./lib/preferencesService";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<CityWithWeather[]>([]);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [cityListModalVisible, setCityListModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('F');

  useEffect(() => {
    loadWeatherData();
    loadUserPreferences();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Fetch weather data for current location
      const apiUnit = temperatureUnit === 'F' ? 'imperial' : 'metric';
      const currentWeatherData = await getAllWeatherData(latitude, longitude, apiUnit);

      // Create current location city
      const currentLocationCity: CityWithWeather = {
        id: 'current_location',
        name: currentWeatherData.current.city,
        country: '', // We could enhance this with reverse geocoding
        lat: latitude,
        lon: longitude,
        isCurrentLocation: true,
        temperature: currentWeatherData.current.temperature,
        condition: currentWeatherData.current.condition,
        weatherData: currentWeatherData,
      };

      // Update current location in storage
      await updateCurrentLocationCity(currentLocationCity);

      // Load saved cities from storage
      const savedCities = await loadCities();

      // Fetch weather for all saved cities (excluding current location)
      const citiesWithWeather = await Promise.all(
        savedCities
          .filter(city => !city.isCurrentLocation)
          .map(async (city) => {
            try {
              const apiUnit = temperatureUnit === 'F' ? 'imperial' : 'metric';
              const weatherData = await getAllWeatherData(city.lat, city.lon, apiUnit);
              return {
                ...city,
                temperature: weatherData.current.temperature,
                condition: weatherData.current.condition,
                weatherData,
              };
            } catch (err) {
              console.error(`Error fetching weather for ${city.name}:`, err);
              return city;
            }
          })
      );

      // Combine current location with other cities
      setCities([currentLocationCity, ...citiesWithWeather]);
      setLoading(false);
    } catch (err) {
      console.error("Error loading weather:", err);
      setError("Failed to load weather data");
      setLoading(false);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const savedUnit = await loadTemperatureUnit();
      setTemperatureUnit(savedUnit);
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  };

  const handleTemperatureUnitChange = async (unit: TemperatureUnit) => {
    try {
      await saveTemperatureUnit(unit);
      setTemperatureUnit(unit);
      // Reload weather data with new unit
      await loadWeatherData();
    } catch (err) {
      console.error('Error updating temperature unit:', err);
    }
  };

  const handleAddCity = async (city: SavedCity) => {
    try {
      // Add city to storage
      await addCity(city);

      // Fetch weather for the new city
      const apiUnit = temperatureUnit === 'F' ? 'imperial' : 'metric';
      const weatherData = await getAllWeatherData(city.lat, city.lon, apiUnit);
      const cityWithWeather: CityWithWeather = {
        ...city,
        temperature: weatherData.current.temperature,
        condition: weatherData.current.condition,
        weatherData,
      };

      // Add to cities list
      setCities([...cities, cityWithWeather]);

      // Switch to the new city
      setCurrentCityIndex(cities.length);
    } catch (err) {
      console.error('Error adding city:', err);
    }
  };

  const handleDeleteCity = async (cityId: string) => {
    try {
      // Remove from storage
      await removeCity(cityId);

      // Find the index of the city to remove
      const cityIndex = cities.findIndex(c => c.id === cityId);

      // Remove from cities list
      const updatedCities = cities.filter(c => c.id !== cityId);
      setCities(updatedCities);

      // Adjust current index if necessary
      if (currentCityIndex >= updatedCities.length) {
        setCurrentCityIndex(Math.max(0, updatedCities.length - 1));
      } else if (currentCityIndex > cityIndex) {
        setCurrentCityIndex(currentCityIndex - 1);
      }
    } catch (err) {
      console.error('Error removing city:', err);
    }
  };

  const flatListRef = useRef<FlatList>(null);

  const handleSelectCity = (index: number) => {
    setCurrentCityIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient
          colors={gradients.day.colors as any}
          locations={gradients.day.locations as any}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (error || cities.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient
          colors={gradients.day.colors as any}
          locations={gradients.day.locations as any}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.errorText}>{error || "No weather data available"}</Text>
        <TouchableOpacity onPress={loadWeatherData} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get current city data
  const currentCity = cities[currentCityIndex];
  const weatherData = currentCity?.weatherData;

  if (!weatherData) {
    return null;
  }

  const currentGradient = gradients[weatherData.current.condition as keyof typeof gradients] || gradients.day;

  // Mock alerts (OpenWeather free tier doesn't include alerts)
  const mockAlerts = [] as any[];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={currentGradient.colors as any}
        locations={currentGradient.locations as any}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setSearchModalVisible(true)}
        >
          <Search size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setCityListModalVisible(true)}
        >
          <List size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Settings size={20} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <FlatList
        data={cities}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width: require('react-native').Dimensions.get('window').width }}>
            <CityWeatherView
              city={item}
              temperatureUnit={temperatureUnit}
              mockAlerts={mockAlerts}
              renderPageIndicator={() => (
                <View style={styles.pageIndicator}>
                  {cities.map((city, index) => (
                    <TouchableOpacity
                      key={city.id}
                      onPress={() => handleSelectCity(index)}
                      style={styles.dot}
                    >
                      {city.isCurrentLocation && index === currentCityIndex ? (
                        <View style={styles.activeDotWithPin}>
                          <MapPin size={6} />
                        </View>
                      ) : index === currentCityIndex ? (
                        <View style={styles.activeDot} />
                      ) : (
                        <View style={styles.inactiveDot} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>
        )}
        onMomentumScrollEnd={(e) => {
          const contentOffset = e.nativeEvent.contentOffset.x;
          const viewSize = e.nativeEvent.layoutMeasurement.width;
          const index = Math.round(contentOffset / viewSize);
          if (index !== currentCityIndex) {
            setCurrentCityIndex(index);
          }
        }}
        initialScrollIndex={currentCityIndex}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
          });
        }}
        ref={flatListRef}
        getItemLayout={(data, index) => (
          { length: require('react-native').Dimensions.get('window').width, offset: require('react-native').Dimensions.get('window').width * index, index }
        )}
      />

      {/* Modals */}
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onAddCity={handleAddCity}
      />

      <CityListModal
        visible={cityListModalVisible}
        onClose={() => setCityListModalVisible(false)}
        cities={cities}
        currentCityIndex={currentCityIndex}
        onSelectCity={handleSelectCity}
        onDeleteCity={handleDeleteCity}
      />

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        temperatureUnit={temperatureUnit}
        onTemperatureUnitChange={handleTemperatureUnitChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
    zIndex: 40,
  },
  headerButton: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    padding: 4,
  },
  activeDotWithPin: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});
