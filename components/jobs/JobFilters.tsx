"use client";

import { useState } from "react";
import { Search, MapPin, Globe, Filter } from "lucide-react";

interface JobFiltersProps {
  onSearch: (filters: { query: string; location: string; remoteOnly: boolean; country: string }) => void;
  loading?: boolean;
}

export default function JobFilters({ onSearch, loading }: JobFiltersProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [country, setCountry] = useState("us");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ query, location, remoteOnly, country });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Keyword Input */}
        <div className="md:col-span-5 relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--content-muted)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, keywords, or company (e.g. Frontend, React, Vercel)"
            className="input-field pl-10 text-sm"
          />
        </div>

        {/* Location Input */}
        <div className="md:col-span-4 relative">
          <MapPin
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--content-muted)" }}
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or postal code"
            className="input-field pl-10 text-sm"
          />
        </div>

        {/* Country Selector */}
        <div className="md:col-span-3">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input-field text-sm cursor-pointer"
          >
            <option value="us">🇺🇸 United States</option>
            <option value="gb">🇬🇧 United Kingdom</option>
            <option value="ca">🇨🇦 Canada</option>
            <option value="au">🇦🇺 Australia</option>
            <option value="de">🇩🇪 Germany</option>
          </select>
        </div>
      </div>

      {/* Filter Row: Remote toggle & Search action button */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--surface-border)]">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[var(--content-secondary)] hover:text-[var(--content-primary)] transition-colors">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--surface-border)] bg-[var(--surface-input)] text-[var(--accent-primary)] focus:ring-0 cursor-pointer"
          />
          <Globe size={14} className="text-[var(--accent-primary)]" />
          <span>Remote jobs only</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 text-xs py-2 px-5"
        >
          <Filter size={14} />
          {loading ? "Searching..." : "Find Jobs"}
        </button>
      </div>
    </form>
  );
}
