'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Menu,
  X,
  Trash2,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Download,
  Upload,
  NotebookPen,
  Route,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { DESTINATIONS, getDestinationBySlug } from '@/data/destinations';
import { GlobalSearchModal } from '@/components/ui/GlobalSearchModal';
import { ItineraryModal } from '@/components/circuits/ItineraryModal';
import { PWAInstallButton, OfflinePackButton } from '@/components/pwa/PWAControls';
import type { Locale, ThemePreference } from '@/types';

const LOCALES: { code: Locale; label: string; title: string }[] = [
  { code: 'fr', label: 'FR', title: 'Français' },
  { code: 'ar', label: 'AR', title: 'العربية (RTL)' },
  { code: 'kab', label: 'KAB', title: 'Taqvaylit / Tamazight' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const {
    locale,
    setLocale,
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    t,
    lt,
    favorites,
    toggleFavorite,
    visitedSlugs,
    toggleVisited,
    notes,
    deleteDestinationNote,
    favoritesOpen,
    setFavoritesOpen,
    setSearchOpen,
    setItineraryOpen,
    customCircuitSlugs,
    exportJournalBundle,
    importJournalBundle,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'favorites' | 'visited' | 'notes'>('favorites');
  const [importFeedback, setImportFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/destinations', label: t('nav.destinations') },
    { href: '/categories', label: t('nav.categories') },
    { href: '/histoire', label: t('nav.history') },
    { href: '/culture', label: t('nav.culture') },
    { href: '/circuits', label: t('nav.circuits') },
    { href: '/carte', label: t('nav.map') },
    { href: '/guide-pratique', label: t('nav.guide') },
  ];

  const favoriteDestinations = DESTINATIONS.filter(
    (d) => favorites.includes(d.id) || favorites.includes(d.slug)
  );
  const visitedDestinations = DESTINATIONS.filter((d) => visitedSlugs.includes(d.slug));
  const notedEntries = Object.entries(notes)
    .map(([slug, entry]) => ({ dest: getDestinationBySlug(slug), slug, entry }))
    .filter((item) => Boolean(item.dest));

  const progressPct = Math.round((visitedDestinations.length / DESTINATIONS.length) * 100);

  const handleExport = () => {
    const bundle = exportJournalBundle();
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bejaia-explorer-carnet-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = importJournalBundle(text);
    setImportFeedback({
      ok: res.ok,
      msg: res.ok ? t('journal.importSuccess') : res.error || t('journal.importError'),
    });
    e.target.value = '';
    setTimeout(() => setImportFeedback(null), 4000);
  };

  return (
    <>
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#103B50]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            href="/"
            className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#103B50] hover:text-[#087E9B] transition-colors whitespace-nowrap shrink-0"
          >
            {t('brand.name')}
          </Link>

          {/* Zone 2: Primary Navigation */}
          <nav
            aria-label="Navigation principale"
            className="hidden xl:flex items-center gap-4 text-[13px] font-medium text-[#103B50]/85"
          >
            {navItems.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[#087E9B] text-[#103B50]'
                      : 'border-transparent hover:text-[#087E9B] hover:border-[#087E9B]/40'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Global Search + Language + PWA Install + Explorer Journal + Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t('nav.search')}
              title={`${t('nav.search')} (Ctrl+K)`}
              className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-md border border-[#103B50]/12 bg-[#FAF8F3] hover:bg-[#F4EFE5] text-xs font-medium text-[#103B50] transition-colors shrink-0"
            >
              <Search className="w-3.5 h-3.5 text-[#087E9B]" />
              <span className="hidden sm:inline">{t('nav.search')}</span>
            </button>

            <div className="hidden md:block">
              <PWAInstallButton compact />
            </div>

            {(() => {
              const currentIndex = LOCALES.findIndex((loc) => loc.code === locale);
              const safeIndex = currentIndex === -1 ? 0 : currentIndex;
              const currentLoc = LOCALES[safeIndex];
              const nextLoc = LOCALES[(safeIndex + 1) % LOCALES.length];
              return (
                <button
                  type="button"
                  onClick={() => setLocale(nextLoc.code)}
                  lang={currentLoc.code}
                  title={`Langue active : ${currentLoc.title} — Cliquer pour passer à : ${nextLoc.title}`}
                  aria-label={`Langue active : ${currentLoc.title} — Prochaine langue : ${nextLoc.title}`}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#103B50]/15 bg-[#FAF8F3] hover:bg-[#103B50] hover:text-white hover:border-[#103B50] text-[#103B50] dark:border-[#E6F0F5]/20 dark:bg-[#132633] dark:text-[#EDF3F7] dark:hover:bg-[#3AB8D6] dark:hover:text-[#0B1720] dark:hover:border-[#3AB8D6] text-[11px] font-bold tracking-tight uppercase transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087E9B] dark:focus-visible:ring-[#3AB8D6]"
                >
                  {currentLoc.label}
                </button>
              );
            })()}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                resolvedTheme === 'dark' ? t('theme.toggleToLight') : t('theme.toggleToDark')
              }
              aria-pressed={resolvedTheme === 'dark'}
              title={
                resolvedTheme === 'dark' ? t('theme.toggleToLight') : t('theme.toggleToDark')
              }
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#103B50]/12 bg-[#FAF8F3] hover:bg-[#F4EFE5] text-[#103B50] transition-colors shrink-0"
            >
              <Moon className="w-4 h-4 text-[#087E9B] dark:hidden" />
              <Sun className="w-4 h-4 hidden dark:block text-[#E29A74]" />
            </button>

            <button
              type="button"
              onClick={() => setItineraryOpen(true)}
              aria-label={t('itinerary.buttonLabel')}
              title={t('itinerary.buttonLabel')}
              className="relative inline-flex items-center gap-1.5 px-2.5 h-9 rounded-md border border-[#103B50]/12 bg-[#FAF8F3] hover:bg-[#F4EFE5] text-xs font-medium text-[#103B50] transition-colors shrink-0"
            >
              <Route className="w-4 h-4 text-[#087E9B]" />
              <span className="hidden lg:inline">{t('itinerary.buttonLabel')}</span>
              {customCircuitSlugs.length > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#087E9B] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {customCircuitSlugs.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setFavoritesOpen(true)}
              aria-label={t('nav.favorites')}
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-md text-[#103B50] hover:bg-[#F4EFE5] transition-colors shrink-0"
            >
              <Heart className="w-5 h-5" />
              {favorites.length + visitedSlugs.length > 0 && (
                <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C47B55] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={t('nav.menu')}
              aria-expanded={mobileMenuOpen}
              className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-[#103B50] hover:bg-[#F4EFE5] transition-colors shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Honest Kabyle Linguistic Validation Notice */}
        {locale === 'kab' && (
          <div className="bg-[#F4EFE5] border-t border-[#103B50]/10 px-4 py-2 text-xs text-[#103B50] text-center">
            {t('common.kabyleNotice')}
          </div>
        )}

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-[#103B50]/10 px-4 py-4 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#F4EFE5] text-[#103B50]'
                      : 'text-[#103B50]/80 hover:bg-[#FAF8F3]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-[#103B50]/10 space-y-3 px-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#51636D]">{t('theme.label')}</span>
                <div
                  role="group"
                  aria-label={t('theme.label')}
                  className="inline-flex items-center bg-[#F4EFE5] p-0.5 rounded-md"
                >
                  {(
                    [
                      { key: 'system', label: t('theme.system'), Icon: Monitor },
                      { key: 'light', label: t('theme.light'), Icon: Sun },
                      { key: 'dark', label: t('theme.dark'), Icon: Moon },
                    ] as { key: ThemePreference; label: string; Icon: typeof Sun }[]
                  ).map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTheme(key)}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                        theme === key
                          ? 'bg-[#103B50] text-white'
                          : 'text-[#103B50]/75 hover:text-[#103B50]'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Link
                    href="/a-propos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#51636D] hover:text-[#087E9B]"
                  >
                    {t('nav.about')}
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#51636D] hover:text-[#087E9B]"
                  >
                    {t('nav.contact')}
                  </Link>
                </div>
                <PWAInstallButton compact />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Enriched Explorer Journal Slide-over Drawer */}
      {favoritesOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('journal.drawerTitle')}
          className="no-print fixed inset-0 z-50 bg-[#103B50]/45 backdrop-blur-[2px] flex justify-end"
          onClick={() => setFavoritesOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-[#103B50]/10 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#103B50]">
                  {t('journal.drawerTitle')}
                </h2>
                <p className="text-xs text-[#51636D] mt-0.5 tabular-nums">
                  {t('journal.progressLabel')} : {visitedDestinations.length}/{DESTINATIONS.length}{' '}
                  {t('journal.visitedUnit')} ({progressPct}%)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFavoritesOpen(false)}
                aria-label={t('common.close')}
                className="p-2 text-[#51636D] hover:text-[#103B50] rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Discovery Progress Bar */}
            <div className="px-6 py-2.5 bg-[#FAF8F3] border-b border-[#103B50]/10 space-y-2">
              <div className="w-full h-1.5 bg-[#103B50]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#356B50] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="flex items-center gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => setDrawerTab('favorites')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    drawerTab === 'favorites'
                      ? 'bg-[#103B50] text-white'
                      : 'text-[#51636D] hover:text-[#103B50]'
                  }`}
                >
                  {t('journal.tabFavorites')} ({favoriteDestinations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('visited')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    drawerTab === 'visited'
                      ? 'bg-[#356B50] text-white'
                      : 'text-[#51636D] hover:text-[#103B50]'
                  }`}
                >
                  {t('journal.tabVisited')} ({visitedDestinations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('notes')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    drawerTab === 'notes'
                      ? 'bg-[#C47B55] text-white'
                      : 'text-[#51636D] hover:text-[#103B50]'
                  }`}
                >
                  {t('journal.tabNotes')} ({notedEntries.length})
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {drawerTab === 'favorites' &&
                (favoriteDestinations.length === 0 ? (
                  <p className="text-sm text-[#51636D] leading-relaxed">
                    {t('common.favoritesEmpty')}
                  </p>
                ) : (
                  favoriteDestinations.map((dest) => (
                    <div
                      key={dest.slug}
                      className="flex items-start justify-between gap-4 pb-4 border-b border-[#103B50]/10"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/destinations/${dest.slug}`}
                          onClick={() => setFavoritesOpen(false)}
                          className="font-serif text-base font-semibold text-[#103B50] hover:text-[#087E9B] inline-flex items-center gap-1"
                        >
                          <span>{lt(dest.name)}</span>
                          <ArrowUpRight className="w-4 h-4 shrink-0" />
                        </Link>
                        <p className="text-xs text-[#51636D] mt-0.5">{lt(dest.commune)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(dest.slug)}
                        aria-label={t('destinations.removeFavorite')}
                        className="p-2 text-[#51636D] hover:text-[#C47B55] transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ))}

              {drawerTab === 'visited' &&
                (visitedDestinations.length === 0 ? (
                  <p className="text-sm text-[#51636D] leading-relaxed">
                    Cochez « Marquer comme visité » sur les fiches de destinations pour suivre votre découverte de la Wilaya.
                  </p>
                ) : (
                  visitedDestinations.map((dest) => (
                    <div
                      key={dest.slug}
                      className="flex items-start justify-between gap-4 pb-4 border-b border-[#103B50]/10"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/destinations/${dest.slug}`}
                          onClick={() => setFavoritesOpen(false)}
                          className="font-serif text-base font-semibold text-[#103B50] hover:text-[#087E9B] inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#356B50] shrink-0" />
                          <span>{lt(dest.name)}</span>
                        </Link>
                        <p className="text-xs text-[#51636D] mt-0.5">{lt(dest.commune)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleVisited(dest.slug)}
                        aria-label={t('destinations.markVisited')}
                        className="p-2 text-[#51636D] hover:text-[#C47B55] transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ))}

              {drawerTab === 'notes' &&
                (notedEntries.length === 0 ? (
                  <p className="text-sm text-[#51636D] leading-relaxed">
                    Ajoutez vos notes personnelles de terrain directement sur la fiche d’une destination.
                  </p>
                ) : (
                  notedEntries.map(({ dest, slug, entry }) => (
                    <div
                      key={slug}
                      className="p-3.5 bg-[#FAF8F3] border border-[#103B50]/10 rounded-md space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/destinations/${slug}`}
                          onClick={() => setFavoritesOpen(false)}
                          className="font-serif text-sm font-semibold text-[#103B50] hover:text-[#087E9B] inline-flex items-center gap-1"
                        >
                          <NotebookPen className="w-3.5 h-3.5 text-[#C47B55] shrink-0" />
                          <span>{dest ? lt(dest.name) : slug}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteDestinationNote(slug)}
                          aria-label="Supprimer la note"
                          className="text-[#51636D] hover:text-[#C47B55]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#102530]/85 leading-relaxed whitespace-pre-line">
                        {entry.note}
                      </p>
                    </div>
                  ))
                ))}
            </div>

            {/* Portable JSON Backup & Custom Circuit Link */}
            <div className="p-5 border-t border-[#103B50]/10 bg-[#FAF8F3] space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F4EFE5] text-[#103B50] border border-[#103B50]/15 rounded-md text-xs font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#087E9B]" />
                  <span>{t('journal.exportJson')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F4EFE5] text-[#103B50] border border-[#103B50]/15 rounded-md text-xs font-medium transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#356B50]" />
                  <span>{t('journal.importJson')}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </div>

              {importFeedback && (
                <p
                  className={`text-xs font-medium ${
                    importFeedback.ok ? 'text-[#356B50]' : 'text-[#C47B55]'
                  }`}
                >
                  {importFeedback.msg}
                </p>
              )}

              <OfflinePackButton />

              <Link
                href="/circuits"
                onClick={() => setFavoritesOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-[#087E9B] hover:bg-[#103B50] text-white text-sm font-medium rounded-md transition-colors"
              >
                {t('circuits.builderTitle')}
              </Link>
            </div>
          </div>
        </div>
      )}

      <GlobalSearchModal />
      <ItineraryModal />
    </>
  );
}
