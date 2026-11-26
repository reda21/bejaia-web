import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Noto_Sans_Arabic } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { DynamicBreadcrumbs } from '@/components/layout/DynamicBreadcrumbs';
import { LocaleFadeMain } from '@/components/layout/LocaleFadeMain';
import { SiteFooter } from '@/components/layout/SiteFooter';
import './globals.css';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: '#103B50',
  width: 'device-width',
  initialScale: 1,
};

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-arabic',
  display: 'swap',
});

const APP_URL = process.env.APP_URL || 'https://bejaia-explorer.dz';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL.startsWith('http') ? APP_URL : 'https://bejaia-explorer.dz'),
  title: {
    default: 'Béjaïa Explorer – اكتشف بجاية | Tourisme, Plages & Patrimoine',
    template: '%s | Béjaïa Explorer – اكتشف بجاية',
  },
  description:
    'Découvrez la Wilaya de Béjaïa en Algérie : Cap Carbon, Parc national de Gouraya, grottes d’Aokas, plages de Tichy et Boulimat, patrimoine hammadite et villages kabyles.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Béjaïa Guide',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  keywords: [
    'Tourisme Béjaïa',
    'Que visiter à Béjaïa',
    'Plages de Béjaïa',
    'Cap Carbon',
    'Parc national de Gouraya',
    'Grottes d’Aokas',
    'Villages kabyles',
    'Découvrir la Kabylie',
    'Histoire de Béjaïa',
    'En-Naciria',
    'اكتشف بجاية',
    'السياحة في بجاية',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Béjaïa Explorer – اكتشف بجاية',
    title: 'Béjaïa Explorer – اكتشف بجاية | Entre mer, montagne et histoire',
    description:
      'Explorez les destinations incontournables, l’encyclopédie historique, les circuits thématiques, la carte interactive et le patrimoine culturel de la Wilaya de Béjaïa.',
    images: [
      {
        url: '/images/hero-cap-carbon.jpg',
        width: 1408,
        height: 768,
        alt: 'Béjaïa Explorer — Cap Carbon et baie de Béjaïa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Béjaïa Explorer – اكتشف بجاية',
    description:
      'Portail touristique et encyclopédie culturelle de la Wilaya de Béjaïa : nature, plages, montagnes, histoire et carte interactive.',
    images: ['/images/hero-cap-carbon.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Wilaya de Béjaïa — Béjaïa Explorer',
    alternateName: ['اكتشف بجاية', 'Bgayet'],
    description:
      'Destination touristique méditerranéenne d’Algérie entre mer, montagnes du Gouraya et de l’Akfadou, patrimoine hammadite et culture kabyle.',
    url: APP_URL,
    touristType: ['Tourisme balnéaire', 'Tourisme de montagne', 'Tourisme naturel', 'Tourisme culturel', 'Tourisme historique', 'Tourisme thermal'],
    containedInPlace: {
      '@type': 'Country',
      name: 'Algérie',
    },
  };

  const themeInitScript = `(function(){try{var t=localStorage.getItem('bejaia_explorer_theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${playfair.variable} ${jakarta.variable} ${notoArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-(--surface-page) text-(--ink-primary) antialiased selection:bg-[#087E9B]/20 selection:text-[#103B50] dark:selection:bg-[#38B2CE]/30 dark:selection:text-[#F4EFE5]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppProviders>
          <SiteHeader />
          <DynamicBreadcrumbs />
          <LocaleFadeMain>{children}</LocaleFadeMain>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
