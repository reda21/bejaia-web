import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { HistoryEncyclopediaClient } from '@/components/history/HistoryEncyclopediaClient';

export const metadata: Metadata = {
  title: 'Béjaïa à travers les siècles — Encyclopédie historique & patrimoine',
  description:
    'Explorez l’histoire millénaire de Béjaïa : Saldae antique, capitale hammadide En-Naciria, Fibonacci et Ibn Khaldoun, fortifications côtières, glossaire trilingue et écologie du Gouraya et de l’Akfadou.',
};

export default function HistoirePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Béjaïa à travers les siècles — Encyclopédie historique',
    about: [
      'Saldae (Béjaïa antique)',
      'En-Naciria (Capitale hammadide)',
      'Leonardo Fibonacci à Béjaïa',
      'Ibn Khaldoun à Béjaïa',
      'Parc national de Gouraya',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-[50vh] bg-[#FAF8F3]" />}>
        <HistoryEncyclopediaClient />
      </Suspense>
    </>
  );
}
