'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Search,
  ArrowRight,
  Compass,
  Map as MapIcon,
  Maximize2,
  BookOpen,
  Clock,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { DESTINATIONS, getFeaturedDestinations } from '@/data/destinations';
import { CATEGORIES } from '@/data/categories';
import { CIRCUITS } from '@/data/circuits';
import { CULTURE_ARTICLES } from '@/data/culture';
import { HISTORICAL_ERAS } from '@/data/history';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { LiveWeatherWidget } from '@/components/home/LiveWeatherWidget';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { LightboxModal } from '@/components/ui/LightboxModal';
import type { MediaAsset } from '@/types';

const GALLERY_ITEMS: MediaAsset[] = [
  {
    src: '/images/hero-cap-carbon.jpg',
    alt: { fr: 'Cap Carbon et la baie de Béjaïa au coucher du soleil', ar: 'رأس كربون وخليج بجاية عند الغروب' },
    caption: { fr: 'Cap Carbon, phare côtier et baie de Béjaïa', ar: 'رأس كربون والمنارة الساحلية وخليج بجاية' },
    source: 'Béjaïa Explorer — Illustration éditoriale IA',
    attribution: 'Illustration éditoriale générée par IA (en attente de photographie terrain certifiée DTA Béjaïa)',
    isAiIllustration: true,
  },
  {
    src: '/images/gouraya-nature.jpg',
    alt: { fr: 'Mont Gouraya et sentiers du Parc national de Gouraya', ar: 'جبل قوراية ومسارات الحظيرة الوطنية لقوراية' },
    caption: { fr: 'Parc national de Gouraya et fort sommital', ar: 'الحظيرة الوطنية لقوراية والحصن التاريخي' },
    source: 'Béjaïa Explorer — Illustration éditoriale IA',
    attribution: 'Illustration éditoriale générée par IA (en attente de photographie terrain certifiée DTA Béjaïa)',
    isAiIllustration: true,
  },
  {
    src: '/images/aokas-coast.jpg',
    alt: { fr: 'Côte Est de Béjaïa entre Tichy, Aokas et Melbou', ar: 'الساحل الشرقي لبجاية بين تيشي وأوقاس وملبو' },
    caption: { fr: 'Criques et littoral montagneux d’Aokas et Tichy', ar: 'خلجان وساحل أوقاس وتيشي الجبلي' },
    source: 'Béjaïa Explorer — Illustration éditoriale IA',
    attribution: 'Illustration éditoriale générée par IA (en attente de photographie terrain certifiée DTA Béjaïa)',
    isAiIllustration: true,
  },
  {
    src: '/images/casbah-heritage.jpg',
    alt: { fr: 'Bab El Bhar et remparts historiques de Béjaïa', ar: 'باب البحر والأسوار التاريخية لبجاية' },
    caption: { fr: 'Patrimoine hammadite : Bab El Bhar et la Casbah', ar: 'التراث الحمادي: باب البحر والقصبة' },
    source: 'Béjaïa Explorer — Illustration éditoriale IA',
    attribution: 'Illustration éditoriale générée par IA (en attente de photographie terrain certifiée DTA Béjaïa)',
    isAiIllustration: true,
  },
  {
    src: '/images/kabyle-village.jpg',
    alt: { fr: 'Village traditionnel kabyle perché au milieu des oliveraies', ar: 'قرية قبائلية تقليدية وسط بساتين الزيتون' },
    caption: { fr: 'Villages perchés et oliveraies de la vallée de la Soummam', ar: 'القرى المعلقة وبساتين الزيتون في وادي الصومام' },
    source: 'Béjaïa Explorer — Illustration éditoriale IA',
    attribution: 'Illustration éditoriale générée par IA (en attente de photographie terrain certifiée DTA Béjaïa)',
    isAiIllustration: true,
  },
  {
    src: '/images/kabyle-craft.jpg',
    alt: { fr: 'Artisanat kabyle : poterie, bijouterie en argent et huile d’olive', ar: 'الحرف القبائلية: الفخار والحلي الفضية وزيت الزيتون' },
    caption: { fr: 'Artisanat, bijouterie kabyle, poterie et terroir', ar: 'الصناعات التقليدية والحلي القبائلية والفخار والمنتجات المحلية' },
    source: 'Béjaïa Explorer — Illustration éditoriale IA',
    attribution: 'Illustration éditoriale générée par IA (en attente de photographie terrain certifiée DTA Béjaïa)',
    isAiIllustration: true,
  },
];

export function HomeClient() {
  const router = useRouter();
  const { t, lt } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const featured = useMemo(() => getFeaturedDestinations().slice(0, 6), []);
  const recommendedCircuits = useMemo(() => CIRCUITS.slice(0, 3), []);
  const cultureHighlights = useMemo(() => CULTURE_ARTICLES.slice(0, 3), []);

  const liveMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return DESTINATIONS.filter(
      (d) =>
        d.name.fr.toLowerCase().includes(q) ||
        d.name.ar.toLowerCase().includes(q) ||
        d.commune.fr.toLowerCase().includes(q) ||
        d.commune.ar.toLowerCase().includes(q) ||
        d.shortDescription.fr.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = searchQuery.trim();
    if (cleaned) {
      router.push(`/destinations?q=${encodeURIComponent(cleaned)}`);
    } else {
      router.push('/destinations');
    }
  };

  return (
    <div>
      {/* 1. IMMERSIVE PANORAMIC HERO */}
      <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center bg-[#103B50] text-white overflow-hidden">
        <div className="absolute inset-0">
          <ResilientImage
            src="/images/hero-cap-carbon.jpg"
            alt={t('hero.title')}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2533]/90 via-[#103B50]/70 to-[#103B50]/35 rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2533]/80 via-transparent to-[#0A2533]/25" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs font-medium tracking-widest uppercase text-[#F4EFE5]/90">
              {t('hero.kicker')}
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] text-white">
              {t('hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-[#F4EFE5]/90 leading-relaxed max-w-xl">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#087E9B] hover:bg-[#066982] text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap"
              >
                <span>{t('hero.ctaDestinations')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
              <Link
                href="/circuits"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap"
              >
                <Compass className="w-4 h-4" />
                <span>{t('hero.ctaCircuits')}</span>
              </Link>
            </div>

            {/* Instant Tourism Search Bar */}
            <div className="pt-4 relative max-w-xl">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-white rounded-md shadow-xl overflow-hidden p-1.5"
              >
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-[#51636D] ms-3 shrink-0" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                    placeholder={t('hero.searchPlaceholder')}
                    aria-label={t('hero.searchPlaceholder')}
                    className="w-full px-3 py-2 text-sm text-[#102530] placeholder:text-[#51636D]/75 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#103B50] hover:bg-[#087E9B] text-white text-sm font-medium rounded transition-colors whitespace-nowrap shrink-0"
                >
                  {t('hero.searchButton')}
                </button>
              </form>

              {searchFocused && liveMatches.length > 0 && (
                <div className="absolute top-full start-0 end-0 mt-1.5 bg-white border border-[#103B50]/15 rounded-md shadow-xl overflow-hidden z-30">
                  <ul>
                    {liveMatches.map((dest) => (
                      <li key={dest.slug} className="border-b border-[#103B50]/10 last:border-b-0">
                        <Link
                          href={`/destinations/${dest.slug}`}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-[#FAF8F3] text-[#102530] transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#103B50]">{lt(dest.name)}</p>
                            <p className="text-xs text-[#51636D]">{lt(dest.commune)}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#087E9B] rtl:rotate-180" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#F4EFE5]/65 pt-2">
              {t('detail.illustrationNotice')}
            </p>
          </div>
        </div>
      </section>

      {/* 1B. MÉTÉO EN DIRECT DE BÉJAÏA */}
      <LiveWeatherWidget />

      {/* 2. LES DESTINATIONS INCONTOURNABLES */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#103B50]/10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55]">
                {t('home.featuredKicker')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50]">
                {t('home.featuredTitle')}
              </h2>
              <p className="text-base text-[#51636D] leading-relaxed">
                {t('home.featuredSubtitle')}
              </p>
            </div>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#087E9B] hover:text-[#103B50] transition-colors whitespace-nowrap shrink-0"
            >
              <span>{t('home.viewAllDestinations')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.map((dest) => (
              <DestinationCard key={dest.slug} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXPLORER PAR CATÉGORIE (8 THÉMATIQUES) */}
      <section className="py-16 lg:py-24 bg-[#F4EFE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-2 mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#356B50]">
              {t('home.categoriesKicker')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50]">
              {t('home.categoriesTitle')}
            </h2>
            <p className="text-base text-[#51636D] leading-relaxed">
              {t('home.categoriesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.28, delay: index * 0.03 }}
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group block h-full bg-white border border-[#103B50]/10 rounded-lg p-6 hover:border-[#087E9B]/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-medium text-[#51636D] tabular-nums">
                      0{index + 1}
                    </span>
                    <h3 className="font-serif text-xl font-semibold text-[#103B50] mt-2 mb-2 group-hover:text-[#087E9B] transition-colors">
                      {lt(cat.shortTitle)}
                    </h3>
                    <p className="text-sm text-[#51636D] leading-relaxed">
                      {lt(cat.description)}
                    </p>
                  </div>
                  <div className="pt-5 mt-5 border-t border-[#103B50]/10 inline-flex items-center gap-1.5 text-xs font-medium text-[#087E9B]">
                    <span>{t('categories.exploreCategory')}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BÉJAÏA EN IMAGES (GALERIE PLEIN ÉCRAN) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-2 mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#087E9B]">
              {t('home.galleryKicker')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50]">
              {t('home.galleryTitle')}
            </h2>
            <p className="text-base text-[#51636D] leading-relaxed">
              {t('home.gallerySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {GALLERY_ITEMS.map((item, idx) => {
              const spanClass =
                idx === 0
                  ? 'md:col-span-8 aspect-[16/10]'
                  : idx === 1
                  ? 'md:col-span-4 aspect-[4/3] md:aspect-auto'
                  : 'md:col-span-3 aspect-[4/3]';

              return (
                <button
                  key={`${item.src}-${idx}`}
                  type="button"
                  onClick={() => setLightboxIdx(idx)}
                  className={`group relative overflow-hidden rounded-lg bg-[#F4EFE5] text-start ${spanClass}`}
                >
                  <ResilientImage
                    src={item.src}
                    alt={lt(item.alt)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2533]/80 via-[#0A2533]/10 to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between gap-3 text-white">
                    <div>
                      <p className="font-serif text-base font-medium leading-snug">
                        {item.caption ? lt(item.caption) : lt(item.alt)}
                      </p>
                      <p className="text-[11px] text-[#F4EFE5]/75 mt-0.5">{item.source}</p>
                    </div>
                    <Maximize2 className="w-4 h-4 shrink-0 opacity-80 group-hover:opacity-100" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CIRCUITS RECOMMANDÉS */}
      <section className="py-16 lg:py-24 bg-[#FAF8F3] border-y border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#087E9B]">
                {t('home.circuitsKicker')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50]">
                {t('home.circuitsTitle')}
              </h2>
              <p className="text-base text-[#51636D] leading-relaxed">
                {t('home.circuitsSubtitle')}
              </p>
            </div>
            <Link
              href="/circuits"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#087E9B] hover:text-[#103B50] transition-colors whitespace-nowrap shrink-0"
            >
              <span>{t('home.viewAllCircuits')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {recommendedCircuits.map((circuit) => (
              <article
                key={circuit.id}
                className="bg-white border border-[#103B50]/10 rounded-lg overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-[#F4EFE5]">
                  <ResilientImage
                    src={circuit.coverImage.src}
                    alt={lt(circuit.coverImage.alt)}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs text-[#51636D] tabular-nums mb-2">
                    <span className="text-[#356B50] font-medium">
                      {circuit.destinationSlugs.length} {t('circuits.stops')}
                    </span>
                  </p>
                  <h3 className="font-serif text-xl font-semibold text-[#103B50] mb-2">
                    {lt(circuit.title)}
                  </h3>
                  <p className="text-sm text-[#51636D] leading-relaxed mb-5 flex-1">
                    {lt(circuit.description)}
                  </p>
                  <Link
                    href={`/circuits#${circuit.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#087E9B] hover:text-[#103B50] transition-colors pt-3 border-t border-[#103B50]/10"
                  >
                    <span>{t('circuits.viewCircuit')}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5B. BÉJAÏA À TRAVERS LES SIÈCLES */}
      <section className="py-16 lg:py-24 bg-[#103B50] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F4EFE5]/75 inline-flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C47B55]" />
                <span>{t('home.historyKicker')}</span>
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
                {t('home.historyTitle')}
              </h2>
              <p className="text-base text-[#F4EFE5]/80 leading-relaxed">
                {t('home.historySubtitle')}
              </p>
            </div>
            <Link
              href="/histoire"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#087E9B] hover:bg-[#066982] text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <span>{t('home.exploreHistory')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HISTORICAL_ERAS.map((era) => (
              <Link
                key={era.slug}
                href={`/histoire#${era.slug}`}
                className="group p-5 bg-white/5 hover:bg-white/10 border border-white/12 hover:border-[#C47B55]/60 rounded-lg transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#C47B55] font-medium tabular-nums">
                    <span>{era.order}</span>
                    <span>{lt(era.dateRange)}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white group-hover:text-[#F4EFE5] leading-snug">
                    {lt(era.title)}
                  </h3>
                  <p className="text-xs text-[#F4EFE5]/75 leading-relaxed line-clamp-3">
                    {lt(era.subtitle)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F4EFE5]/90 group-hover:text-white pt-3 border-t border-white/10">
                  <span>{t('destinations.discover')}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CULTURE ET TRADITIONS */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-5 relative min-h-[340px] rounded-lg overflow-hidden bg-[#F4EFE5]">
              <ResilientImage
                src="/images/kabyle-craft.jpg"
                alt={t('home.cultureTitle')}
                fill
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55]">
                  {t('home.cultureKicker')}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50]">
                  {t('home.cultureTitle')}
                </h2>
                <p className="text-base text-[#51636D] leading-relaxed">
                  {t('home.cultureSubtitle')}
                </p>
              </div>

              <div className="divide-y divide-[#103B50]/10 border-y border-[#103B50]/10">
                {cultureHighlights.map((article) => (
                  <div key={article.id} className="py-4">
                    <p className="text-xs font-medium text-[#087E9B]">{lt(article.theme)}</p>
                    <h3 className="font-serif text-lg font-semibold text-[#103B50] mt-0.5">
                      {lt(article.title)}
                    </h3>
                    <p className="text-sm text-[#51636D] mt-1 leading-relaxed">
                      {lt(article.excerpt)}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <Link
                  href="/culture"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#103B50] hover:bg-[#087E9B] text-white text-sm font-medium rounded-md transition-colors"
                >
                  <span>{t('home.exploreCulture')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION FINAL */}
      <section className="py-16 lg:py-20 bg-[#103B50] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-base sm:text-lg text-[#F4EFE5]/85 max-w-2xl mx-auto leading-relaxed">
            {t('home.ctaSubtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/carte"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#087E9B] hover:bg-[#066982] text-white text-sm font-medium rounded-md transition-colors"
            >
              <MapIcon className="w-4 h-4" />
              <span>{t('home.ctaMap')}</span>
            </Link>
            <Link
              href="/guide-pratique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#103B50] hover:bg-[#F4EFE5] text-sm font-medium rounded-md transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('home.ctaGuide')}</span>
            </Link>
          </div>
        </div>
      </section>

      <LightboxModal
        images={GALLERY_ITEMS}
        activeIndex={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onChangeIndex={setLightboxIdx}
      />
    </div>
  );
}
