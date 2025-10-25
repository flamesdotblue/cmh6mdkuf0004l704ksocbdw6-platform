import { MapPin, Thermometer, Wind, Droplets } from 'lucide-react';
import { weatherCodeToInfo } from '../utils/weather';

export default function WeatherSummary({ location, current, loading }) {
  if (loading && !current) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-white/10 rounded" />
          <div className="h-10 w-64 bg-white/10 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="h-16 bg-white/10 rounded" />
            <div className="h-16 bg-white/10 rounded" />
            <div className="h-16 bg-white/10 rounded" />
            <div className="h-16 bg-white/10 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!current) return null;

  const info = weatherCodeToInfo(current.weather_code);

  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {location?.name || '—'}{location?.country ? `, ${location.country}` : ''}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{info.label}</h2>
          <p className="text-white/60 text-sm">{info.description}</p>
        </div>
        <div className="text-right">
          <div className="text-5xl sm:text-6xl font-semibold">
            {Math.round(current.temperature_2m)}°
          </div>
          <div className="text-white/60 text-sm">Feels like {Math.round(current.apparent_temperature)}°</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Stat icon={<Thermometer className="h-4 w-4" />} label="Temperature" value={`${Math.round(current.temperature_2m)}°C`} />
        <Stat icon={<Droplets className="h-4 w-4" />} label="Humidity" value={`${Math.round(current.relative_humidity_2m)}%`} />
        <Stat icon={<Wind className="h-4 w-4" />} label="Wind" value={`${Math.round(current.wind_speed_10m)} km/h`} />
        <Stat icon={<span className="inline-block h-3 w-3 rounded-full" style={{ background: info.color }} /> } label="Condition" value={info.label} />
      </div>
    </section>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/70">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
