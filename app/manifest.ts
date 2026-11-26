import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Béjaïa Explorer – اكتشف بجاية',
    short_name: 'Béjaïa Guide',
    description:
      'Portail touristique et encyclopédie historique de la Wilaya de Béjaïa : patrimoine, plages, montagnes, circuits et carte interactive.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FAF8F3',
    theme_color: '#103B50',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
