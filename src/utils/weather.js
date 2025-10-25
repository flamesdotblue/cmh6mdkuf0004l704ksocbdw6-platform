// Utilities for fetching and transforming Open-Meteo data

export async function fetchLocationByName(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed geocoding');
  const data = await res.json();
  return data?.results?.[0] || null;
}

export async function fetchWeatherByCoords(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'relative_humidity_2m',
    ].join(','),
    hourly: ['temperature_2m', 'weather_code'].join(','),
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'].join(','),
    timezone: 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed weather fetch');
  const json = await res.json();

  const current = {
    temperature_2m: json?.current?.temperature_2m,
    apparent_temperature: json?.current?.apparent_temperature,
    weather_code: json?.current?.weather_code,
    wind_speed_10m: json?.current?.wind_speed_10m,
    relative_humidity_2m: json?.current?.relative_humidity_2m,
  };

  const daily = (json?.daily?.time || []).map((date, i) => ({
    date,
    weather_code: json.daily.weather_code?.[i],
    temperature_2m_max: json.daily.temperature_2m_max?.[i],
    temperature_2m_min: json.daily.temperature_2m_min?.[i],
  }));

  return { current, daily };
}

export function weatherCodeToInfo(code) {
  // Subset mapping for common weather codes per Open-Meteo
  const map = {
    0: { label: 'Clear', description: 'Sunny and clear skies', color: '#22c55e' },
    1: { label: 'Mainly clear', description: 'Mostly clear', color: '#34d399' },
    2: { label: 'Partly cloudy', description: 'Some clouds', color: '#4ade80' },
    3: { label: 'Overcast', description: 'Cloudy', color: '#a3a3a3' },
    45: { label: 'Fog', description: 'Fog or mist', color: '#9ca3af' },
    48: { label: 'Depositing rime fog', description: 'Freezing fog', color: '#93c5fd' },
    51: { label: 'Light drizzle', description: 'Light drizzle', color: '#60a5fa' },
    53: { label: 'Drizzle', description: 'Drizzle', color: '#3b82f6' },
    55: { label: 'Dense drizzle', description: 'Heavy drizzle', color: '#2563eb' },
    61: { label: 'Light rain', description: 'Light rain', color: '#60a5fa' },
    63: { label: 'Rain', description: 'Moderate rain', color: '#3b82f6' },
    65: { label: 'Heavy rain', description: 'Heavy rain', color: '#1d4ed8' },
    71: { label: 'Light snow', description: 'Light snow', color: '#e5e7eb' },
    73: { label: 'Snow', description: 'Snow', color: '#d1d5db' },
    75: { label: 'Heavy snow', description: 'Heavy snow', color: '#9ca3af' },
    80: { label: 'Rain showers', description: 'Rain showers', color: '#38bdf8' },
    81: { label: 'Heavy showers', description: 'Heavy showers', color: '#0ea5e9' },
    82: { label: 'Violent showers', description: 'Severe showers', color: '#0284c7' },
    95: { label: 'Thunderstorm', description: 'Thunderstorm', color: '#f59e0b' },
    96: { label: 'Thunderstorm with hail', description: 'Storm with hail', color: '#f97316' },
    99: { label: 'Severe thunderstorm', description: 'Severe storm', color: '#ef4444' },
  };

  return map[code] || { label: 'Unknown', description: 'Conditions unavailable', color: '#a3a3a3' };
}
