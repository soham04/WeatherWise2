import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import CurrentWeather from "./CurrentWeather";
import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";
import WeatherAlert from "./WeatherAlert";
import WeatherDetailsGrid from "./WeatherDetailsGrid";
import { TemperatureUnit } from "../../lib/preferencesService";
import { CityWithWeather } from "../../lib/storageService";

interface CityWeatherViewProps {
    city: CityWithWeather;
    temperatureUnit: TemperatureUnit;
    mockAlerts: any[];
    renderPageIndicator: () => React.ReactNode;
}

export default function CityWeatherView({
    city,
    temperatureUnit,
    mockAlerts,
    renderPageIndicator,
}: CityWeatherViewProps) {
    const { weatherData } = city;

    if (!weatherData) return null;

    return (
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
                isCurrentLocation={city.isCurrentLocation || false}
                temperatureUnit={temperatureUnit}
            />

            {/* Page Indicator */}
            <View style={styles.pageIndicatorContainer}>
                {renderPageIndicator()}
            </View>

            {/* Weather Alerts */}
            <WeatherAlert alerts={mockAlerts} />

            {/* Hourly Forecast */}
            <View style={styles.section}>
                <HourlyForecast hours={weatherData.hourly} temperatureUnit={temperatureUnit} />
            </View>

            {/* Daily Forecast */}
            <View style={styles.section}>
                <DailyForecast
                    days={weatherData.daily}
                    tempRange={{
                        min: Math.min(...weatherData.daily.map((d: any) => d.low)),
                        max: Math.max(...weatherData.daily.map((d: any) => d.high))
                    }}
                    temperatureUnit={temperatureUnit}
                />
            </View>

            {/* Weather Details Grid */}
            <View style={styles.lastSection}>
                <WeatherDetailsGrid details={weatherData.details} temperatureUnit={temperatureUnit} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 40,
    },
    pageIndicatorContainer: {
        paddingVertical: 16,
    },
    section: {
        marginBottom: 16,
    },
    lastSection: {
        marginBottom: 32,
    },
});
