import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import WeatherIcon, { WeatherCondition } from "./WeatherIcon";
import { Droplets } from "lucide-react-native";

interface DayData {
    day: string;
    date: string;
    condition: WeatherCondition;
    precipitation: number;
    high: number;
    low: number;
    isToday?: boolean;
}

interface DailyForecastProps {
    days: DayData[];
    tempRange: { min: number; max: number };
}

export const DailyForecast = ({ days, tempRange }: DailyForecastProps) => {
    const getTempPosition = (temp: number) => {
        const range = tempRange.max - tempRange.min;
        return ((temp - tempRange.min) / range) * 100;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>10-Day Forecast</Text>

            <View>
                {days.map((day, index) => (
                    <View key={day.date}>
                        {index > 0 && <View style={styles.separator} />}
                        <View style={styles.dayRow}>
                            {/* Day */}
                            <View style={styles.dayLabel}>
                                <Text style={[
                                    styles.dayText,
                                    day.isToday && styles.dayTextToday
                                ]}>
                                    {day.isToday ? "Today" : day.day}
                                </Text>
                            </View>

                            {/* Icon & Precipitation */}
                            <View style={styles.iconContainer}>
                                <WeatherIcon
                                    condition={day.condition}
                                    size="sm"
                                    animated={false}
                                    color="white"
                                />
                                {day.precipitation > 0 && (
                                    <View style={styles.precipitation}>
                                        <Droplets size={12} color="#60A5FA" />
                                        <Text style={styles.precipitationText}>
                                            {day.precipitation}%
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Low Temp */}
                            <Text style={styles.lowTemp}>{day.low}°</Text>

                            {/* Temperature Bar */}
                            <View style={styles.tempBar}>
                                <View
                                    style={[
                                        styles.tempBarFill,
                                        {
                                            left: `${getTempPosition(day.low)}%`,
                                            right: `${100 - getTempPosition(day.high)}%`,
                                        }
                                    ]}
                                >
                                    <LinearGradient
                                        colors={["#60A5FA", "#F59E0B", "#EF4444"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.gradient}
                                    />
                                </View>
                                {day.isToday && (
                                    <View
                                        style={[
                                            styles.todayDot,
                                            {
                                                left: `${getTempPosition((day.high + day.low) / 2)}%`,
                                            }
                                        ]}
                                    />
                                )}
                            </View>

                            {/* High Temp */}
                            <Text style={styles.highTemp}>{day.high}°</Text>
                        </View>
                    </View>
                ))}
            </View>
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
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 12,
    },
    dayLabel: {
        width: 64,
        flexShrink: 0,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    dayTextToday: {
        color: 'white',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        width: 56,
        flexShrink: 0,
    },
    precipitation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    precipitationText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#60A5FA',
    },
    lowTemp: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.6)',
        width: 32,
        textAlign: 'right',
    },
    tempBar: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        position: 'relative',
        marginHorizontal: 8,
    },
    tempBarFill: {
        position: 'absolute',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
    },
    todayDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        top: -2,
    },
    highTemp: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        width: 32,
    },
});

export default DailyForecast;
