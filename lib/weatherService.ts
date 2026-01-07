import { WeatherCondition } from "../components/weather/WeatherIcon";

const API_KEY = "8bfe02f37a709411058126bffc4d3352";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// OpenWeather API response types
interface OpenWeatherCurrent {
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  sys: { sunrise: number; sunset: number };
  visibility: number;
  dt: number;
  timezone: number;
  name: string;
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  wind: { speed: number; deg: number };
  pop: number; // Probability of precipitation
  dt_txt: string;
}

interface OpenWeatherForecast {
  list: ForecastItem[];
  city: { timezone: number; sunrise: number; sunset: number };
}

// Map OpenWeather condition codes to our WeatherCondition types
export function mapWeatherCondition(weatherId: number, icon?: string): WeatherCondition {
  // Icon contains 'n' for night, 'd' for day
  const isNight = icon?.includes("n");

  // OpenWeather weather condition IDs
  // 2xx: Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return "stormy";
  }
  // 3xx: Drizzle
  if (weatherId >= 300 && weatherId < 400) {
    return "drizzle";
  }
  // 5xx: Rain
  if (weatherId >= 500 && weatherId < 600) {
    return "rainy";
  }
  // 6xx: Snow
  if (weatherId >= 600 && weatherId < 700) {
    return "snowy";
  }
  // 7xx: Atmosphere (fog, mist, etc.)
  if (weatherId >= 700 && weatherId < 800) {
    return "foggy";
  }
  // 800: Clear
  if (weatherId === 800) {
    return isNight ? "clear-night" : "sunny";
  }
  // 80x: Clouds
  if (weatherId > 800 && weatherId < 803) {
    return isNight ? "partly-cloudy-night" : "partly-cloudy";
  }
  if (weatherId >= 803) {
    return "cloudy";
  }

  return "sunny";
}

// Convert wind degree to direction
function getWindDirection(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

// Format time from Unix timestamp
function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

// Format date
function formatDate(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  
  return `${dayName}, ${monthName} ${day}`;
}

// Get short day name
function getShortDay(timestamp: number, timezone: number, isToday: boolean = false): string {
  if (isToday) return "Today";
  const date = new Date((timestamp + timezone) * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getUTCDay()];
}

// Get short date
function getShortDate(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

// Fetch current weather data
export async function getCurrentWeather(lat: number, lon: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data: OpenWeatherCurrent = await response.json();
    
    const condition = mapWeatherCondition(data.weather[0].id, data.weather[0].icon);
    
    return {
      city: data.name,
      time: formatTime(data.dt, data.timezone),
      date: formatDate(data.dt, data.timezone),
      temperature: Math.round(data.main.temp),
      condition,
      conditionText: data.weather[0].main,
      feelsLike: Math.round(data.main.feels_like),
      high: Math.round(data.main.temp_max),
      low: Math.round(data.main.temp_min),
      details: {
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        windDirection: getWindDirection(data.wind.deg),
        visibility: Math.round(data.visibility / 1609.34), // Convert meters to miles
        pressure: data.main.pressure,
        sunrise: formatTime(data.sys.sunrise, data.timezone),
        sunset: formatTime(data.sys.sunset, data.timezone),
      },
      timezone: data.timezone,
    };
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

// Fetch hourly forecast (from 5-day/3-hour forecast)
export async function getHourlyForecast(lat: number, lon: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }
    
    const data: OpenWeatherForecast = await response.json();
    
    // Take first 9 items (next 24-27 hours in 3-hour intervals)
    const hourlyData = data.list.slice(0, 9).map((item, index) => {
      const date = new Date(item.dt * 1000);
      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      
      return {
        time: index === 0 ? "Now" : `${hours} ${ampm}`,
        temperature: Math.round(item.main.temp),
        condition: mapWeatherCondition(item.weather[0].id, item.weather[0].icon),
        precipitation: Math.round(item.pop * 100),
        isNow: index === 0,
      };
    });
    
    return hourlyData;
  } catch (error) {
    console.error("Error fetching hourly forecast:", error);
    throw error;
  }
}

// Fetch daily forecast (aggregate from 5-day/3-hour forecast)
export async function getDailyForecast(lat: number, lon: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }
    
    const data: OpenWeatherForecast = await response.json();
    
    // Group by date
    const dailyMap = new Map<string, ForecastItem[]>();
    
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split("T")[0];
      
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, []);
      }
      dailyMap.get(dateKey)!.push(item);
    });
    
    // Convert to daily forecast (take up to 7 days)
    const dailyForecasts = Array.from(dailyMap.entries())
      .slice(0, 7)
      .map(([dateKey, items], index) => {
        // Find max and min temps
        const temps = items.map((i) => i.main.temp);
        const high = Math.round(Math.max(...temps));
        const low = Math.round(Math.min(...temps));
        
        // Use midday forecast for condition (around 12pm)
        const middayItem = items.find((i) => {
          const hour = new Date(i.dt * 1000).getHours();
          return hour >= 12 && hour <= 15;
        }) || items[0];
        
        // Average precipitation probability
        const avgPrecip = Math.round(
          items.reduce((sum, i) => sum + i.pop, 0) / items.length * 100
        );
        
        const firstItem = items[0];
        
        return {
          day: getShortDay(firstItem.dt, data.city.timezone, index === 0),
          date: getShortDate(firstItem.dt, data.city.timezone),
          condition: mapWeatherCondition(middayItem.weather[0].id, middayItem.weather[0].icon),
          precipitation: avgPrecip,
          high,
          low,
          isToday: index === 0,
        };
      });
    
    return dailyForecasts;
  } catch (error) {
    console.error("Error fetching daily forecast:", error);
    throw error;
  }
}

// Calculate UV Index (simplified - OpenWeather free tier doesn't provide this)
// This is a placeholder function
function calculateUVIndex(lat: number): number {
  // Simplified UV estimation based on latitude
  // Closer to equator = higher UV (this is very simplified)
  const absLat = Math.abs(lat);
  if (absLat < 23.5) return 8; // Tropical
  if (absLat < 35) return 6; // Subtropical
  if (absLat < 50) return 4; // Temperate
  return 2; // Higher latitudes
}

// Get moon phase (simplified)
function getMoonPhase(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simplified moon phase calculation
  const c = Math.floor((year - 1900) / 100);
  const e = 2 - c + Math.floor(c / 4);
  const jd = Math.floor(365.25 * (year + 4716)) +
            Math.floor(30.6001 * (month + 1)) + day + e - 1524.5;
  const daysSinceNew = (jd - 2451549.5) % 29.53;
  
  if (daysSinceNew < 1.8) return "New Moon";
  if (daysSinceNew < 7.4) return "Waxing Crescent";
  if (daysSinceNew < 9.1) return "First Quarter";
  if (daysSinceNew < 14.8) return "Waxing Gibbous";
  if (daysSinceNew < 16.6) return "Full Moon";
  if (daysSinceNew < 22.1) return "Waning Gibbous";
  if (daysSinceNew < 23.9) return "Last Quarter";
  return "Waning Crescent";
}

// Get all weather data at once
export async function getAllWeatherData(lat: number, lon: number) {
  try {
    const [current, hourly, daily] = await Promise.all([
      getCurrentWeather(lat, lon),
      getHourlyForecast(lat, lon),
      getDailyForecast(lat, lon),
    ]);
    
    return {
      current,
      hourly,
      daily,
      details: {
        ...current.details,
        uvIndex: calculateUVIndex(lat),
        pressureTrend: "steady" as const, // API doesn't provide trend
        dewPoint: Math.round(current.temperature - ((100 - current.details.humidity) / 5)),
        moonPhase: getMoonPhase(),
      },
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
