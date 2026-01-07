import React from "react";
import { View, StyleSheet } from "react-native";
import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudDrizzle,
    CloudFog,
    Moon,
    Wind,
} from "lucide-react-native";

export type WeatherCondition =
    | "sunny"
    | "clear-night"
    | "partly-cloudy"
    | "partly-cloudy-night"
    | "cloudy"
    | "rainy"
    | "drizzle"
    | "stormy"
    | "snowy"
    | "foggy"
    | "windy";

interface WeatherIconProps {
    condition: WeatherCondition;
    size?: "sm" | "md" | "lg" | "xl" | "hero";
    animated?: boolean;
    color?: string;
}

const sizeMap = {
    sm: 20,
    md: 28,
    lg: 40,
    xl: 64,
    hero: 120,
};

const iconColorMap: Record<WeatherCondition, string> = {
    sunny: "#FDB813",
    "clear-night": "#CBD5E1",
    "partly-cloudy": "#94A3B8",
    "partly-cloudy-night": "#94A3B8",
    cloudy: "#64748B",
    rainy: "#3B82F6",
    drizzle: "#60A5FA",
    stormy: "#8B5CF6",
    snowy: "#E0F2FE",
    foggy: "#94A3B8",
    windy: "#64748B",
};

export const WeatherIcon = ({
    condition,
    size = "md",
    animated = true,
    color,
}: WeatherIconProps) => {
    const iconSize = sizeMap[size];
    const iconColor = color || iconColorMap[condition];

    const getIcon = () => {
        const IconComponent = (() => {
            switch (condition) {
                case "sunny":
                    return Sun;
                case "clear-night":
                    return Moon;
                case "partly-cloudy":
                case "partly-cloudy-night":
                    return Cloud;
                case "cloudy":
                    return Cloud;
                case "rainy":
                    return CloudRain;
                case "drizzle":
                    return CloudDrizzle;
                case "stormy":
                    return CloudLightning;
                case "snowy":
                    return CloudSnow;
                case "foggy":
                    return CloudFog;
                case "windy":
                    return Wind;
                default:
                    return Sun;
            }
        })();

        return <IconComponent size={iconSize} color={iconColor} strokeWidth={1.5} />;
    };

    return (
        <View style={styles.container}>
            {getIcon()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default WeatherIcon;
