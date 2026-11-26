import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DESTINATIONS, getDestinationBySlug } from '@/data/destinations';
import { DestinationDetailClient } from '@/components/destinations/DestinationDetailClient';

export function generateStaticParams() {
  return DESTINATIONS.map((dest) => ({ slug: dest.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) {
    return { title: 'Destination introuvable' };
  }
  return {
    title: `${destination.name.fr} (${destination.commune.fr}) — Visiter Béjaïa`,
    description: destination.shortDescription.fr,
    openGraph: {
      title: `${destination.name.fr} | Béjaïa Explorer`,
      description: destination.shortDescription.fr,
      images: [{ url: destination.coverImage.src, alt: destination.coverImage.alt.fr }],
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristAttraction',
        name: destination.name.fr,
        alternateName: destination.name.ar,
        description: destination.overview.fr,
        address: {
          '@type': 'PostalAddress',
          addressLocality: destination.commune.fr,
          addressRegion: 'Wilaya de Béjaïa',
          addressCountry: 'DZ',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Destinations', item: '/destinations' },
          {
            '@type': 'ListItem',
            position: 3,
            name: destination.name.fr,
            item: `/destinations/${destination.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationDetailClient destination={destination} />
    </>
  );
}
