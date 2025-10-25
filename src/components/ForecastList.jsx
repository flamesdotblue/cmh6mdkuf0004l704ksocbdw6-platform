import { weatherCodeToInfo } from '../utils/weather';

export default function ForecastList({ daily }) {
  if (!daily || daily.length === 0) return null;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold mb-4">7-day forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.slice(0, 7).map((d) => {
          const info = weatherCodeToInfo(d.weather_code);
          const date = new Date(d.date);
          const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
          const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          return (
            <div key={d.date} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-4">
              <div className="text-sm text-white/70">{weekday}</div>
              <div className="text-xs text-white/50">{day}</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: info.color }} />
                <span className="text-sm truncate" title={info.label}>{info.label}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-white">{Math.round(d.temperature_2m_max)}°</span>
                <span className="text-white/60">{Math.round(d.temperature_2m_min)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
