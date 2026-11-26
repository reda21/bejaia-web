'use client';

import React, { useEffect, useState } from 'react';
import {
  Car,
  Bus,
  Footprints,
  Clock,
  Route,
  Gauge,
  Navigation,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Loader2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import type {
  Destination,
  ResolvedMapLocation,
  RouteEstimateResponse,
  TravelMode,
} from '@/types';

interface DestinationRouteCalculatorProps {
  destination: Destination;
  resolvedLocation: ResolvedMapLocation | null;
}

const BEJAIA_CENTER_LAT = 36.7515;
const BEJAIA_CENTER_LNG = 5.0567;

const MODE_CONFIG: { id: TravelMode; labelKey: string; icon: React.ElementType }[] = [
  { id: 'car', labelKey: 'routeCalculator.modeCar', icon: Car },
  { id: 'bus', labelKey: 'routeCalculator.modeBus', icon: Bus },
  { id: 'walking', labelKey: 'routeCalculator.modeWalking', icon: Footprints },
];

export function DestinationRouteCalculator({
  destination,
  resolvedLocation,
}: DestinationRouteCalculatorProps) {
  const { locale, t, lt } = useApp();
  const [selectedMode, setSelectedMode] = useState<TravelMode>('car');
  const [resolvedCoords, setResolvedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [estimate, setEstimate] = useState<RouteEstimateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const apiLocale: 'fr' | 'ar' = locale === 'ar' ? 'ar' : 'fr';

  const activeLat = resolvedLocation?.lat ?? resolvedCoords?.lat ?? null;
  const activeLng = resolvedLocation?.lng ?? resolvedCoords?.lng ?? null;

  useEffect(() => {
    let cancelled = false;

    async function runEstimate() {
      let targetLat = activeLat;
      let targetLng = activeLng;

      try {
        if (targetLat === null || targetLng === null) {
          const geoRes = await fetch('/api/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: [
                {
                  slug: destination.slug,
                  primaryQuery: destination.osmSearchQuery,
                  fallbackQuery: `${destination.commune.fr}, Béjaïa, Algérie`,
                },
              ],
            }),
          });

          if (!cancelled && geoRes.ok) {
            const geoData = (await geoRes.json()) as {
              results?: Record<string, ResolvedMapLocation>;
            };
            const hit = geoData.results?.[destination.slug];
            if (hit) {
              targetLat = hit.lat;
              targetLng = hit.lng;
              setResolvedCoords({ lat: hit.lat, lng: hit.lng });
            }
          }
        }

        if (cancelled) return;

        if (targetLat === null || targetLng === null) {
          setError(t('routeCalculator.error'));
          setLoading(false);
          return;
        }

        const res = await fetch('/api/route-estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinationLat: targetLat,
            destinationLng: targetLng,
            locale: apiLocale,
          }),
        });

        if (cancelled) return;

        if (!res.ok) {
          throw new Error('route-estimate failed');
        }

        const data = (await res.json()) as RouteEstimateResponse;
        if (!cancelled) {
          setEstimate(data);
          setError(null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(t('routeCalculator.error'));
          setLoading(false);
        }
      }
    }

    void runEstimate();

    return () => {
      cancelled = true;
    };
  }, [
    activeLat,
    activeLng,
    apiLocale,
    destination.commune.fr,
    destination.osmSearchQuery,
    destination.slug,
    refreshTick,
    t,
  ]);

  const handleRecalculate = () => {
    setLoading(true);
    setError(null);
    setRefreshTick((prev) => prev + 1);
  };

  const activeModeData = estimate?.modes[selectedMode] ?? null;

  const osmDirectionsUrl =
    activeLat !== null && activeLng !== null
      ? `https://www.openstreetmap.org/directions?engine=${
          selectedMode === 'walking' ? 'fossgis_osrm_foot' : 'fossgis_osrm_car'
        }&route=${BEJAIA_CENTER_LAT}%2C${BEJAIA_CENTER_LNG}%3B${activeLat.toFixed(5)}%2C${activeLng.toFixed(5)}`
      : `https://www.openstreetmap.org/search?query=${encodeURIComponent(destination.osmSearchQuery)}`;

  return (
    <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-xl p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#087E9B] inline-flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" />
            <span>{t('routeCalculator.kicker')}</span>
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#103B50]">
            {t('routeCalculator.title')}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleRecalculate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#103B50]/15 text-xs font-medium text-[#103B50] hover:bg-[#F4EFE5] disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('routeCalculator.recalculate')}</span>
        </button>
      </div>

      {/* Origin -> Destination Route Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-3.5 py-2.5 rounded-lg bg-white border border-[#103B50]/10 text-xs text-[#51636D]">
        <span className="inline-flex items-center gap-1.5 font-medium text-[#103B50]">
          <MapPin className="w-3.5 h-3.5 text-[#087E9B] shrink-0" />
          <span>{t('routeCalculator.originLabel')}</span>
        </span>
        <span className="hidden sm:inline text-[#103B50]/30" aria-hidden="true">
          →
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium text-[#103B50]">
          <MapPin className="w-3.5 h-3.5 text-[#C47B55] shrink-0" />
          <span>
            {t('routeCalculator.destinationLabel')} : {lt(destination.name)} (
            {lt(destination.commune)})
          </span>
        </span>
      </div>

      {/* Mode Selector Tabs */}
      <div
        role="tablist"
        aria-label={t('routeCalculator.compareAll')}
        className="grid grid-cols-3 gap-2"
      >
        {MODE_CONFIG.map(({ id, labelKey, icon: Icon }) => {
          const isSelected = selectedMode === id;
          const modePreview = estimate?.modes[id];
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedMode(id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-[#103B50] border-[#103B50] text-white shadow-xs'
                  : 'bg-white border-[#103B50]/12 text-[#103B50] hover:bg-[#F4EFE5]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{t(labelKey)}</span>
              {modePreview && !loading && (
                <span
                  className={`text-[11px] tabular-nums ${
                    isSelected ? 'text-[#F4EFE5]/85' : 'text-[#51636D]'
                  }`}
                >
                  · {modePreview.durationText}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading / Error / Result Panel */}
      {loading && !estimate ? (
        <div className="bg-white border border-[#103B50]/10 rounded-lg p-6 flex items-center justify-center gap-2.5 text-sm text-[#51636D]">
          <Loader2 className="w-4 h-4 animate-spin text-[#087E9B]" />
          <span>{t('routeCalculator.loading')}</span>
        </div>
      ) : error && !estimate ? (
        <div className="bg-white border border-[#C47B55]/30 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#103B50]">
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C47B55] shrink-0" />
            <span>{error}</span>
          </span>
          <button
            type="button"
            onClick={handleRecalculate}
            className="px-3 py-1.5 rounded-md bg-[#103B50] hover:bg-[#087E9B] text-white text-xs font-medium transition-colors"
          >
            {t('routeCalculator.retry')}
          </button>
        </div>
      ) : activeModeData ? (
        <div className="space-y-4">
          {/* Primary Active Mode Highlight Card */}
          <div className="bg-white border border-[#103B50]/12 rounded-lg p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 rounded-md bg-[#FAF8F3] border border-[#103B50]/10">
                <p className="text-[11px] uppercase tracking-wider text-[#51636D] inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#087E9B]" />
                  <span>{t('routeCalculator.estimatedTime')}</span>
                </p>
                <p className="font-serif text-2xl font-semibold text-[#103B50] mt-1 tabular-nums">
                  {activeModeData.durationText}
                </p>
              </div>

              <div className="p-3 rounded-md bg-[#FAF8F3] border border-[#103B50]/10">
                <p className="text-[11px] uppercase tracking-wider text-[#51636D] inline-flex items-center gap-1">
                  <Route className="w-3.5 h-3.5 text-[#C47B55]" />
                  <span>{t('routeCalculator.distance')}</span>
                </p>
                <p className="font-serif text-2xl font-semibold text-[#103B50] mt-1 tabular-nums">
                  {activeModeData.distanceText}
                </p>
              </div>

              <div className="p-3 rounded-md bg-[#FAF8F3] border border-[#103B50]/10">
                <p className="text-[11px] uppercase tracking-wider text-[#51636D] inline-flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-[#356B50]" />
                  <span>{t('routeCalculator.avgSpeed')}</span>
                </p>
                <p className="font-serif text-2xl font-semibold text-[#103B50] mt-1 tabular-nums">
                  {activeModeData.averageSpeedKmh} km/h
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#103B50]/10">
              <div className="space-y-1">
                {activeModeData.recommended && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#356B50]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('routeCalculator.recommended')}</span>
                  </span>
                )}
                <p className="text-xs sm:text-sm text-[#51636D] leading-relaxed">
                  {lt(activeModeData.note)}
                </p>
              </div>

              <a
                href={osmDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-[#087E9B] hover:bg-[#103B50] text-white text-xs font-medium transition-colors"
              >
                <span>{t('routeCalculator.openDirections')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Footer Methodology Note */}
          <p className="text-[11px] text-[#51636D] leading-relaxed">
            {estimate?.source === 'osrm_live'
              ? t('routeCalculator.sourceLive')
              : t('routeCalculator.sourceFallback')}
          </p>
        </div>
      ) : null}
    </div>
  );
}
