import { type ClassValue, clsx } from "clsx";

export const getGreeting = () => {
    const hour = new Date().getHours()
    return hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
    return Math.round((fahrenheit - 32) * 5 / 9);
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
    return Math.round((celsius * 9 / 5) + 32);
}

/**
 * Format temperature with proper unit
 */
export function formatTemperature(temp: number, unit: 'F' | 'C'): number {
    return Math.round(temp);
}
