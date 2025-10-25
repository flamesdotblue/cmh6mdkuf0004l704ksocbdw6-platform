import { useState } from 'react';
import { Search, MapPin, Locate } from 'lucide-react';

export default function SearchBar({ onSearch, onUseMyLocation, loading }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
        <MapPin className="h-5 w-5 text-white/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city or place (e.g., Tokyo, London)"
          className="w-full bg-transparent outline-none placeholder-white/40 text-white"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onUseMyLocation}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition disabled:opacity-50"
        >
          <Locate className="h-4 w-4" />
          <span className="hidden sm:inline">Use my location</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-3 py-2 hover:bg-emerald-500/30 transition text-emerald-200 disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
