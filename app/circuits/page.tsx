import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CircuitsClient } from '@/components/circuits/CircuitsClient';

export const metadata: Metadata = {
  title: 'Circuits touristiques de Béjaïa',
  description:
    'Découvrez nos circuits thématiques à Béjaïa (historique, Parc de Gouraya, côte Est, montagnes, villages kabyles, vallée de la Soummam) ou créez votre circuit personnalisé.',
};

export default function CircuitsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F3]" />}>
      <CircuitsClient />
    </Suspense>
  );
}
