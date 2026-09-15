import { getWeatherByCoordinates, getWeatherByTaluka } from '../services/weatherService.js';
import { DEFAULT_TALUKAS } from '../config/constants.js';

/**
 * @desc    Get Weather Forecast & Agricultural Advisory
 * @route   GET /api/weather
 * @access  Public
 */
export const getWeather = async (req, res, next) => {
  try {
    const { taluka, lat, lon } = req.query;

    if (lat && lon) {
      const weatherData = await getWeatherByCoordinates(parseFloat(lat), parseFloat(lon), taluka || 'Current Location');
      return res.json(weatherData);
    }

    const talukaQuery = taluka || 'Nashik';
    const weatherData = await getWeatherByTaluka(talukaQuery);
    return res.json(weatherData);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Available Talukas for Weather Selector
 * @route   GET /api/weather/talukas
 * @access  Public
 */
export const getSupportedTalukas = (req, res) => {
  res.json({
    success: true,
    talukas: DEFAULT_TALUKAS.map((t) => ({
      taluka: t.taluka,
      name: t.name,
      district: t.district,
      state: t.state,
      latitude: t.latitude,
      longitude: t.longitude,
    })),
  });
};
