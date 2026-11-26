import type { Metadata } from 'next';
import { AboutClient } from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: 'À propos de Béjaïa Explorer',
  description:
    'Découvrez la mission, la charte de fiabilité éditoriale, les sources officielles et l’architecture évolutive du portail touristique Béjaïa Explorer – اكتشف بجاية.',
};

export default function AboutPage() {
  return <AboutClient />;
}
