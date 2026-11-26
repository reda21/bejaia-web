'use client';

import React, { useState } from 'react';
import { MapPin, ExternalLink, Search, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';

interface OsmPlaceItem {
  title: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  uri: string;
}

interface OsmSearchResponse {
  query: string;
  places: OsmPlaceItem[];
  source: string;
  error?: string;
}

interface OsmPlacesPanelProps {
  defaultQuery?: string;
  title?: string;
  subtitle?: string;
  suggestedQueries?: string[];
  lat?: number;
  lng?: number;
  compact?: boolean;
}

export function OsmPlacesPanel({
  defaultQuery = '',
  title,
  subtitle,
  suggestedQueries = [],
  lat,
  lng,
  compact = false,
}: OsmPlacesPanelProps) {
  const { locale, t } = useApp();
  const [query, setQuery] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OsmSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async (searchText: string) => {
    const cleaned = searchText.trim();
    if (!cleaned) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/osm-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: cleaned,
          locale,
          lat,
          lng,
        }),
      });
      const data = (await res.json()) as OsmSearchResponse;

      if (!res.ok) {
        setError(data.error || 'Impossible de récupérer les lieux sur OpenStreetMap.');
        setResult(null);
      } else {
        setResult(data);
      }
    } catch {
      setError('Erreur réseau lors de la consultation d’OpenStreetMap.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch(query);
  };

  return (
    <div
      className={`bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg ${
        compact ? 'p-5' : 'p-6 md:p-8'
      }`}
    >
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-[#087E9B]">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>OpenFreeMap · OpenStreetMap</span>
        </div>
        <h3 className="font-serif text-xl font-semibold text-[#103B50]">
          {title || t('map.groundingSearchTitle')}
        </h3>
        {subtitle && <p className="text-sm text-[#51636D] leading-relaxed">{subtitle}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#51636D] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('map.groundingSearchPlaceholder')}
            className="w-full ps-10 pe-3.5 py-2.5 bg-white border border-[#103B50]/15 rounded-md text-sm text-[#102530] placeholder:text-[#51636D]/70"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#087E9B] hover:bg-[#103B50] disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('detail.groundingLoading')}</span>
            </>
          ) : (
            <span>{t('map.groundingSearchButton')}</span>
          )}
        </button>
      </form>

      {suggestedQueries.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestedQueries.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion);
                void runSearch(suggestion);
              }}
              className="text-xs px-3 py-1.5 bg-white hover:bg-[#F4EFE5] text-[#103B50] border border-[#103B50]/15 rounded-md transition-colors text-start"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3.5 bg-white border border-[#C47B55]/50 rounded-md flex items-start gap-2.5 text-sm text-[#103B50]">
          <AlertCircle className="w-4 h-4 text-[#C47B55] shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-5 pt-5 border-t border-[#103B50]/10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#51636D]">
            {t('common.googleMapsSources')} ({result.places.length})
          </p>

          {result.places.length === 0 ? (
            <p className="text-sm text-[#51636D]">
              Aucun point d’intérêt indexé trouvé sur OpenStreetMap pour cette requête dans la Wilaya de Béjaïa.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.places.map((place) => (
                <li
                  key={`${place.lat}-${place.lng}-${place.title}`}
                  className="bg-white border border-[#103B50]/10 rounded-md p-3.5 space-y-1"
                >
                  <a
                    href={place.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#087E9B] hover:text-[#103B50]"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="underline underline-offset-2">{place.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                  <p className="text-xs text-[#51636D] line-clamp-2">{place.address}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
