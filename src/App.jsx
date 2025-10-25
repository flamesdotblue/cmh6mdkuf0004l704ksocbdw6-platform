import { useEffect, useState } from 'react';
import HeroCover from './components/HeroCover';
import SearchBar from './components/SearchBar';
import WeatherSummary from './components/WeatherSummary';
import ForecastList from './components/ForecastList';
import { fetchLocationByName, fetchWeatherByCoords } from './utils/weather';

export default function App() {
  const [location, setLocation] = useState(null); // { name, country, latitude, longitude }
  const [current, setCurrent] = useState(null); // current weather object
  const [daily, setDaily] = useState([]); // array of daily forecast
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load a nice default city on first render
    handleSearch('San Francisco');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(query) {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const place = await fetchLocationByName(query);
      if (!place) {
        setError('No matching location found. Try a different search.');
        setLoading(false);
        return;
      }
      setLocation({
        name: place.name,
        country: place.country_code || place.country || '',
        latitude: place.latitude,
        longitude: place.longitude,
      });
      const data = await fetchWeatherByCoords(place.latitude, place.longitude);
      setCurrent(data.current);
      setDaily(data.daily);
    } catch (e) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode a name using Open-Meteo's API (best effort)
          const rev = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
          ).then((r) => r.json());
          const best = rev?.results?.[0];
          const loc = {
            name: best?.name || 'Your Location',
            country: best?.country_code || best?.country || '',
            latitude,
            longitude,
          };
          setLocation(loc);
          const data = await fetchWeatherByCoords(latitude, longitude);
          setCurrent(data.current);
          setDaily(data.daily);
        } catch (e) {
          setError('Unable to get weather for your location.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Permission denied for location.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroCover />

      <section className="relative z-10 mx-auto max-w-5xl px-4 -mt-24">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
          <SearchBar onSearch={handleSearch} onUseMyLocation={handleUseMyLocation} loading={loading} />
          {error && (
            <div className="mt-3 rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-5xl px-4 mt-8 space-y-8 pb-20">
        <WeatherSummary location={location} current={current} loading={loading} />
        <ForecastList daily={daily} />
      </main>
    </div>
  );
}
