import type { Metadata } from 'next';
import { CultureClient } from '@/components/culture/CultureClient';

export const metadata: Metadata = {
  title: 'Culture, traditions kabyles et histoire de Béjaïa',
  description:
    'Découvrez la culture kabyle, la langue amazighe, la bijouterie, la poterie, le tissage, la gastronomie locale, la musique et l’histoire millénaire de Béjaïa (Saldae et En-Naciria).',
};

export default function CulturePage() {
  return <CultureClient />;
}
