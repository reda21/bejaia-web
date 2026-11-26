'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { CULTURE_ARTICLES } from '@/data/culture';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { EditorialControls, getProseSizeClass } from '@/components/ui/EditorialControls';

export function CultureClient() {
  const { t, lt, readerPrefs } = useApp();
  const proseSizeClass = getProseSizeClass(readerPrefs.fontScale);

  return (
    <div className="bg-white">
      <ReadingProgressBar label={t('culture.pageTitle')} />

      <section className="bg-[#FAF8F3] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <Breadcrumbs items={[{ label: t('nav.culture') }]} />
          <div className="max-w-3xl space-y-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55]">
              Bgayet · ⴱⴳⴰⵢⴻⵜ · Patrimoine vivant
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50]">
              {t('culture.pageTitle')}
            </h1>
            <p className="text-base text-[#51636D] leading-relaxed">{t('culture.pageSubtitle')}</p>
          </div>

          <div className="pt-6 space-y-4">
            <EditorialControls showPrint={true} />

            {/* Chapter Anchor Navigation */}
            <div className="no-print flex flex-wrap gap-2">
              {CULTURE_ARTICLES.map((art, idx) => (
                <a
                  key={art.id}
                  href={`#${art.slug}`}
                  className="px-3.5 py-2 bg-white hover:bg-[#103B50] text-[#103B50] hover:text-white border border-[#103B50]/12 rounded-md text-xs font-medium transition-colors"
                >
                  <span className="tabular-nums opacity-65 me-1.5">0{idx + 1}</span>
                  {lt(art.theme)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-20">
        {CULTURE_ARTICLES.map((article, idx) => {
          const reversed = idx % 2 === 1;
          return (
            <article
              key={article.id}
              id={article.slug}
              className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-16 border-b border-[#103B50]/10 last:border-b-0 last:pb-0"
            >
              {!readerPrefs.readerMode && (
                <div className={`lg:col-span-5 ${reversed ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F4EFE5] border border-[#103B50]/10">
                    <ResilientImage
                      src={article.coverImage.src}
                      alt={lt(article.coverImage.alt)}
                      fill
                      priority={idx === 0}
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs font-serif italic text-[#51636D] mt-2 leading-relaxed">
                    Fig. {idx + 1} — {lt(article.coverImage.alt)} · {article.coverImage.source}
                  </p>
                </div>
              )}

              <div
                className={`${
                  readerPrefs.readerMode ? 'lg:col-span-10 lg:col-start-2' : 'lg:col-span-7'
                } space-y-5 ${reversed ? 'lg:order-1' : ''}`}
              >
                <div className="max-w-prose space-y-5">
                  <div className="flex items-center gap-2 text-xs text-[#51636D] tabular-nums">
                    <span className="font-semibold text-[#C47B55]">0{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#087E9B]">{lt(article.theme)}</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50] leading-tight">
                    {lt(article.title)}
                  </h2>

                  <p className={`editorial-dropcap font-medium text-[#103B50]/90 ${proseSizeClass}`}>
                    {lt(article.excerpt)}
                  </p>

                  <div className={`space-y-4 text-[#102530]/90 ${proseSizeClass}`}>
                    {article.content.map((para, pIdx) => (
                      <p key={pIdx}>{lt(para)}</p>
                    ))}
                  </div>

                  <div className="bg-[#FAF8F3] border border-[#103B50]/10 rounded-lg p-5 space-y-2.5">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#103B50]">
                      {t('culture.keyElements')}
                    </h3>
                    <ul className="space-y-1.5 text-sm text-[#102530]">
                      {article.keyElements.map((el, eIdx) => (
                        <li key={eIdx} className="flex items-start gap-2">
                          <span className="text-[#087E9B] font-bold">·</span>
                          <span>{lt(el)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-xs text-[#51636D] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#087E9B]" />
                    <span>
                      {t('culture.sourceLabel')} : {article.source}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          );
        })}

        {/* Link to Historical Encyclopedia & Heritage Destinations */}
        <div className="no-print bg-[#103B50] text-white rounded-lg p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
              Prolonger le voyage à travers les siècles
            </h2>
            <p className="text-sm text-[#F4EFE5]/85 leading-relaxed">
              Explorez la frise historique de Saldae à En-Naciria, les notices de Fibonacci et d’Ibn Khaldoun, le glossaire trilingue et les sites visitables.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/histoire"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C47B55] hover:bg-[#b06a46] text-white text-sm font-medium rounded-md transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>{t('home.exploreHistory')}</span>
            </Link>
            <Link
              href="/categories/historique"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#087E9B] hover:bg-[#066982] text-white text-sm font-medium rounded-md transition-colors"
            >
              <span>Patrimoine historique</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
            <Link
              href="/categories/culturel"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#103B50] hover:bg-[#F4EFE5] text-sm font-medium rounded-md transition-colors"
            >
              <span>Villages traditionnels</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
