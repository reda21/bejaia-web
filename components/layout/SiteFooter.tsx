'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';

export function SiteFooter() {
  const { t } = useApp();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <footer className="no-print bg-[#103B50] text-[#F4EFE5] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-3">
              <Link href="/" className="font-serif text-2xl font-semibold text-white block">
                Béjaïa Explorer
              </Link>
              <p className="text-sm text-[#F4EFE5]/75 leading-relaxed">
                {t('common.footerProject')}
              </p>
              <p className="text-xs text-[#F4EFE5]/60">
                اكتشف بجاية · ⴱⴳⴰⵢⴻⵜ · Wilaya de Béjaïa, Algérie
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C47B55] mb-4">
                {t('common.footerNavigation')}
              </h3>
              <ul className="space-y-2.5 text-sm text-[#F4EFE5]/85">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link href="/destinations" className="hover:text-white transition-colors">
                    {t('nav.destinations')}
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors">
                    {t('nav.categories')}
                  </Link>
                </li>
                <li>
                  <Link href="/circuits" className="hover:text-white transition-colors">
                    {t('nav.circuits')}
                  </Link>
                </li>
                <li>
                  <Link href="/carte" className="hover:text-white transition-colors">
                    {t('nav.map')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C47B55] mb-4">
                {t('common.footerDiscover')}
              </h3>
              <ul className="space-y-2.5 text-sm text-[#F4EFE5]/85">
                <li>
                  <Link href="/histoire" className="hover:text-white transition-colors">
                    {t('nav.history')}
                  </Link>
                </li>
                <li>
                  <Link href="/culture" className="hover:text-white transition-colors">
                    {t('nav.culture')}
                  </Link>
                </li>
                <li>
                  <Link href="/guide-pratique" className="hover:text-white transition-colors">
                    {t('nav.guide')}
                  </Link>
                </li>
                <li>
                  <Link href="/a-propos" className="hover:text-white transition-colors">
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    {t('nav.contact')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C47B55] mb-4">
                {t('common.footerSources')}
              </h3>
              <ul className="space-y-2.5 text-sm text-[#F4EFE5]/85">
                <li>
                  <a
                    href="https://www.dta-bejaia.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <span>DTA Béjaïa</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://visitalgeria.dz/wp-content/uploads/2024/06/guide-fr.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <span>Guide officiel VisitAlgeria (PDF)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://openfreemap.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors text-xs text-[#F4EFE5]/70"
                  >
                    <span>OpenFreeMap · MapLibre GL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors text-xs text-[#F4EFE5]/70"
                  >
                    <span>Données © OpenStreetMap</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F4EFE5]/65">
            <p>{t('common.footerRights')}</p>
            <p>
              Cartographie vectorielle propulsée par OpenFreeMap &amp; MapLibre GL · Données © OpenStreetMap
            </p>
          </div>
        </div>
      </footer>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('common.backToTop')}
          className="no-print fixed bottom-6 end-6 z-40 w-11 h-11 rounded-md bg-[#103B50] hover:bg-[#087E9B] text-white shadow-lg flex items-center justify-center transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
