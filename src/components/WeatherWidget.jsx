import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, Wind, CloudRain, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function WeatherWidget({ t }) {
  const [taluka, setTaluka] = useState('Gondal');
  const [talukaList, setTalukaList] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTalukas() {
      const list = await api.getTalukas();
      setTalukaList(list);
    }
    loadTalukas();
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      const data = await api.getWeather(taluka);
      setWeather(data);
      setLoading(false);
    }
    fetchWeather();
  }, [taluka]);

  return (
    <div className="weather-widget">
      {/* Header & Taluka Selector */}
      <div className="weather-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CloudSun size={22} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{t.weatherTitle}</h3>
          </div>
          <select
            value={taluka}
            onChange={(e) => setTaluka(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {talukaList.map((item, idx) => (
              <option key={idx} value={item.taluka} style={{ color: '#1f2937' }}>
                {item.name || item.taluka}
              </option>
            ))}
          </select>
          <p className="weather-temp">{loading ? '...' : weather?.temperature || '28°C'}</p>
          <p style={{ color: '#bfdbfe', fontSize: '0.8rem' }}>
            Feels like: {weather?.feelsLike || '29°C'} • {weather?.forecastSummary || 'Optimal Farming Weather'}
          </p>
        </div>

        <div className="weather-details" style={{ textAlign: 'right' }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
            <Droplets size={14} /> {t.humidity}: {weather?.humidity || '65%'}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
            <CloudRain size={14} /> {t.rainChance}: {weather?.rainProbability || '10%'}
          </p>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
            <Wind size={14} /> {t.wind}: {weather?.windSpeed || '12 km/h'}
          </p>
        </div>
      </div>

      {/* AI Agricultural Advisory Alert Box */}
      <div className="weather-advisory">
        <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={16} style={{ color: '#fef08a' }} />
          {t.aiAdvisory}: {weather?.advisory?.alertLevel || 'Normal'}
        </p>
        <p style={{ marginTop: '4px', fontSize: '0.85rem', lineHeight: '1.4' }}>
          {weather?.advisory?.headline || 'Optimal conditions for harvesting produce this week.'}
        </p>
        {weather?.advisory?.recommendations && weather.advisory.recommendations.length > 0 && (
          <ul style={{ marginTop: '6px', paddingLeft: '16px', fontSize: '0.78rem', color: '#e0f2fe' }}>
            {weather.advisory.recommendations.map((rec, i) => (
              <li key={i} style={{ marginBottom: '2px' }}>{rec}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
