// Gradient configurations for different weather conditions
export const gradients = {
    day: {
        colors: ['#87CEEB', '#4A90E2', '#2E5C8A'],
        locations: [0, 0.5, 1],
    },
    night: {
        colors: ['#0F2027', '#203A43', '#2C5364'],
        locations: [0, 0.5, 1],
    },
    cloudy: {
        colors: ['#757F9A', '#D7DDE8', '#B0B8C4'],
        locations: [0, 0.5, 1],
    },
    rainy: {
        colors: ['#4B6CB7', '#182848', '#2C3E50'],
        locations: [0, 0.5, 1],
    },
    sunny: {
        colors: ['#FFD89B', '#19547B', '#1E3A5F'],
        locations: [0, 0.5, 1],
    },
};

export type GradientType = keyof typeof gradients;
