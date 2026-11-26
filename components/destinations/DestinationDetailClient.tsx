'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  MapPin,
  ExternalLink,
  Plus,
  Check,
  CheckCircle2,
  Maximize2,
  Info,
  Compass,
  ShieldAlert,
  Clock,
  NotebookPen,
  Trash2,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { CATEGORY_MAP } from '@/data/categories';
import { DESTINATIONS } from '@/data/destinations';
import {
  HISTORICAL_ERAS,
  getDestinationCitations,
  getDestinationEras,
} from '@/data/history';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { LightboxModal } from '@/components/ui/LightboxModal';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { EditorialControls, getProseSizeClass } from '@/components/ui/EditorialControls';
import { ChapterToc, type TocItem } from '@/components/ui/ChapterToc';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { SpeechGuidePlayer } from '@/components/destinations/SpeechGuidePlayer';
import { DestinationQrCard } from '@/components/destinations/DestinationQrCard';
import { DestinationShareButton } from '@/components/destinations/DestinationShareButton';
import { DestinationImageViewer } from '@/components/destinations/DestinationImageViewer';
import { DestinationRouteCalculator } from '@/components/destinations/DestinationRouteCalculator';
import { BejaiaMapLibreMap } from '@/components/map/BejaiaMapLibreMap';
import { OsmPlacesPanel } from '@/components/map/OsmPlacesPanel';
import type { Destination, ResolvedMapLocation } from '@/types';

export function DestinationDetailClient({ destination }: { destination: Destination }) {
  const {
    locale,
    t,
    lt,
    favorites,
    isFavorite,
    toggleFavorite,
    setFavoritesOpen,
    isVisited,
    toggleVisited,
    notes,
    setDestinationNote,
    deleteDestinationNote,
    readerPrefs,
    customCircuitSlugs,
    toggleCustomCircuitSlug,
  } = useApp();

  const existingNote = notes[destination.slug]?.note ?? '';
  const [draftNote, setDraftNote] = useState(existingNote);
  const [noteFeedback, setNoteFeedback] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [resolvedLoc, setResolvedLoc] = useState<ResolvedMapLocation | null>(null);

  const category = CATEGORY_MAP[destination.category];
  const favored = isFavorite(destination.id);
  const visited = isVisited(destination.slug);
  const inCircuit = customCircuitSlugs.includes(destination.slug);
  const proseSizeClass = getProseSizeClass(readerPrefs.fontScale);
  const hasAudioGuide =
    destination.category === 'historique' ||
    Boolean(destination.secondaryCategories?.includes('historique')) ||
    Boolean(destination.historyAndHeritage);

  const eraSlugs = useMemo(() => getDestinationEras(destination.slug), [destination.slug]);
  const linkedEras = useMemo(
    () => HISTORICAL_ERAS.filter((era) => eraSlugs.includes(era.slug)),
    [eraSlugs]
  );
  const citations = useMemo(() => getDestinationCitations(destination.slug), [destination.slug]);

  const allImages = useMemo(() => {
    const gallery = destination.gallery.length > 0 ? destination.gallery : [destination.coverImage];
    const hasCover = gallery.some((img) => img.src === destination.coverImage.src);
    return hasCover ? gallery : [destination.coverImage, ...gallery];
  }, [destination]);

  const similarDestinations = useMemo(() => {
    return DESTINATIONS.filter(
      (d) =>
        d.slug !== destination.slug &&
        (d.category === destination.category ||
          d.secondaryCategories?.includes(destination.category))
    ).slice(0, 3);
  }, [destination]);

  const tocItems = useMemo<TocItem[]>(() => {
    const list: TocItem[] = [
      { id: 'sec-overview', label: t('detail.overview'), index: '01' },
      { id: 'sec-experience', label: t('detail.tourismDescription'), index: '02' },
    ];
    if (destination.historyAndHeritage) {
      list.push({ id: 'sec-history', label: t('detail.history'), index: '03' });
    }
    const baseIdx = destination.historyAndHeritage ? 4 : 3;
    list.push({
      id: 'sec-gallery',
      label: t('detail.gallery'),
      index: `0${baseIdx}`,
    });
    list.push({
      id: 'sec-route-calculator',
      label: t('routeCalculator.title'),
      index: `0${baseIdx + 1}`,
    });
    list.push({
      id: 'sec-location',
      label: t('detail.location'),
      index: `0${baseIdx + 2}`,
    });
    return list;
  }, [destination.historyAndHeritage, t]);

  const singleList = useMemo(() => [destination], [destination]);

  const osmUrl =
    resolvedLoc?.googleMapsURI ||
    `https://www.openstreetmap.org/search?query=${encodeURIComponent(destination.osmSearchQuery)}`;

  const groundingSuggestions =
    locale === 'ar'
      ? [
          `${destination.name.ar}`,
          `مطعم ${destination.commune.ar}`,
        ]
      : [
          `${destination.name.fr}`,
          `Restaurant ${destination.commune.fr}`,
        ];

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    setDestinationNote(destination.slug, draftNote);
    setNoteFeedback(true);
    setTimeout(() => setNoteFeedback(false), 2500);
  };

  return (
    <article className="bg-white">
      <ReadingProgressBar label={lt(destination.name)} />

      {/* Breadcrumb + Cover Hero */}
      <div className="bg-[#FAF8F3] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <Breadcrumbs
            items={[
              { label: t('nav.destinations'), href: '/destinations' },
              { label: lt(category.shortTitle), href: `/categories/${category.slug}` },
              { label: lt(destination.name) },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            <div className="lg:col-span-7 space-y-4">
              {/* Zero-pill metadata */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#51636D]">
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-[#087E9B] hover:underline"
                >
                  {lt(category.shortTitle)}
                </Link>
                <span aria-hidden="true">·</span>
                <span>{lt(destination.commune)}</span>
                <span aria-hidden="true">·</span>
                <span>{lt(destination.region)}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50] leading-tight">
                {lt(destination.name)}
              </h1>

              <p className="text-base sm:text-lg text-[#51636D] leading-relaxed">
                {lt(destination.shortDescription)}
              </p>

              <div className="no-print flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(destination.id)}
                  aria-pressed={favored}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium border transition-colors ${
                    favored
                      ? 'bg-[#C47B55] border-[#C47B55] text-white'
                      : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favored ? 'fill-current' : ''}`} />
                  <span>
                    {favored ? t('destinations.removeFavorite') : t('destinations.addFavorite')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleVisited(destination.slug)}
                  aria-pressed={visited}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium border transition-colors ${
                    visited
                      ? 'bg-[#356B50] border-[#356B50] text-white'
                      : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {visited ? t('destinations.visitedBadge') : t('destinations.markVisited')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCustomCircuitSlug(destination.slug)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium border transition-colors ${
                    inCircuit
                      ? 'bg-[#103B50] border-[#103B50] text-white'
                      : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
                  }`}
                >
                  {inCircuit ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>
                    {inCircuit ? t('detail.addedToCustomCircuit') : t('detail.addToCustomCircuit')}
                  </span>
                </button>

                <DestinationShareButton
                  slug={destination.slug}
                  title={lt(destination.name)}
                  commune={lt(destination.commune)}
                  summary={lt(destination.shortDescription)}
                />

                <a
                  href={osmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#087E9B] hover:bg-[#103B50] text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t('detail.openOsm')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {favored && (
                <div className="no-print flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-[#C47B55]/10 border border-[#C47B55]/30 rounded-md text-xs text-[#103B50]">
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#C47B55] fill-current shrink-0" />
                    <span>{t('destinations.savedOfflineHint')}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFavoritesOpen(true)}
                    className="font-semibold text-[#087E9B] hover:underline whitespace-nowrap"
                  >
                    {t('destinations.openFavoritesQuick')} ({favorites.length})
                  </button>
                </div>
              )}

              <div className="pt-2">
                <EditorialControls showPrint={true} />
              </div>
            </div>

            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={() => setLightboxIdx(0)}
                className="group relative block w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#F4EFE5] border border-[#103B50]/10 text-start"
              >
                <span className="relative block w-full h-full">
                  <ResilientImage
                    src={destination.coverImage.src}
                    alt={lt(destination.coverImage.alt)}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </span>
                <span className="no-print absolute bottom-3 end-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#103B50]/85 text-white text-xs rounded-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{allImages.length}</span>
                </span>
              </button>
              <p className="text-xs font-serif italic text-[#51636D] mt-2 leading-relaxed">
                Fig. 1 — {destination.coverImage.caption ? lt(destination.coverImage.caption) : lt(destination.coverImage.alt)}{' '}
                · {destination.coverImage.source}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body (70/30 Editorial Reading Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Primary Narrative */}
          <div
            className={`${
              readerPrefs.readerMode ? 'lg:col-span-10 lg:col-start-2' : 'lg:col-span-8'
            } space-y-12`}
          >
            {hasAudioGuide && (
              <SpeechGuidePlayer
                title={lt(destination.name)}
                overview={lt(destination.overview)}
                experience={lt(destination.tourismDescription)}
                history={
                  destination.historyAndHeritage
                    ? lt(destination.historyAndHeritage)
                    : undefined
                }
              />
            )}

            <section id="sec-overview" className="scroll-mt-24 max-w-prose space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55] tabular-nums">
                01 / {t('detail.overview')}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
                {t('detail.overview')}
              </h2>
              <p className={`editorial-dropcap text-[#102530]/90 ${proseSizeClass}`}>
                {lt(destination.overview)}
              </p>
            </section>

            <section
              id="sec-experience"
              className="scroll-mt-24 max-w-prose space-y-3 pt-8 border-t border-[#103B50]/10"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#087E9B] tabular-nums">
                02 / {t('detail.tourismDescription')}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
                {t('detail.tourismDescription')}
              </h2>
              <p className={`text-[#102530]/90 ${proseSizeClass}`}>
                {lt(destination.tourismDescription)}
              </p>
            </section>

            {destination.historyAndHeritage && (
              <section
                id="sec-history"
                className="scroll-mt-24 max-w-prose space-y-4 pt-8 border-t border-[#103B50]/10"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55] tabular-nums">
                  03 / {t('detail.history')}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
                  {t('detail.history')}
                </h2>
                <p className={`text-[#102530]/90 ${proseSizeClass}`}>
                  {lt(destination.historyAndHeritage)}{' '}
                  <span className="text-xs font-semibold text-[#087E9B] tabular-nums">
                    {citations.map((c) => c.code).join('')}
                  </span>
                </p>

                {linkedEras.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {linkedEras.map((era) => (
                      <Link
                        key={era.id}
                        href={`/histoire#${era.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F4EFE5] border border-[#103B50]/12 rounded text-xs font-medium text-[#103B50] transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#C47B55]" />
                        <span>
                          {era.order} · {lt(era.dateRange)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* High-Resolution Image Viewer with Zoom & Contextual Photo POIs */}
            {!readerPrefs.readerMode && (
              <section
                id="sec-gallery"
                className="scroll-mt-24 pt-8 border-t border-[#103B50]/10"
              >
                <DestinationImageViewer
                  destination={destination}
                  images={allImages}
                  onOpenFullscreen={(idx) => setLightboxIdx(idx)}
                />
              </section>
            )}

            {/* Route Calculator from Downtown Béjaïa (Car, Bus, Walking) */}
            {!readerPrefs.readerMode && (
              <section
                id="sec-route-calculator"
                className="no-print scroll-mt-24 pt-8 border-t border-[#103B50]/10"
              >
                <DestinationRouteCalculator
                  destination={destination}
                  resolvedLocation={resolvedLoc}
                />
              </section>
            )}

            {/* Interactive Location Map */}
            {!readerPrefs.readerMode && (
              <section
                id="sec-location"
                className="no-print scroll-mt-24 space-y-4 pt-8 border-t border-[#103B50]/10"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
                      {t('detail.location')}
                    </h2>
                    {resolvedLoc?.formattedAddress && (
                      <p className="text-xs text-[#51636D] mt-1">
                        {t('map.verifiedOnGoogleMaps')} : {resolvedLoc.formattedAddress}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                    <a
                      href={osmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#087E9B] hover:text-[#103B50]"
                    >
                      <span>{t('detail.openOsm')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <BejaiaMapLibreMap
                  destinations={singleList}
                  activeSlug={destination.slug}
                  heightClass="h-[380px]"
                  autoResolveLimit={1}
                  zoom={12}
                  showUserLocateButton={false}
                  onResolvedChange={(map) => {
                    if (map[destination.slug]) {
                      setResolvedLoc(map[destination.slug]);
                    }
                  }}
                />
              </section>
            )}

            {/* Personal Local-First Field Notes */}
            <section className="no-print max-w-prose pt-8 border-t border-[#103B50]/10 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-xl font-semibold text-[#103B50] inline-flex items-center gap-2">
                  <NotebookPen className="w-4 h-4 text-[#C47B55]" />
                  <span>{t('detail.fieldNotesTitle')}</span>
                </h2>
                {existingNote && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteDestinationNote(destination.slug);
                      setDraftNote('');
                    }}
                    className="inline-flex items-center gap-1 text-xs text-[#51636D] hover:text-[#C47B55]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Effacer</span>
                  </button>
                )}
              </div>
              <form onSubmit={handleSaveNote} className="space-y-2.5">
                <textarea
                  rows={3}
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder={t('detail.fieldNotesPlaceholder')}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm text-[#102530] placeholder:text-[#51636D]/70"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#103B50] hover:bg-[#087E9B] text-white text-xs font-medium rounded-md transition-colors"
                  >
                    {t('detail.saveNote')}
                  </button>
                  {noteFeedback && (
                    <span className="text-xs text-[#356B50] font-medium">
                      {t('detail.noteSaved')}
                    </span>
                  )}
                </div>
              </form>
            </section>

            {/* Live OpenStreetMap Nearby Search */}
            {!readerPrefs.readerMode && (
              <section className="no-print pt-4">
                <OsmPlacesPanel
                  title={t('detail.groundingTitle')}
                  subtitle={t('detail.groundingSubtitle')}
                  defaultQuery={groundingSuggestions[0]}
                  suggestedQueries={groundingSuggestions}
                  lat={resolvedLoc?.lat}
                  lng={resolvedLoc?.lng}
                />
              </section>
            )}
          </div>

          {/* Right Practical, TOC & Sources Sidebar */}
          {!readerPrefs.readerMode && (
            <aside className="lg:col-span-4 space-y-6">
              <div className="lg:sticky lg:top-20 space-y-6">
                <div className="no-print bg-white border border-[#103B50]/12 rounded-lg p-4 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(destination.id)}
                    aria-pressed={favored}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs sm:text-sm font-medium border transition-colors ${
                      favored
                        ? 'bg-[#C47B55] border-[#C47B55] text-white'
                        : 'bg-[#FAF8F3] border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favored ? 'fill-current' : ''}`} />
                    <span>
                      {favored ? t('destinations.removeFavorite') : t('destinations.addFavorite')}
                    </span>
                  </button>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-[#51636D]">
                    <span>{t('destinations.savedOfflineHint')}</span>
                    <button
                      type="button"
                      onClick={() => setFavoritesOpen(true)}
                      className="font-medium text-[#087E9B] hover:underline shrink-0 tabular-nums"
                    >
                      {t('destinations.openFavoritesQuick')} ({favorites.length})
                    </button>
                  </div>
                </div>

                <ChapterToc title={t('detail.tocTitle')} items={tocItems} />

                <DestinationQrCard
                  slug={destination.slug}
                  title={lt(destination.name)}
                  hasAudioGuide={hasAudioGuide}
                />

                <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-6 space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#103B50] mb-3">
                      {t('detail.characteristics')}
                    </h3>
                    <ul className="space-y-2 text-sm text-[#102530]">
                      {destination.characteristics.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Compass className="w-4 h-4 text-[#087E9B] shrink-0 mt-0.5" />
                          <span>{lt(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-[#103B50]/10">
                    <h3 className="font-serif text-xl font-semibold text-[#103B50] mb-3">
                      {t('detail.visitTips')}
                    </h3>
                    <ul className="space-y-2.5 text-sm text-[#51636D] leading-relaxed">
                      {destination.visitTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#356B50] font-semibold">·</span>
                          <span>{lt(tip)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-[#103B50]/10 space-y-3">
                    <h3 className="font-serif text-xl font-semibold text-[#103B50]">
                      {t('detail.practicalInfo')}
                    </h3>
                    <div className="text-sm text-[#51636D] space-y-2 leading-relaxed">
                      <p>{lt(destination.practicalInfo.accessNote)}</p>
                      <p>{lt(destination.practicalInfo.seasonNote)}</p>
                    </div>
                    {destination.practicalInfo.verificationNotice && (
                      <div className="p-3.5 bg-white border border-[#C47B55]/40 rounded-md flex items-start gap-2.5 text-xs text-[#103B50] leading-relaxed">
                        <ShieldAlert className="w-4 h-4 text-[#C47B55] shrink-0 mt-0.5" />
                        <span>{lt(destination.practicalInfo.verificationNotice)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 border-t border-[#103B50]/10 space-y-2.5">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#51636D]">
                      {t('detail.sources')}
                    </h3>
                    <ul className="space-y-2 text-xs text-[#51636D]">
                      {destination.sources.map((src, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-[#087E9B] shrink-0 mt-0.5" />
                          <div>
                            {src.url ? (
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#103B50] hover:text-[#087E9B] underline underline-offset-2"
                              >
                                {src.label}
                              </a>
                            ) : (
                              <span>{src.label}</span>
                            )}
                            {src.verificationNote && (
                              <p className="text-[11px] text-[#C47B55] mt-0.5">
                                {lt(src.verificationNote)}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                      {citations.map((cit) => (
                        <li key={cit.id} className="flex items-start gap-2">
                          <span className="font-semibold text-[#087E9B] tabular-nums">
                            {cit.code}
                          </span>
                          <span>{cit.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Similar Destinations */}
        {!readerPrefs.readerMode && similarDestinations.length > 0 && (
          <section className="no-print mt-16 pt-12 border-t border-[#103B50]/10">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50] mb-8">
              {t('detail.similarDestinations')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {similarDestinations.map((dest) => (
                <DestinationCard key={dest.slug} destination={dest} />
              ))}
            </div>
          </section>
        )}
      </div>

      <LightboxModal
        images={allImages}
        activeIndex={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onChangeIndex={setLightboxIdx}
        destination={destination}
      />
    </article>
  );
}
