'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowDownRight,
  BookOpenText,
  Landmark,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { getDestinationBySlug } from '@/data/destinations';
import { HISTORICAL_ERAS } from '@/data/history';
import { ArticleAudioPlayer } from '@/components/history/ArticleAudioPlayer';
import { ArticleSaveActions } from '@/components/history/ArticleSaveActions';
import { ArticleShareButton } from '@/components/history/ArticleShareButton';
import type { EraSlug, LocalizedText } from '@/types';

interface InteractiveHistoryTimelineProps {
  onOpenImmersive: (eraIndex: number) => void;
}

interface TimelineNodeMeta {
  shortLabel: LocalizedText;
  centuryBadge: LocalizedText;
  additionalPoints: LocalizedText[];
}

const TIMELINE_NODE_META: Record<EraSlug, TimelineNodeMeta> = {
  antiquite: {
    shortLabel: { fr: 'Saldae (Romaine)', ar: 'صالدا (الرومانية)' },
    centuryBadge: { fr: 'Ier av. – Ve s.', ar: 'ق.م – القرن 5م' },
    additionalPoints: [
      {
        fr: 'Colonie maritime romaine Colonia Julia Augusta Saldensium',
        ar: 'مستوطنة صالدا البحرية الرومانية',
      },
      {
        fr: 'Tunnel hydraulique de Nonius Datus (aqueduc de Toudja, ~21 km)',
        ar: 'نفق المياه لنونيوس داتوس (قناة توجة، ق. 21 كم)',
      },
    ],
  },
  hammadide: {
    shortLabel: { fr: 'Hammadite', ar: 'العهد الحمادي' },
    centuryBadge: { fr: '1067 – 1152', ar: '1067 – 1152م' },
    additionalPoints: [
      {
        fr: 'Fondation d’En-Naciria et transfert de la capitale depuis la Kalâa',
        ar: 'تأسيس الناصرية ونقل العاصمة من قلعة بني حماد',
      },
      {
        fr: 'Porte maritime Bab El Bhar, palais princiers et essor de la cire',
        ar: 'باب البحر والقصور الأميرية وتجارة الشمع البجاوي',
      },
    ],
  },
  'medieval-savant': {
    shortLabel: { fr: 'Médiévale savante', ar: 'الحاضرة العلمية' },
    centuryBadge: { fr: 'XIIe – XVe s.', ar: 'القرون 12 – 15م' },
    additionalPoints: [
      {
        fr: 'Séjour de Fibonacci (chiffres indo-arabes, Liber Abaci)',
        ar: 'إقامة فيبوناتشي وتعلم الحساب العربي-الهندي',
      },
      {
        fr: 'Rayonnement d’Ibn Khaldoun, El-Waghlissi et Sidi Boumediene',
        ar: 'إشعاع ابن خلدون والوغليسي وسيدي بومدين',
      },
    ],
  },
  'ottoman-espagnol': {
    shortLabel: { fr: 'Ottomane', ar: 'العهد العثماني' },
    centuryBadge: { fr: '1510 – 1830', ar: '1510 – 1830م' },
    additionalPoints: [
      {
        fr: 'Libération par Salah Raïs (1555) et intégration à la Régence d’Alger',
        ar: 'تحرير المدينة على يد صالح رايس (1555م) ضمن إيالة الجزائر',
      },
      {
        fr: 'Système défensif : Casbah, Bordj Moussa, Fort Sidi Abdelkader & Gouraya',
        ar: 'المنظومة الدفاعية: القصبة، برج موسى، سيدي عبد القادر وقوراية',
      },
    ],
  },
  contemporain: {
    shortLabel: { fr: 'Coloniale & Moderne', ar: 'الاستعمارية والمعاصرة' },
    centuryBadge: { fr: '1833 – XXIe s.', ar: '1833 – القرن 21م' },
    additionalPoints: [
      {
        fr: 'Période coloniale (à partir de 1833) et résistance des populations de Kabylie',
        ar: 'الحقبة الاستعمارية (منذ 1833م) ومقاومة سكان المنطقة',
      },
      {
        fr: '20 août 1956 : Congrès historique de la Soummam à Ifri Ouzellaguen',
        ar: '20 أوت 1956: مؤتمر الصومام التاريخي بإفري أوزلاقن',
      },
    ],
  },
  'patrimoine-naturel': {
    shortLabel: { fr: 'Patrimoine naturel', ar: 'التراث الطبيعي' },
    centuryBadge: { fr: 'UNESCO', ar: 'اليونسكو' },
    additionalPoints: [],
  },
};

export function InteractiveHistoryTimeline({
  onOpenImmersive,
}: InteractiveHistoryTimelineProps) {
  const { t, lt, isRtl } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeEra = HISTORICAL_ERAS[activeIndex] ?? HISTORICAL_ERAS[0];
  const activeMeta = TIMELINE_NODE_META[activeEra.slug];

  const mergedKeyPoints = useMemo(() => {
    const base = activeEra.keyMilestones.map((m) => lt(m));
    const extra = activeMeta?.additionalPoints.map((p) => lt(p)) ?? [];
    const seen = new Set<string>();
    return [...extra, ...base].filter((item) => {
      const normalized = item.toLowerCase();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  }, [activeEra.keyMilestones, activeMeta, lt]);

  const audioParagraphs = useMemo(
    () => [lt(activeEra.summary), ...activeEra.paragraphs.map((p) => lt(p))],
    [activeEra.paragraphs, activeEra.summary, lt]
  );

  const goPrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => Math.min(HISTORICAL_ERAS.length - 1, prev + 1));
  };

  return (
    <section
      aria-label={t('historyPage.timelineTitle')}
      className="no-print bg-[#FAF8F3] border border-[#103B50]/12 rounded-xl p-5 sm:p-8 space-y-7"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55] inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('historyPage.timelineKicker')}</span>
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
            {t('historyPage.timelineTitle')}
          </h2>
          <p className="text-sm text-[#51636D] leading-relaxed">
            {t('historyPage.timelineSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex === 0}
            aria-label={t('historyPage.timelinePrevEra')}
            className="p-2 rounded-md bg-white border border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5] disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <span className="text-xs font-semibold tabular-nums text-[#51636D] px-1">
            0{activeIndex + 1} / 0{HISTORICAL_ERAS.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex === HISTORICAL_ERAS.length - 1}
            aria-label={t('historyPage.timelineNextEra')}
            className="p-2 rounded-md bg-white border border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5] disabled:opacity-40 transition-colors"
          >
            <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Interactive Chronological Axis */}
      <div className="relative">
        {/* Connecting Track on Desktop */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-6 inset-x-10 h-0.5 bg-[#103B50]/15"
        />
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-6 start-10 h-0.5 bg-[#087E9B] transition-all duration-300"
          style={{
            width: `${(activeIndex / Math.max(1, HISTORICAL_ERAS.length - 1)) * 84}%`,
          }}
        />

        <div
          role="tablist"
          aria-label={t('historyPage.timelineKicker')}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10"
        >
          {HISTORICAL_ERAS.map((era, idx) => {
            const isActive = idx === activeIndex;
            const meta = TIMELINE_NODE_META[era.slug];
            return (
              <button
                key={era.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(idx)}
                className={`group text-start flex lg:flex-col items-center lg:items-center gap-3 lg:gap-2.5 p-3 lg:p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white lg:bg-transparent border border-[#087E9B] lg:border-0 shadow-xs lg:shadow-none'
                    : 'bg-white/60 lg:bg-transparent border border-[#103B50]/10 lg:border-0 hover:bg-white/90 lg:hover:bg-transparent'
                }`}
              >
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold tabular-nums border-2 shrink-0 transition-all ${
                    isActive
                      ? 'bg-[#103B50] border-[#087E9B] text-white scale-105 shadow-md'
                      : idx < activeIndex
                        ? 'bg-[#087E9B] border-[#087E9B] text-white'
                        : 'bg-white border-[#103B50]/25 text-[#103B50] group-hover:border-[#087E9B]'
                  }`}
                >
                  {era.order}
                </span>

                <div className="min-w-0 lg:text-center">
                  <p
                    className={`text-xs font-semibold truncate ${
                      isActive ? 'text-[#087E9B]' : 'text-[#C47B55]'
                    }`}
                  >
                    {meta ? lt(meta.centuryBadge) : lt(era.dateRange)}
                  </p>
                  <p className="font-serif text-sm font-semibold text-[#103B50] leading-snug">
                    {meta ? lt(meta.shortLabel) : lt(era.title)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Era Interactive Spotlight Card */}
      <div className="bg-white border border-[#103B50]/12 rounded-xl p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55] tabular-nums inline-flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" />
              <span>
                {activeEra.order} · {lt(activeEra.dateRange)}
              </span>
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50] leading-tight">
              {lt(activeEra.title)}
            </h3>
            <p className="text-sm text-[#51636D] leading-relaxed">{lt(activeEra.summary)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <ArticleSaveActions
              articleId={activeEra.id}
              kind="era"
              coverImageSrc={activeEra.coverImage?.src}
            />

            <ArticleShareButton
              tab="timeline"
              anchorId={activeEra.slug}
              title={lt(activeEra.title)}
              kicker={lt(activeEra.dateRange)}
              excerpt={lt(activeEra.summary)}
            />

            <ArticleAudioPlayer
              articleId={`timeline-${activeEra.id}`}
              title={lt(activeEra.title)}
              subtitle={lt(activeEra.subtitle)}
              paragraphs={audioParagraphs}
              compact
            />

            <button
              type="button"
              onClick={() => onOpenImmersive(activeIndex)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FAF8F3] hover:bg-[#103B50] text-[#103B50] hover:text-white border border-[#103B50]/15 text-xs font-medium transition-colors"
            >
              <BookOpenText className="w-3.5 h-3.5" />
              <span>{t('historyPage.immersiveBtn')}</span>
            </button>
          </div>
        </div>

        {/* Key Historical Milestones for Selected Era */}
        <div className="space-y-2.5 pt-3 border-t border-[#103B50]/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#103B50]">
            {t('historyPage.timelineKeyPoints')}
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {mergedKeyPoints.map((point, pIdx) => (
              <li
                key={pIdx}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FAF8F3] border border-[#103B50]/10 text-xs sm:text-sm text-[#102530]"
              >
                <span className="w-5 h-5 rounded-full bg-[#087E9B]/15 text-[#087E9B] text-[11px] font-bold tabular-nums inline-flex items-center justify-center shrink-0 mt-0.5">
                  {pIdx + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Links: Monuments + Jump to Full Essay */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#103B50]/10">
          <div className="flex flex-wrap items-center gap-2">
            {activeEra.relatedDestinations.map((slug) => {
              const dest = getDestinationBySlug(slug);
              if (!dest) return null;
              return (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.slug}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF8F3] hover:bg-[#F4EFE5] border border-[#103B50]/12 text-xs font-medium text-[#103B50]"
                >
                  <MapPin className="w-3 h-3 text-[#087E9B]" />
                  <span>{lt(dest.name)}</span>
                </Link>
              );
            })}
          </div>

          <a
            href={`#${activeEra.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#103B50] hover:bg-[#087E9B] text-white text-xs font-medium transition-colors"
          >
            <span>{t('historyPage.timelineJumpToArticle')}</span>
            <ArrowDownRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
