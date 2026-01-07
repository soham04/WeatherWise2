import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import WeatherIcon, { WeatherCondition } from "./WeatherIcon";
import { Droplets } from "lucide-react-native";

interface HourData {
    time: string;
    temperature: number;
    condition: WeatherCondition;
    precipitation: number;
    isNow?: boolean;
}

interface HourlyForecastProps {
    hours: HourData[];
}

export const HourlyForecast = ({ hours }: HourlyForecastProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hourly Forecast</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {hours.map((hour, index) => (
                    <View
                        key={hour.time}
                        style={[
                            styles.hourCard,
                            hour.isNow && styles.hourCardCurrent
                        ]}
                    >
                        <Text style={[
                            styles.time,
                            hour.isNow && styles.timeCurrent
                        ]}>
                            {hour.isNow ? "Now" : hour.time}
                        </Text>

                        <WeatherIcon
                            condition={hour.condition}
                            size="md"
                            animated={hour.isNow}
                            color="white"
                        />

                        {hour.precipitation > 0 && (
                            <View style={styles.precipitation}>
                                <Droplets size={12} color="#60A5FA" />
                                <Text style={styles.precipitationText}>
                                    {hour.precipitation}%
                                </Text>
                            </View>
                        )}

                        <Text style={[
                            styles.temperature,
                            hour.isNow && styles.temperatureCurrent
                        ]}>
                            {hour.temperature}°
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 24,
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    scrollContent: {
        paddingBottom: 8,
        gap: 4,
    },
    hourCard: {
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 60,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 16,
    },
    hourCardCurrent: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    time: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 12,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    timeCurrent: {
        color: 'white',
    },
    precipitation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 8,
    },
    precipitationText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#60A5FA',
    },
    temperature: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    temperatureCurrent: {
        color: 'white',
    },
});

export default HourlyForecast;
