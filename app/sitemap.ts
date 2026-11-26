import type { MetadataRoute } from 'next';
import { DESTINATIONS } from '@/data/destinations';
import { CATEGORIES } from '@/data/categories';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const rawUrl = process.env.APP_URL?.startsWith('http')
    ? process.env.APP_URL
    : 'https://bejaia-explorer.dz';
  const baseUrl = rawUrl.replace(/\/+$/, '');
  const lastModified = new Date();

  const staticRoutes = [
    '',
    '/destinations',
    '/categories',
    '/histoire',
    '/circuits',
    '/carte',
    '/culture',
    '/guide-pratique',
    '/a-propos',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.85,
  }));

  const categoryRoutes = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const destinationRoutes = DESTINATIONS.map((dest) => ({
    url: `${baseUrl}/destinations/${dest.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...destinationRoutes];
}
