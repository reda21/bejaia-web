'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Heart, RotateCcw } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { DESTINATIONS, getUniqueCommunes } from '@/data/destinations';
import { CATEGORIES } from '@/data/categories';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { CategorySlug } from '@/types';

const PAGE_SIZE = 9;

export function DestinationsDirectoryClient() {
  const searchParams = useSearchParams();
  const { locale, t, lt, favorites } = useApp();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') ?? 'all'
  );
  const [selectedCommune, setSelectedCommune] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'az' | 'za'>('featured');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const communes = useMemo(() => getUniqueCommunes(), []);

  const filteredDestinations = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = DESTINATIONS.filter((dest) => {
      if (onlyFavorites && !favorites.includes(dest.slug)) {
        return false;
      }
      if (selectedCategory !== 'all') {
        const matchesPrimary = dest.category === (selectedCategory as CategorySlug);
        const matchesSecondary = dest.secondaryCategories?.includes(
          selectedCategory as CategorySlug
        );
        if (!matchesPrimary && !matchesSecondary) return false;
      }
      if (selectedCommune !== 'all' && dest.commune.fr !== selectedCommune) {
        return false;
      }
      if (q) {
        const haystack = [
          dest.name.fr,
          dest.name.ar,
          dest.commune.fr,
          dest.commune.ar,
          dest.region.fr,
          dest.shortDescription.fr,
          dest.shortDescription.ar,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'az') {
      return [...list].sort((a, b) =>
        lt(a.name).localeCompare(lt(b.name), locale === 'ar' ? 'ar' : 'fr')
      );
    }
    if (sortBy === 'za') {
      return [...list].sort((a, b) =>
        lt(b.name).localeCompare(lt(a.name), locale === 'ar' ? 'ar' : 'fr')
      );
    }
    return [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [query, selectedCategory, selectedCommune, sortBy, onlyFavorites, favorites, locale, lt]);

  const displayed = filteredDestinations.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDestinations.length;

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedCommune('all');
    setSortBy('featured');
    setOnlyFavorites(false);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-[#F4EFE5] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Breadcrumbs items={[{ label: t('nav.destinations') }]} />
          <div className="max-w-3xl space-y-3 pt-2">
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50]">
              {t('destinations.pageTitle')}
            </h1>
            <p className="text-base text-[#51636D] leading-relaxed">
              {t('destinations.pageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar & Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-4 pb-6 border-b border-[#103B50]/10">
          {/* Search + Selects */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search
                className="w-4 h-4 text-[#51636D] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder={t('destinations.searchPlaceholder')}
                className="w-full ps-10 pe-4 py-2.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm text-[#102530] placeholder:text-[#51636D]/75"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedCommune}
                onChange={(e) => {
                  setSelectedCommune(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                aria-label={t('destinations.allCommunes')}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm text-[#102530]"
              >
                <option value="all">{t('destinations.allCommunes')}</option>
                {communes.map((c) => (
                  <option key={c.fr} value={c.fr}>
                    {locale === 'ar' ? c.ar : c.fr}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'az' | 'za')}
                aria-label="Tri"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm text-[#102530]"
              >
                <option value="featured">{t('destinations.sortFeatured')}</option>
                <option value="az">{t('destinations.sortAZ')}</option>
                <option value="za">{t('destinations.sortZA')}</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setOnlyFavorites((v) => !v)}
                aria-pressed={onlyFavorites}
                className={`w-full h-full px-3.5 py-2.5 rounded-md border text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                  onlyFavorites
                    ? 'bg-[#C47B55] border-[#C47B55] text-white'
                    : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#FAF8F3]'
                }`}
              >
                <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-current' : ''}`} />
                <span className="truncate">{t('nav.favorites')}</span>
              </button>
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={t('nav.categories')}>
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => {
                setSelectedCategory('all');
                setVisibleCount(PAGE_SIZE);
              }}
              className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#103B50] text-white'
                  : 'bg-[#F4EFE5] text-[#103B50] hover:bg-[#103B50]/10'
              }`}
            >
              {t('destinations.allCategories')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.slug}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-[#087E9B] text-white'
                    : 'bg-[#F4EFE5] text-[#103B50] hover:bg-[#103B50]/10'
                }`}
              >
                {lt(cat.shortTitle)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Meta */}
        <div className="flex items-center justify-between text-sm text-[#51636D]">
          <p className="tabular-nums">
            <strong className="text-[#103B50] font-semibold">{filteredDestinations.length}</strong>{' '}
            {t('destinations.resultsCount')}
          </p>
          {(query || selectedCategory !== 'all' || selectedCommune !== 'all' || onlyFavorites) && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#087E9B] hover:text-[#103B50]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('destinations.resetFilters')}</span>
            </button>
          )}
        </div>

        {/* Grid or Empty State */}
        {displayed.length === 0 ? (
          <div className="py-16 text-center bg-[#FAF8F3] rounded-lg border border-[#103B50]/10 space-y-3 px-4">
            <h2 className="font-serif text-2xl font-semibold text-[#103B50]">
              {t('destinations.noResultsTitle')}
            </h2>
            <p className="text-sm text-[#51636D] max-w-md mx-auto">
              {t('destinations.noResultsSubtitle')}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 px-5 py-2.5 bg-[#103B50] hover:bg-[#087E9B] text-white text-sm font-medium rounded-md transition-colors"
            >
              {t('destinations.resetFilters')}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {displayed.map((dest, idx) => (
                <DestinationCard key={dest.slug} destination={dest} priority={idx < 3} />
              ))}
            </div>

            {hasMore && (
              <div className="pt-6 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-6 py-3 bg-[#F4EFE5] hover:bg-[#103B50] text-[#103B50] hover:text-white text-sm font-medium rounded-md transition-colors"
                >
                  {t('destinations.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
