import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
    Droplets,
    Wind,
    Eye,
    Gauge,
    Sunrise,
    Sunset,
    Sun,
} from "lucide-react-native";

interface WeatherDetailsData {
    humidity: number;
    windSpeed: number;
    windDirection: string;
    uvIndex: number;
    visibility: number;
    pressure: number;
    pressureTrend: "rising" | "falling" | "steady";
    dewPoint: number;
    sunrise: string;
    sunset: string;
    moonPhase: string;
}

interface WeatherDetailsGridProps {
    details: WeatherDetailsData;
}

const DetailCard = ({
    icon: Icon,
    label,
    value,
    unit,
    color = "white",
}: {
    icon: any;
    label: string;
    value: string | number;
    unit?: string;
    color?: string;
}) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Icon size={16} color={color} />
            <Text style={styles.cardLabel}>{label}</Text>
        </View>
        <Text style={styles.cardValue}>
            {value}
            {unit && <Text style={styles.cardUnit}>{unit}</Text>}
        </Text>
    </View>
);

export const WeatherDetailsGrid = ({ details }: WeatherDetailsGridProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weather Details</Text>
            <View style={styles.grid}>
                <DetailCard
                    icon={Droplets}
                    label="Humidity"
                    value={details.humidity}
                    unit="%"
                    color="#60A5FA"
                />
                <DetailCard
                    icon={Wind}
                    label="Wind"
                    value={`${details.windSpeed} ${details.windDirection}`}
                    unit=" mph"
                    color="#A78BFA"
                />
                <DetailCard
                    icon={Sun}
                    label="UV Index"
                    value={details.uvIndex}
                    color="#F59E0B"
                />
                <DetailCard
                    icon={Eye}
                    label="Visibility"
                    value={details.visibility}
                    unit=" mi"
                    color="#CBD5E1"
                />
                <DetailCard
                    icon={Gauge}
                    label="Pressure"
                    value={details.pressure}
                    unit=" mb"
                    color="#94A3B8"
                />
                <DetailCard
                    icon={Droplets}
                    label="Dew Point"
                    value={details.dewPoint}
                    unit="°"
                    color="#60A5FA"
                />
                <DetailCard
                    icon={Sunrise}
                    label="Sunrise"
                    value={details.sunrise}
                    color="#FDB813"
                />
                <DetailCard
                    icon={Sunset}
                    label="Sunset"
                    value={details.sunset}
                    color="#F97316"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        flex: 1,
        minWidth: '45%',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    cardLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: '500',
    },
    cardValue: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
    },
    cardUnit: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});

export default WeatherDetailsGrid;
