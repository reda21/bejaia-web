import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { DestinationsDirectoryClient } from '@/components/destinations/DestinationsDirectoryClient';

export const metadata: Metadata = {
  title: 'Destinations à visiter à Béjaïa',
  description:
    'Annuaire complet des destinations touristiques de la Wilaya de Béjaïa : Cap Carbon, Parc national de Gouraya, grottes d’Aokas, plages de Tichy et Boulimat, Casbah et villages kabyles.',
};

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-sm text-[#51636D]">
          Chargement de l’annuaire...
        </div>
      }
    >
      <DestinationsDirectoryClient />
    </Suspense>
  );
}
