'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Check,
  ExternalLink,
  Info,
  Route as RouteIcon,
  Share2,
  Printer,
  X,
  Loader2,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { CIRCUITS } from '@/data/circuits';
import { DESTINATIONS, getDestinationBySlug } from '@/data/destinations';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { BejaiaMapLibreMap } from '@/components/map/BejaiaMapLibreMap';
import type { Destination, RouteSummaryResult } from '@/types';

export function CircuitsClient() {
  const {
    t,
    lt,
    customCircuitSlugs,
    toggleCustomCircuitSlug,
    setCustomCircuitSlugs,
    savedCircuits,
    saveCustomCircuit,
    deleteSavedCircuit,
  } = useApp();

  const searchParams = useSearchParams();
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>(CIRCUITS[0].id);
  const [activeStopSlug, setActiveStopSlug] = useState<string | null>(null);
  const [builderName, setBuilderName] = useState('');
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [mapMode, setMapMode] = useState<'curated' | 'custom'>('curated');
  const [routeRequestId, setRouteRequestId] = useState(0);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeSummary, setRouteSummary] = useState<RouteSummaryResult | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const hydratedQueryRef = useRef<string | null>(null);

  const circuitParam = searchParams.get('circuit');
  const nameParam = searchParams.get('name');

  useEffect(() => {
    if (!circuitParam) return;
    const key = `${circuitParam}|${nameParam ?? ''}`;
    if (hydratedQueryRef.current === key) return;
    hydratedQueryRef.current = key;

    const validSlugs = circuitParam
      .split(',')
      .map((s) => s.trim())
      .filter((slug) => Boolean(getDestinationBySlug(slug)));

    if (validSlugs.length > 0) {
      void Promise.resolve().then(() => {
        setCustomCircuitSlugs(validSlugs);
        setMapMode('custom');
        if (nameParam) {
          setBuilderName(nameParam.slice(0, 80));
        }
        setRouteRequestId(0);
        setRouteSummary(null);
        setRouteError(null);
      });
    }
  }, [circuitParam, nameParam, setCustomCircuitSlugs]);

  const activeCircuit = useMemo(
    () => CIRCUITS.find((c) => c.id === selectedCircuitId) ?? CIRCUITS[0],
    [selectedCircuitId]
  );

  const curatedDestinations = useMemo(
    () =>
      activeCircuit.destinationSlugs
        .map((s) => getDestinationBySlug(s))
        .filter((d): d is Destination => Boolean(d)),
    [activeCircuit]
  );

  const customDestinations = useMemo(
    () =>
      customCircuitSlugs
        .map((s) => getDestinationBySlug(s))
        .filter((d): d is Destination => Boolean(d)),
    [customCircuitSlugs]
  );

  const mapDestinations =
    mapMode === 'custom' && customDestinations.length > 0
      ? customDestinations
      : curatedDestinations;

  const resetRouteState = useCallback(() => {
    setRouteRequestId(0);
    setRouteSummary(null);
    setRouteError(null);
  }, []);

  const handleRouteComputed = useCallback(
    (summary: RouteSummaryResult | null, error?: string | null) => {
      setRouteSummary(summary);
      setRouteError(error ?? null);
    },
    []
  );

  const moveStep = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= customCircuitSlugs.length) return;
    const copy = [...customCircuitSlugs];
    const [moved] = copy.splice(index, 1);
    copy.splice(nextIndex, 0, moved);
    setCustomCircuitSlugs(copy);
    resetRouteState();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderName.trim() || customCircuitSlugs.length < 2) return;
    saveCustomCircuit(builderName);
    setBuilderName('');
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  const handleShareCircuit = async () => {
    if (typeof window === 'undefined' || mapDestinations.length === 0) return;
    const slugsParam = mapDestinations.map((d) => d.slug).join(',');
    const circuitTitle =
      mapMode === 'custom'
        ? builderName.trim() || 'Mon circuit Béjaïa'
        : lt(activeCircuit.title);
    const url = new URL('/circuits', window.location.origin);
    url.searchParams.set('circuit', slugsParam);
    url.searchParams.set('name', circuitTitle);
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // Ignore clipboard failure in restricted iframes
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#F4EFE5] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Breadcrumbs items={[{ label: t('nav.circuits') }]} />
          <div className="max-w-3xl space-y-3 pt-2">
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50]">
              {t('circuits.pageTitle')}
            </h1>
            <p className="text-base text-[#51636D] leading-relaxed">
              {t('circuits.pageSubtitle')}
            </p>
            <p className="text-xs text-[#51636D] flex items-start gap-2 pt-1">
              <Info className="w-4 h-4 text-[#087E9B] shrink-0 mt-0.5" />
              <span>{t('circuits.durationNotice')}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Curated Circuits Explorer + Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 6 Thematic Circuits Selector */}
          <div className="lg:col-span-5 space-y-4">
            {CIRCUITS.map((circuit, index) => {
              const selected = mapMode === 'curated' && circuit.id === selectedCircuitId;
              return (
                <div
                  key={circuit.id}
                  id={circuit.slug}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    selected
                      ? 'border-[#087E9B] bg-[#FAF8F3] shadow-sm'
                      : 'border-[#103B50]/12 bg-white hover:border-[#103B50]/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCircuitId(circuit.id);
                      setMapMode('curated');
                      setActiveStopSlug(null);
                      resetRouteState();
                    }}
                    className="w-full text-start p-5 flex items-start gap-4"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 bg-[#F4EFE5]">
                      <ResilientImage
                        src={circuit.coverImage.src}
                        alt={lt(circuit.coverImage.alt)}
                        fill
                        priority={index < 2}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#51636D] tabular-nums">
                        <span>0{index + 1}</span>
                        <span aria-hidden="true"> · </span>
                        <span className="text-[#087E9B] font-medium">
                          {circuit.destinationSlugs.length} {t('circuits.stops')}
                        </span>
                      </p>
                      <h2 className="font-serif text-lg font-semibold text-[#103B50] mt-0.5 leading-snug">
                        {lt(circuit.title)}
                      </h2>
                      <p className="text-xs text-[#51636D] mt-1 line-clamp-2">
                        {lt(circuit.subtitle)}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Active Circuit Detail + Google Map */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 no-print">
                <div className="flex items-center gap-2 p-1 bg-white border border-[#103B50]/12 rounded-md">
                  <button
                    type="button"
                    onClick={() => {
                      setMapMode('curated');
                      resetRouteState();
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      mapMode === 'curated'
                        ? 'bg-[#103B50] text-white'
                        : 'text-[#51636D] hover:text-[#103B50]'
                    }`}
                  >
                    {t('circuits.viewCircuit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMapMode('custom');
                      resetRouteState();
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      mapMode === 'custom'
                        ? 'bg-[#356B50] text-white'
                        : 'text-[#51636D] hover:text-[#103B50]'
                    }`}
                  >
                    Mon circuit ({customDestinations.length})
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void handleShareCircuit();
                    }}
                    disabled={mapDestinations.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#103B50]/5 border border-[#103B50]/15 rounded-md text-xs font-medium text-[#103B50] disabled:opacity-45 transition-colors"
                  >
                    {shareCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#356B50]" />
                        <span className="text-[#356B50]">{t('circuits.shareCircuitCopied')}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-[#087E9B]" />
                        <span>{t('circuits.shareCircuitBtn')}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#103B50]/5 border border-[#103B50]/15 rounded-md text-xs font-medium text-[#103B50] transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#087E9B]" />
                    <span>{t('circuits.printCircuitBtn')}</span>
                  </button>
                </div>
              </div>

              {mapMode === 'curated' ? (
                <>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-semibold text-[#103B50]">
                      {lt(activeCircuit.title)}
                    </h3>
                    <p className="text-sm text-[#51636D] leading-relaxed">
                      {lt(activeCircuit.description)}
                    </p>
                    <p className="text-xs text-[#51636D] italic">{lt(activeCircuit.durationNote)}</p>
                  </div>

                  {/* Ordered Steps */}
                  <ol className="divide-y divide-[#103B50]/10 border-y border-[#103B50]/10">
                    {curatedDestinations.map((dest, idx) => (
                      <li
                        key={dest.slug}
                        className="py-3 flex items-center justify-between gap-4"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveStopSlug(dest.slug)}
                          className="flex items-center gap-3 text-start hover:text-[#087E9B] transition-colors"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#103B50] text-white text-xs font-semibold flex items-center justify-center tabular-nums shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-[#103B50]">{lt(dest.name)}</p>
                            <p className="text-xs text-[#51636D]">{lt(dest.commune)}</p>
                          </div>
                        </button>
                        <div className="flex items-center gap-3 shrink-0">
                          <Link
                            href={`/destinations/${dest.slug}`}
                            className="text-xs font-medium text-[#087E9B] hover:underline"
                          >
                            {t('destinations.discover')}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-semibold text-[#103B50]">
                    {t('circuits.builderTitle')} ({customDestinations.length} {t('circuits.stops')})
                  </h3>
                  <p className="text-sm text-[#51636D]">
                    {customDestinations.length === 0
                      ? t('circuits.builderEmpty')
                      : 'Cliquez sur une étape sur la carte ou dans votre sélection ci-dessous.'}
                  </p>
                </div>
              )}

              {/* On-demand OSRM Routes Action Bar */}
              <div className="space-y-2.5 no-print">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRouteError(null);
                      setRouteRequestId((prev) => prev + 1);
                    }}
                    disabled={mapDestinations.length < 2 || routeLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#087E9B] hover:bg-[#066982] disabled:opacity-45 text-white text-xs font-medium rounded-md transition-colors"
                  >
                    {routeLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{t('circuits.computingRoute')}</span>
                      </>
                    ) : (
                      <>
                        <RouteIcon className="w-3.5 h-3.5" />
                        <span>{t('circuits.computeRouteBtn')}</span>
                      </>
                    )}
                  </button>

                  {routeRequestId > 0 && (
                    <button
                      type="button"
                      onClick={resetRouteState}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#103B50]/5 border border-[#103B50]/15 text-[#51636D] text-xs font-medium rounded-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{t('circuits.clearRouteBtn')}</span>
                    </button>
                  )}
                </div>

                {routeSummary && (
                  <div className="p-3 bg-white border border-[#087E9B]/30 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-[#103B50]">
                      {t('circuits.routeComputedLabel')} ({routeSummary.stopsCount}{' '}
                      {t('circuits.stops')})
                    </span>
                    <span className="font-semibold text-[#087E9B] tabular-nums">
                      {[routeSummary.distanceText, routeSummary.durationText]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </div>
                )}

                {routeError && (
                  <div className="p-3 bg-white border border-[#C47B55]/40 rounded-md text-xs text-[#C47B55]">
                    {routeError}
                  </div>
                )}
              </div>

              <div className="no-print">
                <BejaiaMapLibreMap
                  destinations={mapDestinations}
                  activeSlug={activeStopSlug}
                  onSelectSlug={setActiveStopSlug}
                  heightClass="h-[400px]"
                  autoResolveLimit={6}
                  zoom={10}
                  routeRequestId={routeRequestId}
                  onRouteComputed={handleRouteComputed}
                  onRouteLoadingChange={setRouteLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM CIRCUIT BUILDER */}
      <section
        id="createur-circuit"
        className="py-14 lg:py-20 bg-[#F4EFE5] border-t border-[#103B50]/10 no-print"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#356B50]">
              Itinéraire sur mesure
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50]">
              {t('circuits.builderTitle')}
            </h2>
            <p className="text-sm sm:text-base text-[#51636D] leading-relaxed">
              {t('circuits.builderSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Picker Pool */}
            <div className="lg:col-span-7 bg-white border border-[#103B50]/12 rounded-lg p-6 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#103B50]">
                1. Sélectionnez vos étapes ({DESTINATIONS.length} lieux disponibles)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pe-1">
                {DESTINATIONS.map((dest) => {
                  const picked = customCircuitSlugs.includes(dest.slug);
                  return (
                    <button
                      key={dest.slug}
                      type="button"
                      onClick={() => {
                        toggleCustomCircuitSlug(dest.slug);
                        setMapMode('custom');
                        resetRouteState();
                      }}
                      className={`p-3 rounded-md border text-start flex items-center justify-between gap-2 transition-colors ${
                        picked
                          ? 'bg-[#356B50]/10 border-[#356B50] text-[#103B50]'
                          : 'bg-[#FAF8F3] border-[#103B50]/10 text-[#102530] hover:border-[#087E9B]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{lt(dest.name)}</p>
                        <p className="text-xs text-[#51636D] truncate">{lt(dest.commune)}</p>
                      </div>
                      {picked ? (
                        <Check className="w-4 h-4 text-[#356B50] shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-[#087E9B] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ordered Selection & Save */}
            <div className="lg:col-span-5 bg-white border border-[#103B50]/12 rounded-lg p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-[#103B50]">
                  2. Votre parcours ({customDestinations.length})
                </h3>
                {customDestinations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomCircuitSlugs([])}
                    className="text-xs text-[#C47B55] hover:underline"
                  >
                    {t('circuits.builderClear')}
                  </button>
                )}
              </div>

              {customDestinations.length === 0 ? (
                <p className="text-sm text-[#51636D] leading-relaxed py-4">
                  {t('circuits.builderEmpty')}
                </p>
              ) : (
                <ol className="space-y-2">
                  {customDestinations.map((dest, idx) => (
                    <li
                      key={dest.slug}
                      className="flex items-center justify-between gap-2 p-2.5 bg-[#FAF8F3] rounded-md border border-[#103B50]/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-[#356B50] text-white text-xs font-semibold flex items-center justify-center tabular-nums shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium text-[#103B50] truncate">
                          {lt(dest.name)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveStep(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Monter"
                          className="p-1 text-[#51636D] hover:text-[#103B50] disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStep(idx, 1)}
                          disabled={idx === customDestinations.length - 1}
                          aria-label="Descendre"
                          className="p-1 text-[#51636D] hover:text-[#103B50] disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCustomCircuitSlug(dest.slug)}
                          aria-label="Retirer"
                          className="p-1 text-[#51636D] hover:text-[#C47B55]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              <form onSubmit={handleSave} className="space-y-3 pt-3 border-t border-[#103B50]/10">
                <input
                  type="text"
                  value={builderName}
                  onChange={(e) => setBuilderName(e.target.value)}
                  placeholder={t('circuits.builderNamePlaceholder')}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm text-[#102530]"
                />
                <button
                  type="submit"
                  disabled={!builderName.trim() || customDestinations.length < 2}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#103B50] hover:bg-[#087E9B] disabled:opacity-45 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{t('circuits.builderSave')}</span>
                </button>
                {saveFeedback && (
                  <p className="text-xs text-[#356B50] font-medium">
                    Circuit enregistré localement dans votre navigateur.
                  </p>
                )}
              </form>

              {savedCircuits.length > 0 && (
                <div className="pt-4 border-t border-[#103B50]/10 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-[#51636D]">
                    {t('circuits.savedCircuitsTitle')} ({savedCircuits.length})
                  </h4>
                  <ul className="space-y-2.5">
                    {savedCircuits.map((sc) => (
                      <li
                        key={sc.id}
                        className="p-3 bg-[#FAF8F3] border border-[#103B50]/10 rounded-md flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => {
                              setCustomCircuitSlugs(sc.destinationSlugs);
                              setMapMode('custom');
                              resetRouteState();
                            }}
                            className="text-sm font-semibold text-[#103B50] hover:text-[#087E9B] text-start"
                          >
                            {sc.name}
                          </button>
                          <p className="text-xs text-[#51636D] tabular-nums">
                            {sc.destinationSlugs.length} {t('circuits.stops')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(
                              getDestinationBySlug(sc.destinationSlugs[0])?.osmSearchQuery ||
                                'Béjaïa, Algérie'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={t('detail.openOsm')}
                            className="p-1.5 text-[#087E9B] hover:text-[#103B50]"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => deleteSavedCircuit(sc.id)}
                            aria-label="Supprimer le circuit"
                            className="p-1.5 text-[#51636D] hover:text-[#C47B55]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
