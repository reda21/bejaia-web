import type { Metadata } from 'next';
import { HomeClient } from '@/components/home/HomeClient';

export const metadata: Metadata = {
  title: 'Béjaïa Explorer – اكتشف بجاية | Entre mer, montagne et histoire',
  description:
    'Portail touristique professionnel de la Wilaya de Béjaïa en Algérie : Cap Carbon, Parc national de Gouraya, grottes d’Aokas, plages, circuits, carte interactive et culture kabyle.',
};

export default function HomePage() {
  return <HomeClient />;
}
