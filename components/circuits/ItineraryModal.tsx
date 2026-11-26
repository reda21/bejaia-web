'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  X,
  Route,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  Navigation,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { DESTINATIONS, getDestinationBySlug } from '@/data/destinations';
import { BejaiaMapLibreMap } from '@/components/map/BejaiaMapLibreMap';
import type { Destination, RouteSummaryResult } from '@/types';

export function ItineraryModal() {
  const {
    t,
    lt,
    itineraryOpen,
    setItineraryOpen,
    customCircuitSlugs,
    setCustomCircuitSlugs,
    toggleCustomCircuitSlug,
  } = useApp();

  const [selectedToAdd, setSelectedToAdd] = useState('');
  const [routeRequestId, setRouteRequestId] = useState(0);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeSummary, setRouteSummary] = useState<RouteSummaryResult | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  const stops = useMemo<Destination[]>(() => {
    return customCircuitSlugs
      .map((slug) => getDestinationBySlug(slug))
      .filter((d): d is Destination => Boolean(d));
  }, [customCircuitSlugs]);

  const availableDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => !customCircuitSlugs.includes(d.slug));
  }, [customCircuitSlugs]);

  if (!itineraryOpen) return null;

  const handleAddStop = () => {
    if (!selectedToAdd) return;
    if (!customCircuitSlugs.includes(selectedToAdd)) {
      setCustomCircuitSlugs([...customCircuitSlugs, selectedToAdd]);
      setRouteSummary(null);
      setRouteError(null);
    }
    setSelectedToAdd('');
  };

  const handleMove = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= customCircuitSlugs.length) return;
    const next = [...customCircuitSlugs];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setCustomCircuitSlugs(next);
    setRouteSummary(null);
    setRouteError(null);
  };

  const handleClear = () => {
    setCustomCircuitSlugs([]);
    setRouteSummary(null);
    setRouteError(null);
  };

  const handleGenerateRoute = () => {
    if (stops.length < 2) return;
    setRouteError(null);
    setRouteRequestId((n) => n + 1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('itinerary.modalTitle')}
      className="no-print fixed inset-0 z-50 bg-[#103B50]/55 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={() => setItineraryOpen(false)}
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl border border-[#103B50]/15 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#FAF8F3] border-b border-[#103B50]/10 flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#087E9B] inline-flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5" />
              <span>
                {stops.length} {t('itinerary.stopsLabel')}
              </span>
            </p>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#103B50]">
              {t('itinerary.modalTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#51636D]">{t('itinerary.modalSubtitle')}</p>
          </div>
          <button
            type="button"
            onClick={() => setItineraryOpen(false)}
            aria-label={t('common.close')}
            className="p-2 text-[#51636D] hover:text-[#103B50] hover:bg-[#F4EFE5] rounded-md transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Left Stops Manager + Right OpenFreeMap Preview */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left Panel: Stops & Actions */}
          <div className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-e border-[#103B50]/10 flex flex-col gap-4">
            {/* Quick Add Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedToAdd}
                onChange={(e) => setSelectedToAdd(e.target.value)}
                aria-label={t('itinerary.addPlaceholder')}
                className="flex-1 min-w-0 h-10 px-3 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-xs sm:text-sm text-[#102530]"
              >
                <option value="">{t('itinerary.addPlaceholder')}</option>
                {availableDestinations.map((dest) => (
                  <option key={dest.slug} value={dest.slug}>
                    {lt(dest.name)} — {lt(dest.commune)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddStop}
                disabled={!selectedToAdd}
                className="inline-flex items-center justify-center gap-1 h-10 px-3.5 bg-[#087E9B] hover:bg-[#103B50] disabled:opacity-45 text-white text-xs font-medium rounded-md transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{t('itinerary.addCardBtn')}</span>
              </button>
            </div>

            {/* Ordered Stop List */}
            <div className="flex-1 space-y-2 min-h-[160px]">
              {stops.length === 0 ? (
                <div className="p-5 bg-[#FAF8F3] border border-dashed border-[#103B50]/20 rounded-lg text-xs sm:text-sm text-[#51636D] leading-relaxed">
                  {t('itinerary.emptyState')}
                </div>
              ) : (
                stops.map((dest, idx) => (
                  <div
                    key={dest.slug}
                    className="flex items-center justify-between gap-2 p-2.5 bg-[#FAF8F3] border border-[#103B50]/10 rounded-md"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-[#103B50] text-white text-xs font-semibold flex items-center justify-center shrink-0 tabular-nums">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/destinations/${dest.slug}`}
                          onClick={() => setItineraryOpen(false)}
                          className="font-serif text-sm font-semibold text-[#103B50] hover:text-[#087E9B] block truncate"
                        >
                          {lt(dest.name)}
                        </Link>
                        <p className="text-[11px] text-[#51636D] truncate">{lt(dest.commune)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        aria-label="Monter"
                        className="p-1 text-[#51636D] hover:text-[#103B50] disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === stops.length - 1}
                        aria-label="Descendre"
                        className="p-1 text-[#51636D] hover:text-[#103B50] disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toggleCustomCircuitSlug(dest.slug);
                          setRouteSummary(null);
                          setRouteError(null);
                        }}
                        aria-label={t('common.remove')}
                        className="p-1 text-[#51636D] hover:text-[#C47B55]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Route Action & Computed Summary */}
            <div className="pt-3 border-t border-[#103B50]/10 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateRoute}
                  disabled={stops.length < 2 || routeLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#087E9B] hover:bg-[#103B50] disabled:opacity-45 text-white text-xs sm:text-sm font-medium rounded-md transition-colors"
                >
                  {routeLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>{t('itinerary.generateMapBtn')}</span>
                </button>

                {stops.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2.5 bg-white hover:bg-[#FAF8F3] border border-[#103B50]/15 text-[#51636D] hover:text-[#C47B55] text-xs font-medium rounded-md transition-colors"
                  >
                    {t('itinerary.clearBtn')}
                  </button>
                )}
              </div>

              {routeSummary && (
                <div className="p-3 bg-[#356B50]/10 border border-[#356B50]/25 rounded-md flex items-center justify-between text-xs text-[#103B50] tabular-nums">
                  <span>
                    {t('circuits.routeDistance')} : <strong>{routeSummary.distanceText}</strong>
                  </span>
                  <span>
                    {t('circuits.routeDuration')} : <strong>{routeSummary.durationText}</strong>
                  </span>
                </div>
              )}

              {routeError && (
                <div className="p-3 bg-[#C47B55]/10 border border-[#C47B55]/30 rounded-md flex items-start gap-2 text-xs text-[#103B50]">
                  <AlertCircle className="w-4 h-4 text-[#C47B55] shrink-0 mt-0.5" />
                  <span>{routeError}</span>
                </div>
              )}

              <Link
                href="/circuits"
                onClick={() => setItineraryOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#087E9B] hover:text-[#103B50]"
              >
                <span>{t('itinerary.openFullPlanner')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Panel: Live OpenFreeMap + MapLibre Route Preview */}
          <div className="lg:col-span-7 p-4 sm:p-5 bg-[#FAF8F3]">
            <BejaiaMapLibreMap
              destinations={stops}
              heightClass="h-[340px] sm:h-[430px]"
              autoResolveLimit={Math.max(stops.length, 2)}
              zoom={10}
              showUserLocateButton={false}
              routeRequestId={routeRequestId}
              onRouteLoadingChange={setRouteLoading}
              onRouteComputed={(summary, err) => {
                setRouteSummary(summary);
                setRouteError(err || null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
