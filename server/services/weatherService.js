import axios from 'axios';
import { DEFAULT_TALUKAS } from '../config/constants.js';

/**
 * Service to fetch real-time weather and generate Agricultural Advisories
 */
export const getWeatherByCoordinates = async (latitude, longitude, talukaName = 'Local Taluka') => {
  try {
    // Open-Meteo API: High-accuracy free weather forecast without API key
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata`;

    const response = await axios.get(url, { timeout: 6000 });
    const current = response.data.current;
    const daily = response.data.daily;

    const temp = Math.round(current.temperature_2m);
    const humidity = current.relative_humidity_2m;
    const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
    const windSpeed = current.wind_speed_10m;

    // Generate Contextual Agricultural Advisory
    const advisory = generateAgriAdvisory(temp, humidity, rainProb, windSpeed);

    return {
      success: true,
      taluka: talukaName,
      coordinates: { latitude, longitude },
      temperature: `${temp}°C`,
      feelsLike: `${Math.round(current.apparent_temperature)}°C`,
      humidity: `${humidity}%`,
      rainProbability: `${rainProb}%`,
      windSpeed: `${windSpeed} km/h`,
      forecastSummary: rainProb > 50 ? 'Rain Expected' : temp > 33 ? 'Hot & Dry' : 'Favorable Harvesting Weather',
      advisory,
      dailyForecast: daily.time.slice(0, 5).map((date, idx) => ({
        date,
        maxTemp: `${Math.round(daily.temperature_2m_max[idx])}°C`,
        minTemp: `${Math.round(daily.temperature_2m_min[idx])}°C`,
        rainChance: `${daily.precipitation_probability_max[idx]}%`,
      })),
    };
  } catch (error) {
    console.warn('Weather API fallback used:', error.message);
    // Intelligent offline fallback
    return getOfflineWeatherFallback(talukaName);
  }
};

/**
 * Get weather by Taluka Name
 */
export const getWeatherByTaluka = async (talukaQuery) => {
  const matched = DEFAULT_TALUKAS.find(
    (t) => t.taluka.toLowerCase().includes(talukaQuery.toLowerCase()) || t.name.toLowerCase().includes(talukaQuery.toLowerCase())
  );

  const lat = matched ? matched.latitude : 21.9619;
  const lon = matched ? matched.longitude : 70.7923;
  const name = matched ? matched.name : `${talukaQuery} Saurashtra Hub`;

  return await getWeatherByCoordinates(lat, lon, name);
};

/**
 * Agricultural Rule Engine for Weather Advisory
 */
function generateAgriAdvisory(temp, humidity, rainProb, windSpeed) {
  let tips = [];
  let alertLevel = 'Normal';

  if (rainProb > 60) {
    tips.push('Heavy rain likely: Cover harvested produce immediately and delay pesticide spraying.');
    tips.push('Ensure proper drainage in low-lying vegetable patches.');
    alertLevel = 'Rain Warning';
  } else if (rainProb > 30) {
    tips.push('Light showers expected: Suitable for nursery bed prep, avoid chemical fertilizers.');
  } else {
    tips.push('Clear weather: Optimal conditions for harvesting, sun-drying, and market transport.');
  }

  if (humidity > 75) {
    tips.push('High humidity alert: Inspect onion and tomato crops for fungal blight.');
  } else if (humidity < 30) {
    tips.push('Low moisture: Schedule drip irrigation during early morning hours.');
  }

  if (temp > 35) {
    tips.push('Heat stress advisory: Maintain mulching around roots to conserve soil moisture.');
  }

  if (windSpeed > 25) {
    tips.push('High wind speeds: Provide staking support for banana, tomato, and creeper crops.');
  }

  return {
    alertLevel,
    headline: tips[0] || 'Weather conditions are optimal for normal farm activities.',
    recommendations: tips,
  };
}

/**
 * Safe offline fallback with realistic data for Saurashtra region
 */
function getOfflineWeatherFallback(talukaName) {
  return {
    success: true,
    taluka: talukaName || 'Gondal APMC Hub (Rajkot, Saurashtra)',
    temperature: '31°C',
    feelsLike: '33°C',
    humidity: '58%',
    rainProbability: '5%',
    windSpeed: '14 km/h',
    forecastSummary: 'Optimal Saurashtra Harvesting Weather',
    advisory: {
      alertLevel: 'Normal',
      headline: 'Optimal dry conditions for harvesting groundnut, cotton, and sun-drying Gondal red chillies.',
      recommendations: [
        'Clear weather: Ideal window for crop harvesting and direct APMC mandi dispatch.',
        'Low rain probability: Perfect for open-air drying of spices and groundnut pods.',
      ],
    },
    isFallback: true,
  };
}
