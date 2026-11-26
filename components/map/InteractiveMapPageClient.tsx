'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowUpRight, Layers, Code2, Clock } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { DESTINATIONS } from '@/data/destinations';
import { CATEGORIES, CATEGORY_MAP } from '@/data/categories';
import { ERA_FILTER_OPTIONS, getDestinationEras } from '@/data/history';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BejaiaMapLibreMap } from '@/components/map/BejaiaMapLibreMap';
import { OsmPlacesPanel } from '@/components/map/OsmPlacesPanel';
import { OfflinePackButton } from '@/components/pwa/PWAControls';
import type { CategorySlug, EraSlug, ResolvedMapLocation } from '@/types';

export function InteractiveMapPageClient() {
  const { locale, t, lt } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<EraSlug | 'all'>('all');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [resolvedLocations, setResolvedLocations] = useState<Record<string, ResolvedMapLocation>>(
    {}
  );

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        d.category === (selectedCategory as CategorySlug) ||
        d.secondaryCategories?.includes(selectedCategory as CategorySlug);
      const matchesEra =
        selectedEra === 'all' || getDestinationEras(d.slug).includes(selectedEra);
      return matchesCategory && matchesEra;
    });
  }, [selectedCategory, selectedEra]);

  const activeResolved = activeSlug ? resolvedLocations[activeSlug] : undefined;

  const mapSuggestions =
    locale === 'ar'
      ? [
          'مطعم بجاية',
          'فندق بجاية',
          'مطار عبان رمضان بجاية',
        ]
      : [
          'Restaurant Tichy',
          'Hôtel Béjaïa',
          'Aéroport Abane Ramdane Béjaïa',
        ];

  return (
    <div className="bg-white">
      <section className="bg-[#F4EFE5] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <Breadcrumbs items={[{ label: t('nav.map') }]} />
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-1">
            <div className="max-w-3xl space-y-2.5">
              <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50]">
                {t('map.pageTitle')}
              </h1>
              <p className="text-base text-[#51636D] leading-relaxed">{t('map.pageSubtitle')}</p>
            </div>
            <div className="w-full lg:w-72 shrink-0">
              <OfflinePackButton compact />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Category × Era Cross-Filters */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setActiveSlug(null);
              }}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#103B50] text-white'
                  : 'bg-[#F4EFE5] text-[#103B50] hover:bg-[#103B50]/10'
              }`}
            >
              {t('destinations.allCategories')} ({DESTINATIONS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setActiveSlug(null);
                }}
                className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap inline-flex items-center gap-2 ${
                  selectedCategory === cat.slug
                    ? 'bg-[#087E9B] text-white'
                    : 'bg-[#F4EFE5] text-[#103B50] hover:bg-[#103B50]/10'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/60"
                  style={{ backgroundColor: cat.accentColor }}
                  aria-hidden="true"
                />
                <span>{lt(cat.shortTitle)}</span>
              </button>
            ))}
          </div>

          {/* Historical Era Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#103B50]/10">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#51636D] me-1">
              <Clock className="w-3.5 h-3.5 text-[#C47B55]" />
              <span>{t('nav.history')} :</span>
            </span>
            {ERA_FILTER_OPTIONS.map((eraOpt) => {
              const active = selectedEra === eraOpt.slug;
              return (
                <button
                  key={eraOpt.slug}
                  type="button"
                  onClick={() => {
                    setSelectedEra(eraOpt.slug);
                    setActiveSlug(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#C47B55] text-white'
                      : 'bg-[#FAF8F3] border border-[#103B50]/12 text-[#103B50] hover:border-[#C47B55]/50'
                  }`}
                >
                  {lt(eraOpt.label)}
                </button>
              );
            })}
            {(selectedCategory !== 'all' || selectedEra !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedEra('all');
                  setActiveSlug(null);
                }}
                className="text-xs text-[#087E9B] hover:underline ms-auto"
              >
                {t('destinations.resetFilters')}
              </button>
            )}
          </div>
          {selectedEra !== 'all' && (
            <p className="text-xs text-[#51636D]">
              Filtrage croisé actif : les sites associés à cette strate historique sont localisés sur la carte vectorielle OpenFreeMap via OpenStreetMap.{' '}
              <Link href={`/histoire#${selectedEra}`} className="text-[#087E9B] hover:underline">
                Lire la fiche d’époque
              </Link>
            </p>
          )}
        </div>

        {/* Map + Interactive Places Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <BejaiaMapLibreMap
              destinations={filteredDestinations}
              activeSlug={activeSlug}
              onSelectSlug={setActiveSlug}
              heightClass="h-[540px] lg:h-[620px]"
              autoResolveLimit={8}
              zoom={10}
              showUserLocateButton={true}
              onResolvedChange={setResolvedLocations}
            />
          </div>

          <aside className="lg:col-span-4 bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg overflow-hidden flex flex-col max-h-[620px]">
            <div className="p-4 border-b border-[#103B50]/10 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#087E9B]" />
                <h2 className="font-serif text-lg font-semibold text-[#103B50]">
                  {t('nav.destinations')} ({filteredDestinations.length})
                </h2>
              </div>
              <span className="text-[11px] text-[#51636D]">OpenFreeMap · MapLibre</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#103B50]/10">
              {filteredDestinations.map((dest) => {
                const cat = CATEGORY_MAP[dest.category];
                const isSelected = activeSlug === dest.slug;
                const isResolved = Boolean(resolvedLocations[dest.slug]);
                return (
                  <div
                    key={dest.slug}
                    className={`p-3.5 transition-colors ${
                      isSelected ? 'bg-[#087E9B]/10' : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveSlug(dest.slug)}
                        className="text-start flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-2 text-[11px] text-[#51636D]">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: cat.accentColor }}
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {lt(cat.shortTitle)} · {lt(dest.commune)}
                          </span>
                        </div>
                        <p className="font-serif text-base font-semibold text-[#103B50] mt-0.5 truncate">
                          {lt(dest.name)}
                        </p>
                        <p className="text-[11px] text-[#51636D] mt-0.5">
                          {isResolved
                            ? t('map.verifiedOnGoogleMaps')
                            : 'Cliquer pour localiser sur la carte'}
                        </p>
                      </button>

                      <Link
                        href={`/destinations/${dest.slug}`}
                        title={t('destinations.discover')}
                        className="p-2 text-[#087E9B] hover:text-[#103B50] shrink-0"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Live OpenStreetMap Places Explorer */}
        <div className="pt-4">
          <OsmPlacesPanel
            title={t('map.groundingSearchTitle')}
            subtitle="Interrogez la base libre OpenStreetMap pour trouver hôtels, restaurants, gares, ports et points d’intérêt dans la Wilaya de Béjaïa sans clé API payante."
            suggestedQueries={mapSuggestions}
            lat={activeResolved?.lat}
            lng={activeResolved?.lng}
          />
        </div>

        {/* Extensible Architecture Note */}
        <div className="bg-white border border-[#103B50]/12 rounded-lg p-6 flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-[#356B50]">
              <Code2 className="w-4 h-4" />
              <span>Architecture ouverte</span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#103B50]">
              {t('map.contributeTitle')}
            </h3>
            <p className="text-sm text-[#51636D] leading-relaxed">
              {t('map.contributeSubtitle')} La carte vectorielle est propulsée par OpenFreeMap et MapLibre GL JS, avec géocodage libre OpenStreetMap (Nominatim) et sans aucune clé API payante.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#103B50] hover:bg-[#087E9B] text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <MapPin className="w-4 h-4" />
            <span>Proposer un lieu à documenter</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
