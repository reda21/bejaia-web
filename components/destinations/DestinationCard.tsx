'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Plus, Check } from 'lucide-react';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { useApp } from '@/components/providers/AppProviders';
import { CATEGORY_MAP } from '@/data/categories';
import type { Destination } from '@/types';

export function DestinationCard({ destination }: { destination: Destination }) {
  const {
    t,
    lt,
    isFavorite,
    toggleFavorite,
    isVisited,
    customCircuitSlugs,
    toggleCustomCircuitSlug,
  } = useApp();
  const favored = isFavorite(destination.slug);
  const visited = isVisited(destination.slug);
  const inItinerary = customCircuitSlugs.includes(destination.slug);
  const category = CATEGORY_MAP[destination.category];

  return (
    <article className="group flex flex-col bg-white border border-[#103B50]/10 rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F4EFE5]">
        <Link href={`/destinations/${destination.slug}`} className="block w-full h-full">
          <ResilientImage
            src={destination.coverImage.src}
            alt={lt(destination.coverImage.alt)}
            fill
            fallbackTitle={lt(destination.name)}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(destination.slug)}
          aria-label={favored ? t('destinations.removeFavorite') : t('destinations.addFavorite')}
          aria-pressed={favored}
          className={`absolute top-3 end-3 w-10 h-10 rounded-md flex items-center justify-center backdrop-blur-sm transition-colors ${
            favored
              ? 'bg-[#C47B55] text-white'
              : 'bg-white/90 text-[#103B50] hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${favored ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Zero-pill clean unboxed metadata */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#51636D] mb-2">
          <span className="font-medium text-[#087E9B]">{lt(category.shortTitle)}</span>
          <span aria-hidden="true">·</span>
          <span>{lt(destination.commune)}</span>
          {visited && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#356B50]">{t('destinations.visitedBadge')}</span>
            </>
          )}
        </div>

        <h3 className="font-serif text-xl font-semibold text-[#103B50] leading-snug mb-2 group-hover:text-[#087E9B] transition-colors">
          <Link href={`/destinations/${destination.slug}`}>{lt(destination.name)}</Link>
        </h3>

        <p className="text-sm text-[#51636D] leading-relaxed line-clamp-3 mb-5 flex-1">
          {lt(destination.shortDescription)}
        </p>

        <div className="pt-3 border-t border-[#103B50]/10 flex items-center justify-between gap-2">
          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#103B50] hover:text-[#087E9B] transition-colors"
          >
            <span>{t('destinations.discover')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => toggleCustomCircuitSlug(destination.slug)}
            aria-pressed={inItinerary}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              inItinerary
                ? 'bg-[#103B50] border-[#103B50] text-white'
                : 'bg-[#FAF8F3] border-[#103B50]/12 text-[#103B50] hover:bg-[#F4EFE5]'
            }`}
          >
            {inItinerary ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-[#087E9B]" />}
            <span>{inItinerary ? t('itinerary.addedCardBtn') : t('itinerary.addCardBtn')}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
