import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Search, MoreHorizontal, MapPin } from "lucide-react-native";
import * as Location from "expo-location";
import CurrentWeather from "./components/weather/CurrentWeather";
import HourlyForecast from "./components/weather/HourlyForecast";
import DailyForecast from "./components/weather/DailyForecast";
import WeatherAlert from "./components/weather/WeatherAlert";
import WeatherDetailsGrid from "./components/weather/WeatherDetailsGrid";
import { WeatherCondition } from "./components/weather/WeatherIcon";
import { gradients } from "./styles/gradients";
import { getAllWeatherData } from "./lib/weatherService";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  useEffect(() => {
    loadWeatherData();
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

      // Fetch weather data
      const data = await getAllWeatherData(latitude, longitude);
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading weather:", err);
      setError("Failed to load weather data");
      setLoading(false);
    }
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

  if (error || !weatherData) {
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

  const currentGradient = gradients[weatherData.current.condition as keyof typeof gradients] || gradients.day;

  // Mock alerts (OpenWeather free tier doesn't include alerts)
  const mockAlerts = [] as any[];

  // Create city data structure for page indicator
  const citiesData = [
    {
      id: "current",
      city: weatherData.current.city,
      isCurrentLocation: true,
    },
  ];

  const goToCity = (index: number) => {
    setCurrentCityIndex(index);
  };

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
        <TouchableOpacity style={styles.headerButton}>
          <Search size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <MoreHorizontal size={20} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Weather */}
        <CurrentWeather
          city={weatherData.current.city}
          time={weatherData.current.time}
          date={weatherData.current.date}
          temperature={weatherData.current.temperature}
          condition={weatherData.current.condition}
          conditionText={weatherData.current.conditionText}
          feelsLike={weatherData.current.feelsLike}
          high={weatherData.current.high}
          low={weatherData.current.low}
          isCurrentLocation={true}
        />

        {/* Page Indicator */}
        <View style={styles.pageIndicator}>
          {citiesData.map((city, index) => (
            <TouchableOpacity
              key={city.id}
              onPress={() => goToCity(index)}
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

        {/* Weather Alerts */}
        <WeatherAlert alerts={mockAlerts} />

        {/* Hourly Forecast */}
        <View style={styles.section}>
          <HourlyForecast hours={weatherData.hourly} />
        </View>

        {/* Daily Forecast */}
        <View style={styles.section}>
          <DailyForecast
            days={weatherData.daily}
            tempRange={{
              min: Math.min(...weatherData.daily.map((d: any) => d.low)),
              max: Math.max(...weatherData.daily.map((d: any) => d.high))
            }}
          />
        </View>

        {/* Weather Details Grid */}
        <View style={styles.lastSection}>
          <WeatherDetailsGrid details={weatherData.details} />
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
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
  section: {
    marginBottom: 16,
  },
  lastSection: {
    marginBottom: 32,
  },
});
