'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { CATEGORIES } from '@/data/categories';
import { getDestinationsByCategory } from '@/data/destinations';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import type { CategoryDefinition } from '@/types';

export function CategoriesIndexClient() {
  const { t, lt } = useApp();

  return (
    <div className="bg-white">
      <section className="bg-[#F4EFE5] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Breadcrumbs items={[{ label: t('nav.categories') }]} />
          <div className="max-w-3xl space-y-3 pt-2">
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50]">
              {t('categories.pageTitle')}
            </h1>
            <p className="text-base text-[#51636D] leading-relaxed">
              {t('categories.pageSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map((cat, idx) => {
            const count = getDestinationsByCategory(cat.slug).length;
            return (
              <article
                key={cat.slug}
                className="group bg-white border border-[#103B50]/12 rounded-lg overflow-hidden flex flex-col sm:flex-row"
              >
                <div className="relative sm:w-48 aspect-[4/3] sm:aspect-auto shrink-0 bg-[#F4EFE5]">
                  <ResilientImage
                    src={cat.coverImage.src}
                    alt={lt(cat.coverImage.alt)}
                    fill
                    priority={idx < 2}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#51636D] tabular-nums mb-2">
                      <span>0{idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#087E9B] font-medium">
                        {count} {t('nav.destinations').toLowerCase()}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl font-semibold text-[#103B50] group-hover:text-[#087E9B] transition-colors">
                      <Link href={`/categories/${cat.slug}`}>{lt(cat.title)}</Link>
                    </h2>
                    <p className="text-sm text-[#51636D] leading-relaxed mt-2">
                      {lt(cat.description)}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#103B50]/10">
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#087E9B] hover:text-[#103B50]"
                    >
                      <span>{t('categories.exploreCategory')}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function CategoryDetailClient({ category }: { category: CategoryDefinition }) {
  const { t, lt } = useApp();
  const destinations = getDestinationsByCategory(category.slug);

  return (
    <div className="bg-white">
      <section className="bg-[#FAF8F3] border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Breadcrumbs
            items={[
              { label: t('nav.categories'), href: '/categories' },
              { label: lt(category.shortTitle) },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#087E9B]">
                {t('nav.categories')} · Wilaya de Béjaïa
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#103B50]">
                {lt(category.title)}
              </h1>
              <p className="text-base text-[#51636D] leading-relaxed">
                {lt(category.editorialIntro)}
              </p>
              <ul className="pt-2 space-y-2 text-sm text-[#103B50]">
                {category.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#C47B55] font-bold">·</span>
                    <span>{lt(hl)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F4EFE5] border border-[#103B50]/10">
                <ResilientImage
                  src={category.coverImage.src}
                  alt={lt(category.coverImage.alt)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
              <p className="text-[11px] text-[#51636D] mt-2">{category.coverImage.attribution}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#103B50]/10">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
            {t('categories.destinationsInCategory')} ({destinations.length})
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-[#087E9B] hover:text-[#103B50]"
          >
            {t('categories.pageTitle')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {destinations.map((dest) => (
            <DestinationCard key={dest.slug} destination={dest} />
          ))}
        </div>
      </section>
    </div>
  );
}
