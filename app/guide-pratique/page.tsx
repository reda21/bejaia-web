import type { Metadata } from 'next';
import { GuidePratiqueClient } from '@/components/guide/GuidePratiqueClient';

export const metadata: Metadata = {
  title: 'Guide pratique pour visiter Béjaïa',
  description:
    'Préparez votre séjour à Béjaïa : accès (aéroport, route, train, port), régions touristiques, conseils de sécurité en montagne et sur le littoral, et recherche d’hébergements vérifiés.',
};

export default function GuidePratiquePage() {
  return <GuidePratiqueClient />;
}
