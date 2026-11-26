'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  X,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  Type as TypeIcon,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { ArticleAudioPlayer } from '@/components/history/ArticleAudioPlayer';
import { getDestinationBySlug } from '@/data/destinations';
import type { MediaAsset, SourceCitation } from '@/types';

export interface ImmersiveArticleItem {
  id: string;
  order?: string;
  kicker: string;
  title: string;
  subtitle?: string;
  summary: string;
  paragraphs: string[];
  pullQuote?: string;
  keyPointsTitle?: string;
  keyPoints?: string[];
  coverImage?: MediaAsset;
  relatedDestinationSlugs?: string[];
  sources?: SourceCitation[];
}

interface ImmersiveArticleReaderProps {
  articles: ImmersiveArticleItem[];
  activeIndex: number | null;
  onClose: () => void;
  onSelectIndex: (nextIndex: number) => void;
}

type PaperTheme = 'cream' | 'white' | 'night';

const FONT_STEPS = [
  'text-base sm:text-[1.0625rem] leading-[1.9]',
  'text-lg sm:text-[1.1875rem] leading-[1.95]',
  'text-xl sm:text-[1.3125rem] leading-[2]',
];

export function ImmersiveArticleReader({
  articles,
  activeIndex,
  onClose,
  onSelectIndex,
}: ImmersiveArticleReaderProps) {
  const { t, lt, isRtl } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('cream');
  const [fontStep, setFontStep] = useState(1);
  const [serifBody, setSerifBody] = useState(true);
  const [progress, setProgress] = useState(0);

  const isOpen = activeIndex !== null && Boolean(articles[activeIndex]);
  const article = isOpen && activeIndex !== null ? articles[activeIndex] : null;

  useEffect(() => {
    if (!isOpen) return;

    const root = document.documentElement;
    root.classList.add('immersive-reading');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      root.classList.remove('immersive-reading');
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    queueMicrotask(() => setProgress(0));
  }, [activeIndex, isOpen]);

  if (!isOpen || !article || activeIndex === null) return null;

  const wordCount = [article.summary, ...article.paragraphs]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < articles.length - 1;

  const surfaceStyles: Record<
    PaperTheme,
    {
      shell: string;
      topBar: string;
      heading: string;
      body: string;
      muted: string;
      card: string;
      border: string;
      accent: string;
    }
  > = {
    cream: {
      shell: 'bg-[#F8F4EC] text-[#1D2A32]',
      topBar: 'bg-[#F8F4EC]/95 border-[#103B50]/12',
      heading: 'text-[#103B50]',
      body: 'text-[#1D2A32]',
      muted: 'text-[#5A6A73]',
      card: 'bg-[#F1EAE0]',
      border: 'border-[#103B50]/14',
      accent: 'text-[#B5653D]',
    },
    white: {
      shell: 'bg-[#FFFFFF] text-[#14232C]',
      topBar: 'bg-white/95 border-[#103B50]/12',
      heading: 'text-[#103B50]',
      body: 'text-[#1A2933]',
      muted: 'text-[#51636D]',
      card: 'bg-[#FAF8F3]',
      border: 'border-[#103B50]/12',
      accent: 'text-[#087E9B]',
    },
    night: {
      shell: 'bg-[#0C1821] text-[#E9F0F5]',
      topBar: 'bg-[#0C1821]/95 border-white/12',
      heading: 'text-[#F3F8FB]',
      body: 'text-[#D7E3EB]',
      muted: 'text-[#9BB0BE]',
      card: 'bg-[#132533]',
      border: 'border-white/12',
      accent: 'text-[#E29A74]',
    },
  };

  const theme = surfaceStyles[paperTheme];

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
      setProgress(100);
      return;
    }
    setProgress(Math.min(100, Math.max(0, Math.round((el.scrollTop / maxScroll) * 100))));
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      role="dialog"
      aria-modal="true"
      aria-label={`${t('historyPage.immersiveLabel')} — ${article.title}`}
      className={`fixed inset-0 z-50 overflow-y-auto transition-colors duration-200 ${theme.shell}`}
    >
      {/* Magazine Scroll Reading Progress Bar */}
      <div className="fixed top-0 inset-x-0 z-50 h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-[#C47B55] transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Minimal Floating Magazine Controls Bar */}
      <div
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${theme.topBar}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen className={`w-4 h-4 shrink-0 ${theme.accent}`} />
            <span className={`text-xs font-semibold uppercase tracking-widest truncate ${theme.muted}`}>
              {t('historyPage.immersiveLabel')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Paper Surface Switcher */}
            <div
              className={`hidden sm:inline-flex items-center rounded-md border p-0.5 ${theme.border}`}
            >
              {(
                [
                  { id: 'cream', label: t('historyPage.paperCream') },
                  { id: 'white', label: t('historyPage.paperWhite') },
                  { id: 'night', label: t('historyPage.paperNight') },
                ] as { id: PaperTheme; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaperTheme(opt.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    paperTheme === opt.id
                      ? 'bg-[#103B50] text-white'
                      : `${theme.muted} hover:opacity-100`
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Serif / Sans Toggle */}
            <button
              type="button"
              onClick={() => setSerifBody((prev) => !prev)}
              title="Serif / Sans"
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors ${theme.border} ${theme.heading}`}
            >
              <TypeIcon className="w-3.5 h-3.5" />
              <span className={serifBody ? 'font-serif' : 'font-sans'}>Aa</span>
            </button>

            {/* Font Size Controls */}
            <div className={`inline-flex items-center rounded-md border overflow-hidden ${theme.border}`}>
              <button
                type="button"
                onClick={() => setFontStep((s) => Math.max(0, s - 1))}
                disabled={fontStep === 0}
                aria-label="Réduire la taille du texte"
                className={`p-1.5 disabled:opacity-35 ${theme.heading}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFontStep((s) => Math.min(FONT_STEPS.length - 1, s + 1))}
                disabled={fontStep === FONT_STEPS.length - 1}
                aria-label="Augmenter la taille du texte"
                className={`p-1.5 disabled:opacity-35 border-s ${theme.border} ${theme.heading}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Exit Immersive Reader */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#103B50] hover:bg-[#087E9B] text-white text-xs font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="hidden md:inline">{t('historyPage.immersiveExit')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Magazine Editorial Body */}
      <article className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 space-y-10">
        {/* Magazine Masthead Header */}
        <header className="max-w-[66ch] mx-auto text-center space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.2em]">
            <span className={theme.accent}>{article.kicker}</span>
            <span className={theme.muted} aria-hidden="true">
              ·
            </span>
            <span className={`inline-flex items-center gap-1 ${theme.muted} tabular-nums`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {readingMinutes} {t('historyPage.readingTime')}
              </span>
            </span>
          </div>

          <h1
            className={`font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-[1.15] tracking-tight ${theme.heading}`}
          >
            {article.title}
          </h1>

          {article.subtitle && (
            <p className={`text-base sm:text-xl font-serif italic leading-relaxed ${theme.muted}`}>
              {article.subtitle}
            </p>
          )}

          <div className="w-16 h-0.5 bg-[#C47B55] mx-auto pt-1" aria-hidden="true" />

          <div className="pt-2 text-start">
            <ArticleAudioPlayer
              articleId={`immersive-${article.id}`}
              title={article.title}
              subtitle={article.subtitle}
              paragraphs={[article.summary, ...article.paragraphs]}
            />
          </div>
        </header>

        {/* Cinematic Magazine Feature Plate */}
        {article.coverImage && (
          <figure className="space-y-3">
            <div
              className={`relative w-full aspect-[16/9] rounded-xl overflow-hidden border shadow-sm ${theme.border}`}
            >
              <ResilientImage
                src={article.coverImage.src}
                alt={lt(article.coverImage.alt)}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
            <figcaption className={`text-center text-xs sm:text-sm font-serif italic ${theme.muted}`}>
              {article.coverImage.caption
                ? lt(article.coverImage.caption)
                : lt(article.coverImage.alt)}{' '}
              · {article.coverImage.source}
            </figcaption>
          </figure>
        )}

        {/* Optimal 65ch Typographic Prose Column */}
        <div
          className={`max-w-[65ch] mx-auto space-y-7 ${
            serifBody ? 'font-serif' : 'font-sans'
          } ${FONT_STEPS[fontStep]} ${theme.body}`}
        >
          <p className="editorial-dropcap font-normal">{article.summary}</p>

          {article.paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}

          {article.pullQuote && (
            <blockquote
              className={`my-10 py-7 px-6 sm:px-8 border-y-2 ${theme.border} font-serif text-xl sm:text-2xl italic leading-relaxed text-center ${theme.heading}`}
            >
              « {article.pullQuote} »
            </blockquote>
          )}

          {article.keyPoints && article.keyPoints.length > 0 && (
            <aside className={`rounded-xl p-6 sm:p-7 border font-sans space-y-3 ${theme.card} ${theme.border}`}>
              <h2 className={`text-xs font-semibold uppercase tracking-[0.18em] ${theme.accent}`}>
                {article.keyPointsTitle || t('culture.keyElements')}
              </h2>
              <ul className="space-y-2.5 text-sm sm:text-base leading-relaxed">
                {article.keyPoints.map((kp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className={`font-bold ${theme.accent}`}>·</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Related Visitable Sites */}
          {article.relatedDestinationSlugs && article.relatedDestinationSlugs.length > 0 && (
            <div className={`pt-6 border-t font-sans space-y-3 ${theme.border}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${theme.muted}`}>
                {t('historyPage.relatedSites')}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {article.relatedDestinationSlugs.map((slug) => {
                  const dest = getDestinationBySlug(slug);
                  if (!dest) return null;
                  return (
                    <Link
                      key={dest.slug}
                      href={`/destinations/${dest.slug}`}
                      onClick={onClose}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border text-xs font-medium transition-colors ${theme.card} ${theme.border} ${theme.heading} hover:border-[#087E9B]`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#087E9B]" />
                      <span>{lt(dest.name)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Magazine Footer Pager */}
          <nav
            aria-label="Navigation magazine"
            className={`pt-10 mt-10 border-t font-sans flex flex-wrap items-center justify-between gap-4 ${theme.border}`}
          >
            {hasPrev ? (
              <button
                type="button"
                onClick={() => onSelectIndex(activeIndex - 1)}
                className={`inline-flex items-center gap-2 text-start px-4 py-2.5 rounded-lg border transition-colors ${theme.card} ${theme.border} ${theme.heading}`}
              >
                <ChevronLeft className={`w-4 h-4 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
                <span className="text-xs sm:text-sm font-medium">
                  {t('historyPage.prevArticle')}
                </span>
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={onClose}
              className={`text-xs font-medium underline underline-offset-4 ${theme.muted}`}
            >
              {t('historyPage.immersiveExit')}
            </button>

            {hasNext ? (
              <button
                type="button"
                onClick={() => onSelectIndex(activeIndex + 1)}
                className={`inline-flex items-center gap-2 text-end px-4 py-2.5 rounded-lg border transition-colors ${theme.card} ${theme.border} ${theme.heading}`}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {t('historyPage.nextArticle')}
                </span>
                <ChevronRight className={`w-4 h-4 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </article>
    </div>
  );
}
