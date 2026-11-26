'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, MapPin, Clock, User, BookOpen, Compass } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { DESTINATIONS } from '@/data/destinations';
import { CIRCUITS } from '@/data/circuits';
import { CULTURE_ARTICLES } from '@/data/culture';
import { GLOSSARY_TERMS, HISTORICAL_ERAS, HISTORICAL_FIGURES } from '@/data/history';

function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function GlobalSearchModal() {
  const { searchOpen, setSearchOpen, t, lt } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    const q = normalizeSearch(query);
    if (q.length < 2) return null;

    const destinations = DESTINATIONS.filter((d) =>
      [d.name.fr, d.name.ar, d.commune.fr, d.commune.ar, d.shortDescription.fr]
        .map(normalizeSearch)
        .some((v) => v.includes(q))
    ).slice(0, 6);

    const eras = HISTORICAL_ERAS.filter((era) =>
      [era.title.fr, era.title.ar, era.subtitle.fr, era.summary.fr]
        .map(normalizeSearch)
        .some((v) => v.includes(q))
    ).slice(0, 4);

    const figures = HISTORICAL_FIGURES.filter((fig) =>
      [fig.name.fr, fig.name.ar, fig.domain.fr, fig.bejaiaConnection.fr]
        .map(normalizeSearch)
        .some((v) => v.includes(q))
    ).slice(0, 4);

    const glossary = GLOSSARY_TERMS.filter((term) =>
      [term.term, term.arabicScript, term.kabyleTerm ?? '', term.definition.fr, term.definition.ar]
        .map(normalizeSearch)
        .some((v) => v.includes(q))
    ).slice(0, 5);

    const circuits = CIRCUITS.filter((c) =>
      [c.title.fr, c.title.ar, c.subtitle.fr]
        .map(normalizeSearch)
        .some((v) => v.includes(q))
    ).slice(0, 3);

    const culture = CULTURE_ARTICLES.filter((a) =>
      [a.title.fr, a.title.ar, a.theme.fr, a.excerpt.fr]
        .map(normalizeSearch)
        .some((v) => v.includes(q))
    ).slice(0, 3);

    const total =
      destinations.length +
      eras.length +
      figures.length +
      glossary.length +
      circuits.length +
      culture.length;

    return { destinations, eras, figures, glossary, circuits, culture, total };
  }, [query]);

  if (!searchOpen) return null;

  const closeModal = () => {
    setSearchOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('searchModal.title')}
      className="no-print fixed inset-0 z-50 bg-[#103B50]/55 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-16"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-2xl bg-white border border-[#103B50]/15 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#103B50]/10 flex items-center gap-3 bg-[#FAF8F3]">
          <Search className="w-5 h-5 text-[#087E9B] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchModal.placeholder')}
            aria-label={t('searchModal.placeholder')}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#102530] placeholder:text-[#51636D]/75 focus:outline-none"
          />
          <button
            type="button"
            onClick={closeModal}
            aria-label={t('common.close')}
            className="p-1.5 text-[#51636D] hover:text-[#103B50] rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-6">
          {!results ? (
            <div className="space-y-4">
              <p className="text-sm text-[#51636D] leading-relaxed">
                {t('searchModal.emptyPrompt')}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Cap Carbon', 'Fibonacci', 'Ibn Khaldoun', 'En-Naciria', 'Tajmaât', 'Akfadou'].map(
                  (sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setQuery(sample)}
                      className="px-3 py-1.5 text-xs font-medium bg-[#FAF8F3] hover:bg-[#F4EFE5] text-[#103B50] border border-[#103B50]/12 rounded transition-colors"
                    >
                      {sample}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.total === 0 ? (
            <p className="text-sm text-[#51636D] py-6 text-center">{t('searchModal.noResults')}</p>
          ) : (
            <>
              {results.destinations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#087E9B]">
                    {t('searchModal.groupDestinations')}
                  </h3>
                  <ul className="divide-y divide-[#103B50]/10 border border-[#103B50]/10 rounded-md">
                    {results.destinations.map((dest) => (
                      <li key={dest.slug}>
                        <Link
                          href={`/destinations/${dest.slug}`}
                          onClick={closeModal}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#FAF8F3] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <MapPin className="w-4 h-4 text-[#087E9B] shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#103B50] truncate">
                                {lt(dest.name)}
                              </p>
                              <p className="text-xs text-[#51636D] truncate">{lt(dest.commune)}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#51636D] rtl:rotate-180 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.eras.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C47B55]">
                    {t('searchModal.groupEras')}
                  </h3>
                  <ul className="divide-y divide-[#103B50]/10 border border-[#103B50]/10 rounded-md">
                    {results.eras.map((era) => (
                      <li key={era.id}>
                        <Link
                          href={`/histoire#${era.slug}`}
                          onClick={closeModal}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#FAF8F3] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Clock className="w-4 h-4 text-[#C47B55] shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#103B50] truncate">
                                {era.order} · {lt(era.title)}
                              </p>
                              <p className="text-xs text-[#51636D] truncate">{lt(era.dateRange)}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#51636D] rtl:rotate-180 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.figures.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#103B50]">
                    {t('searchModal.groupFigures')}
                  </h3>
                  <ul className="divide-y divide-[#103B50]/10 border border-[#103B50]/10 rounded-md">
                    {results.figures.map((fig) => (
                      <li key={fig.id}>
                        <Link
                          href={`/histoire?tab=figures#${fig.slug}`}
                          onClick={closeModal}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#FAF8F3] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <User className="w-4 h-4 text-[#103B50] shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#103B50] truncate">
                                {lt(fig.name)}
                              </p>
                              <p className="text-xs text-[#51636D] truncate">{lt(fig.domain)}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#51636D] rtl:rotate-180 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.glossary.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#356B50]">
                    {t('searchModal.groupGlossary')}
                  </h3>
                  <ul className="divide-y divide-[#103B50]/10 border border-[#103B50]/10 rounded-md">
                    {results.glossary.map((term) => (
                      <li key={term.id}>
                        <Link
                          href={`/histoire?tab=glossary#${term.id}`}
                          onClick={closeModal}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#FAF8F3] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <BookOpen className="w-4 h-4 text-[#356B50] shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#103B50] truncate">
                                {term.term} · {term.arabicScript}
                              </p>
                              <p className="text-xs text-[#51636D] truncate">
                                {lt(term.definition)}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#51636D] rtl:rotate-180 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(results.circuits.length > 0 || results.culture.length > 0) && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#51636D]">
                    {t('searchModal.groupCircuits')}
                  </h3>
                  <ul className="divide-y divide-[#103B50]/10 border border-[#103B50]/10 rounded-md">
                    {results.circuits.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/circuits#${c.slug}`}
                          onClick={closeModal}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#FAF8F3] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Compass className="w-4 h-4 text-[#087E9B] shrink-0" />
                            <span className="text-sm font-medium text-[#103B50] truncate">
                              {lt(c.title)}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#51636D] rtl:rotate-180 shrink-0" />
                        </Link>
                      </li>
                    ))}
                    {results.culture.map((a) => (
                      <li key={a.id}>
                        <Link
                          href={`/culture#${a.slug}`}
                          onClick={closeModal}
                          className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#FAF8F3] transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <BookOpen className="w-4 h-4 text-[#C47B55] shrink-0" />
                            <span className="text-sm font-medium text-[#103B50] truncate">
                              {lt(a.title)}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#51636D] rtl:rotate-180 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
