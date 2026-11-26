import type { Metadata } from 'next';
import { InteractiveMapPageClient } from '@/components/map/InteractiveMapPageClient';

export const metadata: Metadata = {
  title: 'Carte interactive de la Wilaya de Béjaïa',
  description:
    'Explorez la carte vectorielle interactive de Béjaïa avec OpenFreeMap et MapLibre : marqueurs par catégorie et époque historique, géocodage OpenStreetMap et recherche de services à proximité.',
};

export default function MapPage() {
  return <InteractiveMapPageClient />;
}
