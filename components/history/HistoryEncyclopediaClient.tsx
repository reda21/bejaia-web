'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Landmark,
  Leaf,
  MapPin,
  Search,
  ShieldAlert,
  User,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { EditorialControls, getProseSizeClass } from '@/components/ui/EditorialControls';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { getDestinationBySlug } from '@/data/destinations';
import {
  GLOSSARY_TERMS,
  HISTORICAL_ERAS,
  HISTORICAL_FIGURES,
  MEDINA_STRATA,
  NATURALIST_DOSSIERS,
} from '@/data/history';
import type { SourceCitation } from '@/types';

type HistoryTab = 'timeline' | 'figures' | 'medina' | 'glossary' | 'nature';

function SourcesAccordion({
  sources,
  notice,
  title,
}: {
  sources: SourceCitation[];
  notice?: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#103B50]/12 rounded-md bg-[#FAF8F3] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-widest text-[#103B50] hover:bg-[#F4EFE5] transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-[#087E9B]" />
          <span>
            {title} ({sources.length})
          </span>
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-[#103B50]/10 space-y-2.5 text-xs text-[#51636D]">
          {notice && (
            <div className="p-2.5 bg-white border border-[#C47B55]/35 rounded flex items-start gap-2 text-[#103B50]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#C47B55] shrink-0 mt-0.5" />
              <span>{notice}</span>
            </div>
          )}
          <ul className="space-y-1.5">
            {sources.map((src) => (
              <li key={src.id} className="flex items-start gap-2 leading-relaxed">
                <span className="font-semibold text-[#087E9B] tabular-nums">{src.code}</span>
                <div>
                  {src.url ? (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#103B50] hover:text-[#087E9B] underline underline-offset-2 inline-flex items-center gap-1"
                    >
                      <span>{src.label}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-[#103B50]">{src.label}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function HistoryEncyclopediaClient() {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get('tab') as HistoryTab | null;
  const validInitialTab: HistoryTab =
    initialTabParam === 'figures' ||
    initialTabParam === 'medina' ||
    initialTabParam === 'glossary' ||
    initialTabParam === 'nature'
      ? initialTabParam
      : 'timeline';

  const { t, lt, readerPrefs } = useApp();
  const [activeTab, setActiveTab] = useState<HistoryTab>(validInitialTab);
  const [glossaryCategory, setGlossaryCategory] = useState<string>('all');
  const [glossarySearch, setGlossarySearch] = useState('');

  const proseSizeClass = getProseSizeClass(readerPrefs.fontScale);

  const filteredGlossary = useMemo(() => {
    const q = glossarySearch.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((term) => {
      if (glossaryCategory !== 'all' && term.category !== glossaryCategory) return false;
      if (!q) return true;
      return (
        term.term.toLowerCase().includes(q) ||
        term.arabicScript.toLowerCase().includes(q) ||
        (term.kabyleTerm ?? '').toLowerCase().includes(q) ||
        term.definition.fr.toLowerCase().includes(q) ||
        term.definition.ar.toLowerCase().includes(q)
      );
    });
  }, [glossaryCategory, glossarySearch]);

  const tabs: { key: HistoryTab; label: string; icon: React.ReactNode }[] = [
    { key: 'timeline', label: t('historyPage.tabTimeline'), icon: <Clock className="w-4 h-4" /> },
    { key: 'figures', label: t('historyPage.tabFigures'), icon: <User className="w-4 h-4" /> },
    { key: 'medina', label: t('historyPage.tabMedina'), icon: <Landmark className="w-4 h-4" /> },
    { key: 'glossary', label: t('historyPage.tabGlossary'), icon: <BookOpen className="w-4 h-4" /> },
    { key: 'nature', label: t('historyPage.tabNature'), icon: <Leaf className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white">
      <ReadingProgressBar label={t('historyPage.pageTitle')} />

      {/* Editorial Museum Hero */}
      <section className="bg-[#FAF8F3] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <Breadcrumbs items={[{ label: t('nav.history') }]} />

          <div className="max-w-3xl space-y-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55]">
              Saldae · En-Naciria · Bgayet · ⴱⴳⴰⵢⴻⵜ
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50] leading-tight">
              {t('historyPage.pageTitle')}
            </h1>
            <p className="text-base text-[#51636D] leading-relaxed">
              {t('historyPage.pageSubtitle')}
            </p>
          </div>

          <div className="pt-6 space-y-4">
            <EditorialControls showPrint={true} />

            {/* Section Tabs */}
            <div
              role="tablist"
              aria-label={t('historyPage.pageTitle')}
              className="no-print flex flex-wrap gap-2"
            >
              {tabs.map((tab) => {
                const selected = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs sm:text-sm font-medium border transition-colors ${
                      selected
                        ? 'bg-[#103B50] border-[#103B50] text-white'
                        : 'bg-white border-[#103B50]/12 text-[#103B50] hover:bg-[#F4EFE5]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* TAB 1: CHRONOLOGICAL TIMELINE ACROSS THE CENTURIES */}
        {activeTab === 'timeline' && (
          <div className="space-y-16">
            {/* Horizontal Chronological Index Rail */}
            {!readerPrefs.readerMode && (
              <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pb-8 border-b border-[#103B50]/10">
                {HISTORICAL_ERAS.map((era) => (
                  <a
                    key={era.id}
                    href={`#${era.slug}`}
                    className="p-4 bg-[#FAF8F3] hover:bg-[#F4EFE5] border border-[#103B50]/10 rounded-md transition-colors flex flex-col justify-between gap-2"
                  >
                    <span className="text-xs font-semibold text-[#C47B55] tabular-nums">
                      {era.order} / {lt(era.dateRange)}
                    </span>
                    <span className="font-serif text-base font-semibold text-[#103B50] leading-snug">
                      {lt(era.title)}
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* Era Essays */}
            <div className="space-y-20">
              {HISTORICAL_ERAS.map((era, idx) => (
                <article
                  key={era.id}
                  id={era.slug}
                  className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-16 border-b border-[#103B50]/10 last:border-b-0 last:pb-0"
                >
                  {/* Visual & Caption Column */}
                  {!readerPrefs.readerMode && (
                    <div className="lg:col-span-5 space-y-3">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F4EFE5] border border-[#103B50]/10">
                        <ResilientImage
                          src={era.coverImage.src}
                          alt={lt(era.coverImage.alt)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs font-serif italic text-[#51636D] leading-relaxed">
                        Fig. {idx + 1} —{' '}
                        {era.coverImage.caption ? lt(era.coverImage.caption) : lt(era.coverImage.alt)}{' '}
                        · {era.coverImage.source}
                      </p>

                      {/* Related Figures */}
                      {era.relatedFigures.length > 0 && (
                        <div className="p-4 bg-[#FAF8F3] border border-[#103B50]/10 rounded-md space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#103B50]">
                            {t('historyPage.tabFigures')}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {era.relatedFigures.map((figSlug) => {
                              const fig = HISTORICAL_FIGURES.find((f) => f.slug === figSlug);
                              if (!fig) return null;
                              return (
                                <button
                                  key={fig.id}
                                  type="button"
                                  onClick={() => setActiveTab('figures')}
                                  className="text-xs font-medium text-[#087E9B] hover:text-[#103B50] underline underline-offset-2 text-start"
                                >
                                  {lt(fig.name)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Editorial Prose Column (65-75ch Measure) */}
                  <div
                    className={`${
                      readerPrefs.readerMode ? 'lg:col-span-10 lg:col-start-2' : 'lg:col-span-7'
                    } space-y-6`}
                  >
                    <div className="max-w-prose space-y-6">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55] tabular-nums">
                          {era.order} · {lt(era.dateRange)}
                        </p>
                        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50] leading-tight">
                          {lt(era.title)}
                        </h2>
                        <p className="text-sm font-medium text-[#087E9B]">{lt(era.subtitle)}</p>
                      </div>

                      <p className={`editorial-dropcap text-[#102530] ${proseSizeClass}`}>
                        {lt(era.summary)}
                      </p>

                      {era.paragraphs.map((para, pIdx) => (
                        <p key={pIdx} className={`text-[#102530]/90 ${proseSizeClass}`}>
                          {lt(para)}
                        </p>
                      ))}

                      {era.pullQuote && (
                        <blockquote className="py-5 my-6 border-y border-[#103B50]/15 font-serif text-xl sm:text-2xl italic text-[#103B50] leading-relaxed">
                          « {lt(era.pullQuote)} »
                        </blockquote>
                      )}

                      {/* Key Milestones */}
                      <div className="bg-[#FAF8F3] border border-[#103B50]/10 rounded-md p-5 space-y-2.5">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#103B50]">
                          {t('culture.keyElements')}
                        </h3>
                        <ul className="space-y-1.5 text-sm text-[#102530]">
                          {era.keyMilestones.map((m, mIdx) => (
                            <li key={mIdx} className="flex items-start gap-2">
                              <span className="text-[#087E9B] font-bold">·</span>
                              <span>{lt(m)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Related Visitable Destinations */}
                      {era.relatedDestinations.length > 0 && (
                        <div className="space-y-2.5">
                          <p className="text-xs font-semibold uppercase tracking-widest text-[#51636D]">
                            {t('historyPage.relatedSites')}
                          </p>
                          <div className="flex flex-wrap gap-2.5">
                            {era.relatedDestinations.map((destSlug) => {
                              const dest = getDestinationBySlug(destSlug);
                              if (!dest) return null;
                              return (
                                <Link
                                  key={dest.slug}
                                  href={`/destinations/${dest.slug}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4EFE5] border border-[#103B50]/15 rounded-md text-xs font-medium text-[#103B50] transition-colors"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-[#087E9B]" />
                                  <span>{lt(dest.name)}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <SourcesAccordion
                        sources={era.sources}
                        notice={era.verificationNotice ? lt(era.verificationNotice) : undefined}
                        title={t('historyPage.sourcesPanel')}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BIOGRAPHICAL & SCHOLARLY FIGURES */}
        {activeTab === 'figures' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {HISTORICAL_FIGURES.map((fig, idx) => (
                <article
                  key={fig.id}
                  id={fig.slug}
                  className="scroll-mt-24 bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-6 sm:p-8 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#51636D] tabular-nums">
                      <span className="font-semibold text-[#C47B55]">0{idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span>{lt(fig.dates)}</span>
                    </div>

                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
                        {lt(fig.name)}
                      </h2>
                      <p className="text-xs font-medium text-[#087E9B] mt-1">{lt(fig.domain)}</p>
                    </div>

                    <p className="text-sm font-medium text-[#103B50] leading-relaxed py-3 border-y border-[#103B50]/10">
                      {lt(fig.bejaiaConnection)}
                    </p>

                    <div className={`space-y-3 text-[#102530]/90 ${proseSizeClass}`}>
                      {fig.biography.map((para, pIdx) => (
                        <p key={pIdx}>{lt(para)}</p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-[#103B50]/10">
                    {fig.relatedDestinations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {fig.relatedDestinations.map((destSlug) => {
                          const dest = getDestinationBySlug(destSlug);
                          if (!dest) return null;
                          return (
                            <Link
                              key={dest.slug}
                              href={`/destinations/${dest.slug}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4EFE5] border border-[#103B50]/12 rounded text-xs font-medium text-[#103B50]"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#087E9B]" />
                              <span>{lt(dest.name)}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    <SourcesAccordion sources={fig.sources} title={t('historyPage.sourcesPanel')} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEDINA STRATA & FORTIFICATIONS */}
        {activeTab === 'medina' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-5 bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg text-sm text-[#51636D] leading-relaxed">
              Ce relevé comparatif distingue rigoureusement les vestiges monumentaux visibles sur le terrain des traces archéologiques enfouies de la ville antique de Saldae.
            </div>

            {MEDINA_STRATA.map((layer) => (
              <article
                key={layer.id}
                className="bg-white border border-[#103B50]/12 rounded-lg p-6 sm:p-8 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="font-semibold text-[#C47B55]">{layer.order}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#087E9B]">{lt(layer.period)}</span>
                  </div>
                  <span className="text-[#356B50] font-medium">
                    {layer.attestationStatus === 'attested_vestiges'
                      ? 'Vestiges attestés sur site'
                      : 'Traces archéologiques ponctuelles'}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-semibold text-[#103B50]">
                  {lt(layer.title)}
                </h2>

                <p className={`text-[#102530]/90 ${proseSizeClass}`}>{lt(layer.description)}</p>

                <p className="text-xs text-[#51636D] italic">{lt(layer.attestationNote)}</p>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {layer.relatedDestinations.map((destSlug) => {
                    const dest = getDestinationBySlug(destSlug);
                    if (!dest) return null;
                    return (
                      <Link
                        key={dest.slug}
                        href={`/destinations/${dest.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F4EFE5] border border-[#103B50]/12 rounded text-xs font-medium text-[#103B50]"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#087E9B]" />
                        <span>{lt(dest.name)}</span>
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </Link>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* TAB 4: TRILINGUAL HERITAGE GLOSSARY */}
        {activeTab === 'glossary' && (
          <div className="space-y-8">
            <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#51636D] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
                <input
                  type="search"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Filtrer un terme (ex. Bab, Tajmaât, Ighzer, Saldae)..."
                  className="w-full ps-10 pe-3.5 py-2 bg-white border border-[#103B50]/15 rounded-md text-sm text-[#102530]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'Tous' },
                  { key: 'architecture', label: 'Architecture' },
                  { key: 'geographie', label: 'Géographie' },
                  { key: 'tradition', label: 'Traditions' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setGlossaryCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      glossaryCategory === cat.key
                        ? 'bg-[#103B50] text-white'
                        : 'bg-white text-[#103B50] border border-[#103B50]/12 hover:bg-[#F4EFE5]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGlossary.map((entry) => (
                <article
                  key={entry.id}
                  id={entry.id}
                  className="scroll-mt-24 bg-white border border-[#103B50]/12 rounded-lg p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-serif text-xl font-semibold text-[#103B50]">
                        {entry.term}
                      </h2>
                      <span className="text-base font-medium text-[#087E9B]" dir="rtl">
                        {entry.arabicScript}
                      </span>
                    </div>

                    {entry.kabyleTerm && (
                      <p className="text-xs text-[#51636D]">
                        <span className="font-semibold text-[#103B50]">Taqvaylit :</span>{' '}
                        {entry.kabyleTerm}
                        {entry.kabyleStatus === 'pending_official_validation' && (
                          <span className="text-[#C47B55]"> · validation linguistique en cours</span>
                        )}
                      </p>
                    )}

                    <p className="text-sm text-[#102530]/90 leading-relaxed">
                      {lt(entry.definition)}
                    </p>
                  </div>

                  {entry.relatedDestinations.length > 0 && (
                    <div className="pt-3 border-t border-[#103B50]/10 flex flex-wrap gap-2">
                      {entry.relatedDestinations.map((destSlug) => {
                        const dest = getDestinationBySlug(destSlug);
                        if (!dest) return null;
                        return (
                          <Link
                            key={dest.slug}
                            href={`/destinations/${dest.slug}`}
                            className="text-xs font-medium text-[#087E9B] hover:text-[#103B50] underline underline-offset-2"
                          >
                            {lt(dest.name)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: NATURALIST ATLAS DOSSIERS */}
        {activeTab === 'nature' && (
          <div className="space-y-12">
            {NATURALIST_DOSSIERS.map((dossier, idx) => (
              <article
                key={dossier.id}
                id={dossier.slug}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12 border-b border-[#103B50]/10 last:border-b-0 last:pb-0"
              >
                <div className="lg:col-span-5 space-y-2.5">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F4EFE5] border border-[#103B50]/10">
                    <ResilientImage
                      src={dossier.coverImage.src}
                      alt={lt(dossier.coverImage.alt)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs font-serif italic text-[#51636D]">
                    Fig. {idx + 1} — {lt(dossier.coverImage.alt)} · {dossier.coverImage.source}
                  </p>
                </div>

                <div className="lg:col-span-7 space-y-5 max-w-prose">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#356B50]">
                      0{idx + 1} · {lt(dossier.ecosystemType)}
                    </p>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
                      {lt(dossier.title)}
                    </h2>
                    <p className="text-sm font-medium text-[#087E9B]">{lt(dossier.subtitle)}</p>
                  </div>

                  <p className={`editorial-dropcap text-[#102530] ${proseSizeClass}`}>
                    {lt(dossier.summary)}
                  </p>

                  {dossier.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-1.5">
                      <h3 className="font-serif text-lg font-semibold text-[#103B50]">
                        {lt(sec.heading)}
                      </h3>
                      <p className={`text-[#102530]/90 ${proseSizeClass}`}>{lt(sec.body)}</p>
                    </div>
                  ))}

                  <div className="bg-[#FAF8F3] border border-[#103B50]/10 rounded-md p-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#356B50]">
                      Espèces & formations attestées
                    </p>
                    <ul className="space-y-1 text-sm text-[#102530]">
                      {dossier.speciesOrFormations.map((sp, spIdx) => (
                        <li key={spIdx} className="flex items-start gap-2">
                          <span className="text-[#356B50] font-bold">·</span>
                          <span>{lt(sp)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {dossier.relatedDestinations.map((slug) => {
                      const dest = getDestinationBySlug(slug);
                      if (!dest) return null;
                      return (
                        <Link
                          key={dest.slug}
                          href={`/destinations/${dest.slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4EFE5] border border-[#103B50]/15 rounded text-xs font-medium text-[#103B50]"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#356B50]" />
                          <span>{lt(dest.name)}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <SourcesAccordion sources={dossier.sources} title={t('historyPage.sourcesPanel')} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
