import type { Metadata } from 'next';
import { CategoriesIndexClient } from '@/components/categories/CategoriesClient';

export const metadata: Metadata = {
  title: 'Catégories touristiques de Béjaïa',
  description:
    'Explorez Béjaïa par thématique : tourisme balnéaire, montagne, nature et forêts, grottes, patrimoine historique, villages kabyles, thermalisme et aventure.',
};

export default function CategoriesPage() {
  return <CategoriesIndexClient />;
}
