'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { getDestinationBySlug } from '@/data/destinations';
import { CATEGORY_MAP } from '@/data/categories';
import type { CategorySlug } from '@/types';

interface Crumb {
  label: string;
  href?: string;
}

const CANONICAL_BASE = 'https://bejaia-explorer.dz';

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const { t, lt } = useApp();

  const crumbs = useMemo<Crumb[]>(() => {
    if (!pathname || pathname === '/') return [];

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [];

    const [first, second] = segments;

    if (first === 'destinations') {
      if (!second) {
        return [{ label: t('nav.destinations') }];
      }
      const dest = getDestinationBySlug(second);
      if (dest) {
        const cat = CATEGORY_MAP[dest.category];
        return [
          { label: t('nav.destinations'), href: '/destinations' },
          { label: lt(cat.shortTitle), href: `/categories/${cat.slug}` },
          { label: lt(dest.name) },
        ];
      }
      return [
        { label: t('nav.destinations'), href: '/destinations' },
        { label: decodeURIComponent(second) },
      ];
    }

    if (first === 'categories') {
      if (!second) {
        return [{ label: t('nav.categories') }];
      }
      const cat = CATEGORY_MAP[second as CategorySlug];
      return [
        { label: t('nav.categories'), href: '/categories' },
        { label: cat ? lt(cat.title) : decodeURIComponent(second) },
      ];
    }

    const staticLabels: Record<string, string> = {
      histoire: t('nav.history'),
      culture: t('nav.culture'),
      circuits: t('nav.circuits'),
      carte: t('nav.map'),
      'guide-pratique': t('nav.guide'),
      'a-propos': t('nav.about'),
      contact: t('nav.contact'),
      todo: 'Démo Todo List',
    };

    const topLabel = staticLabels[first] ?? decodeURIComponent(first);
    if (!second) {
      return [{ label: topLabel }];
    }

    return [
      { label: topLabel, href: `/${first}` },
      { label: decodeURIComponent(second) },
    ];
  }, [pathname, t, lt]);

  if (crumbs.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('common.breadcrumbHome'),
        item: `${CANONICAL_BASE}/`,
      },
      ...crumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: crumb.label,
        item: crumb.href
          ? `${CANONICAL_BASE}${crumb.href}`
          : `${CANONICAL_BASE}${pathname}`,
      })),
    ],
  };

  return (
    <div className="breadcrumbs-bar no-print bg-[#FAF8F3] border-b border-[#103B50]/10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Fil d'Ariane" className="py-2.5 text-xs text-[#51636D]">
          <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-[#087E9B] transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-[#087E9B]" />
                <span>{t('common.breadcrumbHome')}</span>
              </Link>
            </li>
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <li
                  key={`${crumb.label}-${idx}`}
                  className="inline-flex items-center gap-1.5 sm:gap-2 min-w-0"
                >
                  <ChevronRight
                    className="w-3.5 h-3.5 text-[#51636D]/50 shrink-0 rtl:rotate-180"
                    aria-hidden="true"
                  />
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-[#087E9B] transition-colors truncate max-w-[180px] sm:max-w-none"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className="text-[#103B50] font-medium truncate max-w-[220px] sm:max-w-none"
                      aria-current="page"
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
