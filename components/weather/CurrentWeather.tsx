import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MapPin } from "lucide-react-native";
import WeatherIcon, { WeatherCondition } from "./WeatherIcon";

interface CurrentWeatherProps {
    city: string;
    time: string;
    date: string;
    temperature: number;
    condition: WeatherCondition;
    conditionText: string;
    feelsLike: number;
    high: number;
    low: number;
    isCurrentLocation?: boolean;
    temperatureUnit: 'F' | 'C';
}

export type { CurrentWeatherProps };

export const CurrentWeather = ({
    city,
    time,
    date,
    temperature,
    condition,
    conditionText,
    feelsLike,
    high,
    low,
    isCurrentLocation = false,
    temperatureUnit,
}: CurrentWeatherProps) => {
    return (
        <View style={styles.container}>
            {/* Location */}
            <View style={styles.locationContainer}>
                {isCurrentLocation && <MapPin size={16} color="rgba(255,255,255,0.8)" />}
                <Text style={styles.city}>{city}</Text>
            </View>

            {/* Time & Date */}
            <Text style={styles.time}>
                {time} · {date}
            </Text>

            {/* Weather Icon */}
            <View style={styles.iconContainer}>
                <WeatherIcon condition={condition} size="hero" />
            </View>

            {/* Temperature */}
            <View style={styles.tempContainer}>
                <Text style={styles.temperature}>{temperature}</Text>
                <Text style={styles.degree}>°</Text>
            </View>

            {/* Condition */}
            <Text style={styles.condition}>{conditionText}</Text>

            {/* High/Low & Feels Like */}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                    H:{high}°{temperatureUnit} L:{low}°{temperatureUnit}
                </Text>
                <View style={styles.dot} />
                <Text style={styles.detailText}>Feels like {feelsLike}°{temperatureUnit}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 32,
        paddingBottom: 32,
        paddingHorizontal: 24,
        position: 'relative',
        zIndex: 10,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    city: {
        fontSize: 24,
        fontWeight: '600',
        color: 'white',
    },
    time: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 24,
    },
    iconContainer: {
        marginBottom: 8,
    },
    tempContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative',
    },
    temperature: {
        fontSize: 96,
        fontWeight: '200',
        color: 'white',
        letterSpacing: -2,
    },
    degree: {
        fontSize: 48,
        fontWeight: '300',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    condition: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        marginTop: 4,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 8,
    },
    detailText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: '500',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

export default CurrentWeather;
