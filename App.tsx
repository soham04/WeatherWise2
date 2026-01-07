import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Search, MoreHorizontal, MapPin } from "lucide-react-native";
import CurrentWeather from "./components/weather/CurrentWeather";
import HourlyForecast from "./components/weather/HourlyForecast";
import DailyForecast from "./components/weather/DailyForecast";
import WeatherAlert from "./components/weather/WeatherAlert";
import WeatherDetailsGrid from "./components/weather/WeatherDetailsGrid";
import { WeatherCondition } from "./components/weather/WeatherIcon";
import { gradients } from "./styles/gradients";

// Mock data
const mockHourlyData = [
  { time: "Now", temperature: 72, condition: "sunny" as WeatherCondition, precipitation: 0, isNow: true },
  { time: "1 PM", temperature: 74, condition: "sunny" as WeatherCondition, precipitation: 0 },
  { time: "2 PM", temperature: 75, condition: "sunny" as WeatherCondition, precipitation: 0 },
  { time: "3 PM", temperature: 76, condition: "partly-cloudy" as WeatherCondition, precipitation: 10 },
  { time: "4 PM", temperature: 75, condition: "partly-cloudy" as WeatherCondition, precipitation: 20 },
  { time: "5 PM", temperature: 73, condition: "cloudy" as WeatherCondition, precipitation: 30 },
  { time: "6 PM", temperature: 71, condition: "cloudy" as WeatherCondition, precipitation: 40 },
  { time: "7 PM", temperature: 68, condition: "drizzle" as WeatherCondition, precipitation: 60 },
  { time: "8 PM", temperature: 66, condition: "rainy" as WeatherCondition, precipitation: 80 },
];

const mockDailyData = [
  { day: "Today", date: "Jan 7", condition: "sunny" as WeatherCondition, precipitation: 0, high: 76, low: 58, isToday: true },
  { day: "Wed", date: "Jan 8", condition: "partly-cloudy" as WeatherCondition, precipitation: 20, high: 74, low: 56 },
  { day: "Thu", date: "Jan 9", condition: "rainy" as WeatherCondition, precipitation: 80, high: 68, low: 54 },
  { day: "Fri", date: "Jan 10", condition: "stormy" as WeatherCondition, precipitation: 90, high: 62, low: 52 },
  { day: "Sat", date: "Jan 11", condition: "cloudy" as WeatherCondition, precipitation: 40, high: 65, low: 50 },
  { day: "Sun", date: "Jan 12", condition: "partly-cloudy" as WeatherCondition, precipitation: 20, high: 70, low: 52 },
  { day: "Mon", date: "Jan 13", condition: "sunny" as WeatherCondition, precipitation: 0, high: 75, low: 55 },
];

const mockWeatherDetails = {
  humidity: 62,
  windSpeed: 12,
  windDirection: "NW",
  uvIndex: 6,
  visibility: 10,
  pressure: 1015,
  pressureTrend: "rising" as const,
  dewPoint: 58,
  sunrise: "6:52 AM",
  sunset: "5:18 PM",
  moonPhase: "Waning Gibbous",
};

const mockAlerts = [
  {
    id: "1",
    type: "watch" as const,
    title: "Thunderstorm Watch",
    description: "A thunderstorm watch is in effect from 7 PM to midnight. Stay weather-aware.",
    time: "Until 12:00 AM",
  },
];

const citiesData = [
  {
    id: "current",
    city: "San Francisco",
    time: "12:34 PM",
    date: "Tuesday, January 7",
    temperature: 72,
    condition: "sunny" as WeatherCondition,
    conditionText: "Sunny",
    feelsLike: 74,
    high: 76,
    low: 58,
    isCurrentLocation: true,
    gradient: "day",
  },
  {
    id: "1",
    city: "New York",
    time: "3:34 PM",
    date: "Tuesday, January 7",
    temperature: 45,
    condition: "cloudy" as WeatherCondition,
    conditionText: "Cloudy",
    feelsLike: 42,
    high: 48,
    low: 38,
    isCurrentLocation: false,
    gradient: "cloudy",
  },
  {
    id: "2",
    city: "London",
    time: "8:34 PM",
    date: "Tuesday, January 7",
    temperature: 52,
    condition: "rainy" as WeatherCondition,
    conditionText: "Light Rain",
    feelsLike: 48,
    high: 54,
    low: 46,
    isCurrentLocation: false,
    gradient: "rainy",
  },
];

export default function App() {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  const currentCity = citiesData[currentCityIndex];
  const currentGradient = gradients[currentCity.gradient as keyof typeof gradients] || gradients.day;

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
          <Search size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <MoreHorizontal size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Weather */}
        <CurrentWeather
          city={currentCity.city}
          time={currentCity.time}
          date={currentCity.date}
          temperature={currentCity.temperature}
          condition={currentCity.condition}
          conditionText={currentCity.conditionText}
          feelsLike={currentCity.feelsLike}
          high={currentCity.high}
          low={currentCity.low}
          isCurrentLocation={currentCity.isCurrentLocation}
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
                  <MapPin size={6} color="#000" />
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
          <HourlyForecast hours={mockHourlyData} />
        </View>

        {/* Daily Forecast */}
        <View style={styles.section}>
          <DailyForecast days={mockDailyData} tempRange={{ min: 50, max: 80 }} />
        </View>

        {/* Weather Details Grid */}
        <View style={styles.lastSection}>
          <WeatherDetailsGrid details={mockWeatherDetails} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
