# Sky Hue - React Native Weather App

A beautiful weather application built with React Native and Expo, converted from the original React web app.

## Features

- 🌤️ **Beautiful Weather Display** - Stunning gradient backgrounds that change based on weather conditions
- 📍 **Multiple Locations** - Swipe between different cities to view their weather
- ⏰ **Hourly & Daily Forecasts** - Detailed weather predictions
- 🎨 **Smooth Animations** - Powered by React Native Reanimated
- 📱 **Native Performance** - Built with Expo for iOS and Android

## Technology Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **NativeWind** - Tailwind CSS for React Native
- **React Native Reanimated** - High-performance animations
- **React Native Gesture Handler** - Touch gestures
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **Lucide React Native** - Icon library
- **React Query** - Data fetching and caching

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. Navigate to the project directory:
```bash
cd sky-hue-native
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

## Project Structure

```
sky-hue-native/
├── components/
│   ├── weather/          # Weather-specific components
│   │   ├── WeatherIcon.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── DailyForecast.tsx
│   │   ├── WeatherAlert.tsx
│   │   └── WeatherDetailsGrid.tsx
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
├── styles/               # Style configurations
│   └── gradients.ts      # Weather gradient definitions
├── App.tsx               # Main application component
├── global.css            # Global Tailwind styles
└── tailwind.config.js    # Tailwind configuration
```

## Features in Detail

### Swipe Navigation
Swipe left or right to navigate between different cities and their weather conditions.

### Dynamic Backgrounds
Background gradients automatically change based on the current weather condition:
- ☀️ Sunny - Bright blue gradient
- 🌙 Night - Dark blue gradient
- ☁️ Cloudy - Gray gradient
- 🌧️ Rainy - Deep blue gradient

### Weather Components
- **Current Weather** - Large display of current temperature and conditions
- **Hourly Forecast** - Horizontal scroll of upcoming hours
- **Daily Forecast** - 10-day forecast with temperature ranges
- **Weather Alerts** - Important weather warnings
- **Weather Details** - Humidity, wind, UV index, visibility, pressure, and more

## Conversion Notes

This React Native app was converted from the original React web application with the following changes:

- **Framer Motion → React Native Reanimated** - All animations converted to native animations
- **HTML/CSS → React Native Components** - All web components converted to native equivalents
- **Tailwind CSS → NativeWind** - Styling approach maintained with NativeWind
- **React Router → Gesture Handler** - Navigation implemented with swipe gestures

## Development

### Adding New Cities
Edit the `citiesData` array in `App.tsx` to add more cities.

### Customizing Gradients
Modify `styles/gradients.ts` to change the background gradients for different weather conditions.

### Adding Weather Conditions
Update the `WeatherCondition` type in `components/weather/WeatherIcon.tsx` and add corresponding icons.

## Building for Production

```bash
# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

## License

This project is part of the Sky Hue weather app family.

## Acknowledgments

- Original React web app design
- Expo team for the amazing development platform
- NativeWind for bringing Tailwind to React Native
- Lucide for beautiful icons
