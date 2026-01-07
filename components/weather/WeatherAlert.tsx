import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertTriangle } from "lucide-react-native";

interface WeatherAlertData {
    id: string;
    type: "warning" | "watch" | "advisory";
    title: string;
    description: string;
    time: string;
}

interface WeatherAlertProps {
    alerts: WeatherAlertData[];
}

export const WeatherAlert = ({ alerts }: WeatherAlertProps) => {
    if (!alerts || alerts.length === 0) return null;

    const alert = alerts[0];

    const getAlertColor = () => {
        switch (alert.type) {
            case "warning":
                return "#EF4444";
            case "watch":
                return "#F59E0B";
            case "advisory":
                return "#3B82F6";
            default:
                return "#F59E0B";
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.card, { borderLeftColor: getAlertColor() }]}>
                <View style={styles.content}>
                    <AlertTriangle size={20} color={getAlertColor()} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{alert.title}</Text>
                        <Text style={styles.description} numberOfLines={2}>
                            {alert.description}
                        </Text>
                        <Text style={styles.time}>{alert.time}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: 16,
        borderLeftWidth: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 4,
    },
    description: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        marginBottom: 8,
    },
    time: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
    },
});

export default WeatherAlert;
