'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  Keyboard,
  Share2,
  Check,
  BookOpen,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { DESTINATIONS, getDestinationBySlug } from '@/data/destinations';
import { GlobalSearchModal } from '@/components/ui/GlobalSearchModal';
import { ItineraryModal } from '@/components/circuits/ItineraryModal';
import { PWAInstallButton, OfflinePackButton } from '@/components/pwa/PWAControls';
import { NavActionTooltip } from '@/components/layout/NavActionTooltip';
import type { Locale, ThemePreference } from '@/types';

const LOCALES: { code: Locale; label: string; title: string }[] = [
  { code: 'fr', label: 'FR', title: 'Français' },
  { code: 'ar', label: 'AR', title: 'العربية (RTL)' },
  { code: 'kab', label: 'KAB', title: 'Taqvaylit / Tamazight' },
];

function formatBadgeCount(count: number): string {
  return count > 99 ? '99+' : String(count);
}

export function SiteHeader() {
  const pathname = usePathname();
  const {
    locale,
    setLocale,
    isRtl,
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
    searchOpen,
    setSearchOpen,
    itineraryOpen,
    setItineraryOpen,
    customCircuitSlugs,
    exportJournalBundle,
    importJournalBundle,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'favorites' | 'visited' | 'notes'>('favorites');
  const [importFeedback, setImportFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [activeShortcutAction, setActiveShortcutAction] = useState<
    'search' | 'lang' | 'theme' | 'itinerary' | 'favorites' | 'menu' | null
  >(null);
  const [shortcutToast, setShortcutToast] = useState<{ shortcut: string; label: string } | null>(
    null
  );
  const [copiedShare, setCopiedShare] = useState(false);
  const [immersiveReading, setImmersiveReading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const itineraryBtnRef = useRef<HTMLButtonElement>(null);
  const favoritesBtnRef = useRef<HTMLButtonElement>(null);
  const shareBtnRef = useRef<HTMLButtonElement>(null);
  const readingBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);
  const shortcutFlashTimerRef = useRef<number | null>(null);
  const shortcutToastTimerRef = useRef<number | null>(null);
  const shareCopiedTimerRef = useRef<number | null>(null);
  const prevLocaleRef = useRef<Locale | null>(null);
  const prevThemeRef = useRef<'light' | 'dark' | null>(null);

  // Scroll elevation & GPU-composited hairline progress tracking
  useEffect(() => {
    let rafId = 0;

    const updateScroll = () => {
      rafId = 0;
      const y = window.scrollY || 0;
      setIsScrolled(y > 12);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  // Polite screen-reader announcements when language or theme switches
  useEffect(() => {
    if (prevLocaleRef.current === null) {
      prevLocaleRef.current = locale;
      return;
    }
    if (prevLocaleRef.current === locale) return;
    prevLocaleRef.current = locale;
    const locObj = LOCALES.find((l) => l.code === locale);
    const timer = window.setTimeout(() => {
      setLiveAnnouncement(`${t('nav.announcementLanguage')} ${locObj?.title ?? locale}`);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [locale, t]);

  useEffect(() => {
    if (prevThemeRef.current === null) {
      prevThemeRef.current = resolvedTheme;
      return;
    }
    if (prevThemeRef.current === resolvedTheme) return;
    prevThemeRef.current = resolvedTheme;
    const msg =
      resolvedTheme === 'dark' ? t('nav.announcementThemeDark') : t('nav.announcementThemeLight');
    const timer = window.setTimeout(() => {
      setLiveAnnouncement(msg);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [resolvedTheme, t]);

  // Mobile drawer Escape handling, focus restoration, and body scroll lock
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
        window.requestAnimationFrame(() => {
          mobileMenuBtnRef.current?.focus();
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  // Global keyboard shortcut button focus + ephemeral visual activation cue
  useEffect(() => {
    const onShortcut = (event: Event) => {
      const custom = event as CustomEvent<{
        action?: 'search' | 'lang' | 'theme' | 'itinerary' | 'favorites' | 'menu';
        shortcut?: string;
      }>;
      const action = custom.detail?.action;
      const shortcut = custom.detail?.shortcut;
      if (!action || !shortcut) return;

      const refMap = {
        search: searchBtnRef,
        lang: langBtnRef,
        theme: themeBtnRef,
        itinerary: itineraryBtnRef,
        favorites: favoritesBtnRef,
        menu: mobileMenuBtnRef,
      };

      const labelMap = {
        search: t('nav.search'),
        lang: t('nav.cycleLanguageHint'),
        theme: resolvedTheme === 'dark' ? t('theme.light') : t('theme.dark'),
        itinerary: t('itinerary.buttonLabel'),
        favorites: t('nav.favorites'),
        menu: t('nav.menu'),
      };

      if (action === 'menu') {
        setMobileMenuOpen((prev) => !prev);
      }

      const targetBtn = refMap[action].current;
      targetBtn?.focus({ preventScroll: true });

      setActiveShortcutAction(action);
      if (shortcutFlashTimerRef.current) window.clearTimeout(shortcutFlashTimerRef.current);
      shortcutFlashTimerRef.current = window.setTimeout(() => {
        setActiveShortcutAction(null);
      }, 1100);

      const label = labelMap[action];
      setShortcutToast({ shortcut, label });
      setLiveAnnouncement(`${t('nav.shortcutActivated')} : ${label} (${shortcut})`);
      if (shortcutToastTimerRef.current) window.clearTimeout(shortcutToastTimerRef.current);
      shortcutToastTimerRef.current = window.setTimeout(() => {
        setShortcutToast(null);
      }, 1800);
    };

    window.addEventListener('bejaia-nav-shortcut', onShortcut);
    return () => {
      window.removeEventListener('bejaia-nav-shortcut', onShortcut);
      if (shortcutFlashTimerRef.current) window.clearTimeout(shortcutFlashTimerRef.current);
      if (shortcutToastTimerRef.current) window.clearTimeout(shortcutToastTimerRef.current);
      if (shareCopiedTimerRef.current) window.clearTimeout(shareCopiedTimerRef.current);
    };
  }, [resolvedTheme, t]);

  // Close Favorites drawer on Escape and restore focus to the trigger button
  useEffect(() => {
    if (!favoritesOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setFavoritesOpen(false);
        window.requestAnimationFrame(() => {
          favoritesBtnRef.current?.focus({ preventScroll: true });
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [favoritesOpen, setFavoritesOpen]);

  // Toggle html.immersive-reading class & support Escape to exit reading mode
  useEffect(() => {
    document.documentElement.classList.toggle('immersive-reading', immersiveReading);
    if (!immersiveReading) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setImmersiveReading(false);
        window.requestAnimationFrame(() => {
          readingBtnRef.current?.focus({ preventScroll: true });
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.documentElement.classList.remove('immersive-reading');
    };
  }, [immersiveReading]);

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

  // Roving Left/Right/Home/End keyboard navigation across primary desktop links
  const handleNavKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const links = Array.from(navRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
    if (links.length === 0) return;

    const activeIdx = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (activeIdx === -1) return;

    const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

    if (e.key === nextKey) {
      e.preventDefault();
      links[(activeIdx + 1) % links.length].focus();
    } else if (e.key === prevKey) {
      e.preventDefault();
      links[(activeIdx - 1 + links.length) % links.length].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      links[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      links[links.length - 1].focus();
    }
  };

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

  const handleCopyCurrentPageUrl = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    let copied = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = url;
        tempInput.setAttribute('readonly', '');
        tempInput.className = 'fixed -top-full opacity-0';
        document.body.appendChild(tempInput);
        tempInput.select();
        copied = document.execCommand('copy');
        document.body.removeChild(tempInput);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopiedShare(true);
      setLiveAnnouncement(t('nav.shareCopiedToast'));
      if (shareCopiedTimerRef.current) window.clearTimeout(shareCopiedTimerRef.current);
      shareCopiedTimerRef.current = window.setTimeout(() => {
        setCopiedShare(false);
      }, 2200);
    }
  };

  const currentLocIndex = LOCALES.findIndex((loc) => loc.code === locale);
  const safeLocIndex = currentLocIndex === -1 ? 0 : currentLocIndex;
  const currentLoc = LOCALES[safeLocIndex];
  const nextLoc = LOCALES[(safeLocIndex + 1) % LOCALES.length];

  const itineraryCount = customCircuitSlugs.length;
  const favoritesCount = favorites.length;

  return (
    <>
      <header
        className={`no-print sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-200 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-[#103B50]/15 shadow-[0_2px_14px_rgba(16,59,80,0.07)]'
            : 'bg-white/95 backdrop-blur-sm border-[#103B50]/10'
        }`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-4 focus:z-50 focus:px-3.5 focus:py-2 focus:rounded-md focus:bg-[#103B50] focus:text-white focus:text-xs focus:font-semibold focus:shadow-lg"
        >
          {t('nav.skipToContent')}
        </a>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            href="/"
            aria-current={pathname === '/' ? 'page' : undefined}
            className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#103B50] hover:text-[#087E9B] transition-colors whitespace-nowrap shrink-0"
          >
            {t('brand.name')}
          </Link>

          {/* Zone 2: Primary Navigation */}
          <nav
            ref={navRef}
            onKeyDown={handleNavKeyDown}
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
                  aria-current={active ? 'page' : undefined}
                  className={`group relative py-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    active ? 'text-[#103B50]' : 'hover:text-[#087E9B]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#087E9B] origin-start transition-transform duration-200 ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Harmonized Right-Side Action Icons & Conditional Terracotta Badges */}
          <div className="site-header-nav-right-icons flex items-center gap-2 shrink-0">
            <div className="relative inline-flex items-center">
              <button
                ref={searchBtnRef}
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label={`${t('nav.search')} — ${t('nav.tooltipSearch')} (Ctrl+K)`}
                aria-describedby="tooltip-nav-search"
                aria-expanded={searchOpen}
                data-shortcut-active={activeShortcutAction === 'search' ? 'true' : undefined}
                className="peer nav-action-button"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
              <NavActionTooltip
                id="tooltip-nav-search"
                label={t('nav.search')}
                description={t('nav.tooltipSearch')}
                shortcut="Ctrl+K"
              />
            </div>

            <PWAInstallButton headerMinimal />

            <div className="relative inline-flex items-center">
              <button
                ref={langBtnRef}
                type="button"
                onClick={() => setLocale(nextLoc.code)}
                lang={currentLoc.code}
                aria-label={`${t('nav.cycleLanguageHint')} — ${currentLoc.title} → ${nextLoc.title} (Alt+L)`}
                aria-describedby="tooltip-nav-lang"
                data-shortcut-active={activeShortcutAction === 'lang' ? 'true' : undefined}
                className="peer nav-action-button nav-action-lang text-xs font-bold tracking-tight uppercase"
              >
                {currentLoc.label}
              </button>
              <NavActionTooltip
                id="tooltip-nav-lang"
                label={t('nav.cycleLanguageHint')}
                description={`${currentLoc.title} → ${nextLoc.title}`}
                shortcut="Alt+L"
              />
            </div>

            <div className="relative inline-flex items-center">
              <button
                ref={themeBtnRef}
                type="button"
                onClick={toggleTheme}
                aria-label={`${
                  resolvedTheme === 'dark' ? t('theme.toggleToLight') : t('theme.toggleToDark')
                } (Alt+T)`}
                aria-describedby="tooltip-nav-theme"
                aria-pressed={resolvedTheme === 'dark'}
                data-shortcut-active={activeShortcutAction === 'theme' ? 'true' : undefined}
                className="peer nav-action-button"
              >
                <Moon className="w-[18px] h-[18px] dark:hidden" strokeWidth={2} />
                <Sun className="w-[18px] h-[18px] hidden dark:block" strokeWidth={2} />
              </button>
              <NavActionTooltip
                id="tooltip-nav-theme"
                label={
                  resolvedTheme === 'dark' ? t('theme.toggleToLight') : t('theme.toggleToDark')
                }
                description={
                  resolvedTheme === 'dark' ? t('nav.tooltipThemeToLight') : t('nav.tooltipThemeToDark')
                }
                shortcut="Alt+T"
              />
            </div>

            <div className="relative inline-flex items-center">
              <button
                ref={itineraryBtnRef}
                type="button"
                onClick={() => setItineraryOpen(true)}
                aria-label={`${
                  itineraryCount > 0
                    ? `${t('itinerary.buttonLabel')} (${itineraryCount})`
                    : t('itinerary.buttonLabel')
                } — ${t('nav.tooltipItinerary')} (Alt+I)`}
                aria-describedby="tooltip-nav-itinerary"
                aria-expanded={itineraryOpen}
                data-shortcut-active={activeShortcutAction === 'itinerary' ? 'true' : undefined}
                className="peer nav-action-button"
              >
                <span className="relative inline-flex items-center justify-center">
                  <Route className="w-[18px] h-[18px]" strokeWidth={2} />
                  {itineraryCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-2 -end-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#C47B55] text-white ring-[1.5px] ring-white dark:ring-[#10222E] text-[10px] font-bold leading-none inline-flex items-center justify-center tabular-nums"
                    >
                      {formatBadgeCount(itineraryCount)}
                    </span>
                  )}
                </span>
              </button>
              <NavActionTooltip
                id="tooltip-nav-itinerary"
                label={
                  itineraryCount > 0
                    ? `${t('itinerary.buttonLabel')} (${itineraryCount})`
                    : t('itinerary.buttonLabel')
                }
                description={t('nav.tooltipItinerary')}
                shortcut="Alt+I"
              />
            </div>

            <div className="relative inline-flex items-center">
              <button
                ref={favoritesBtnRef}
                type="button"
                onClick={() => setFavoritesOpen(true)}
                aria-label={`${
                  favoritesCount > 0
                    ? `${t('nav.favorites')} (${favoritesCount})`
                    : t('nav.favorites')
                } — ${t('nav.tooltipFavorites')} (Alt+F)`}
                aria-describedby="tooltip-nav-favorites"
                aria-expanded={favoritesOpen}
                data-shortcut-active={activeShortcutAction === 'favorites' ? 'true' : undefined}
                className="peer nav-action-button"
              >
                <span className="relative inline-flex items-center justify-center">
                  <Heart className="w-[18px] h-[18px]" strokeWidth={2} />
                  {favoritesCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-2 -end-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#C47B55] text-white ring-[1.5px] ring-white dark:ring-[#10222E] text-[10px] font-bold leading-none inline-flex items-center justify-center tabular-nums"
                    >
                      {formatBadgeCount(favoritesCount)}
                    </span>
                  )}
                </span>
              </button>
              <NavActionTooltip
                id="tooltip-nav-favorites"
                label={
                  favoritesCount > 0
                    ? `${t('nav.favorites')} (${favoritesCount})`
                    : t('nav.favorites')
                }
                description={t('nav.tooltipFavorites')}
                shortcut="Alt+F"
              />
            </div>

            <div className="relative inline-flex items-center">
              <button
                ref={shareBtnRef}
                type="button"
                onClick={() => void handleCopyCurrentPageUrl()}
                aria-label={`${copiedShare ? t('nav.shareCopiedLabel') : t('nav.shareLabel')} — ${t('nav.tooltipShare')}`}
                aria-describedby="tooltip-nav-share"
                className="peer nav-action-button"
              >
                {copiedShare ? (
                  <Check className="w-[18px] h-[18px]" strokeWidth={2} />
                ) : (
                  <Share2 className="w-[18px] h-[18px]" strokeWidth={2} />
                )}
              </button>
              <NavActionTooltip
                id="tooltip-nav-share"
                label={copiedShare ? t('nav.shareCopiedLabel') : t('nav.shareLabel')}
                description={t('nav.tooltipShare')}
              />
            </div>

            <div className="relative inline-flex items-center">
              <button
                ref={readingBtnRef}
                type="button"
                onClick={() => setImmersiveReading((v) => !v)}
                aria-label={`${
                  immersiveReading ? t('nav.exitReadingMode') : t('nav.readingModeLabel')
                } — ${t('nav.tooltipReadingMode')}`}
                aria-describedby="tooltip-nav-reading"
                aria-pressed={immersiveReading}
                className="peer nav-action-button"
              >
                <BookOpen className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
              <NavActionTooltip
                id="tooltip-nav-reading"
                label={t('nav.readingModeLabel')}
                description={t('nav.tooltipReadingMode')}
              />
            </div>

            <div className="relative inline-flex items-center xl:hidden">
              <button
                ref={mobileMenuBtnRef}
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={`${t('nav.menu')} — ${t('nav.tooltipMenu')} (Alt+M)`}
                aria-describedby="tooltip-nav-menu"
                aria-expanded={mobileMenuOpen}
                data-shortcut-active={activeShortcutAction === 'menu' ? 'true' : undefined}
                className="peer nav-action-button"
              >
                {mobileMenuOpen ? (
                  <X className="w-[18px] h-[18px]" strokeWidth={2} />
                ) : (
                  <Menu className="w-[18px] h-[18px]" strokeWidth={2} />
                )}
              </button>
              <NavActionTooltip
                id="tooltip-nav-menu"
                label={t('nav.menu')}
                description={t('nav.tooltipMenu')}
                shortcut="Alt+M"
              />
            </div>
          </div>
        </div>

        {/* Ephemeral visual confirmation toast for keyboard shortcuts or copied share link */}
        {(copiedShare || shortcutToast) && (
          <div className="pointer-events-none fixed top-[74px] end-4 sm:end-8 z-50 flex flex-col items-end gap-2">
            {copiedShare && (
              <div
                role="status"
                aria-live="polite"
                className="inline-flex items-center gap-2 rounded-md border border-[#356B50]/25 bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-[#103B50] shadow-lg transition-opacity duration-150"
              >
                <Check className="w-3.5 h-3.5 text-[#356B50] shrink-0" strokeWidth={2} />
                <span>{t('nav.shareCopiedToast')}</span>
              </div>
            )}
            {shortcutToast && (
              <div
                role="status"
                aria-live="polite"
                className="inline-flex items-center gap-2 rounded-md border border-[#103B50]/15 bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-[#103B50] shadow-lg transition-opacity duration-150"
              >
                <Keyboard className="w-3.5 h-3.5 text-[#087E9B] shrink-0" strokeWidth={2} />
                <span>{shortcutToast.label}</span>
                <kbd className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F4EFE5] text-[#51636D]">
                  {shortcutToast.shortcut}
                </kbd>
              </div>
            )}
          </div>
        )}

        {/* Fine, discreet GPU-composited reading scroll progress bar along bottom edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[2px] overflow-hidden"
        >
          <div
            className="h-full w-full bg-[#087E9B]/85 origin-start transition-transform duration-75"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>

        {/* Honest Kabyle Linguistic Validation Notice */}
        {locale === 'kab' && (
          <div className="bg-[#F4EFE5] border-t border-[#103B50]/10 px-4 py-2 text-xs text-[#103B50] text-center">
            {t('common.kabyleNotice')}
          </div>
        )}

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-[#103B50]/10 px-4 py-4 space-y-1 shadow-lg max-h-[calc(100dvh-4rem)] overflow-y-auto">
            {navItems.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center min-h-[44px] px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
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

      {immersiveReading && (
        <button
          type="button"
          onClick={() => {
            setImmersiveReading(false);
            window.requestAnimationFrame(() => {
              readingBtnRef.current?.focus({ preventScroll: true });
            });
          }}
          aria-label={t('nav.exitReadingMode')}
          className="no-print fixed top-4 end-4 z-50 inline-flex items-center gap-2 rounded-md border border-[#103B50]/15 bg-white/95 backdrop-blur-md px-3.5 py-2 text-xs font-medium text-[#103B50] shadow-lg hover:bg-[#F4EFE5] transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#087E9B]" strokeWidth={2} />
          <span>{t('nav.exitReadingMode')}</span>
          <X className="w-3.5 h-3.5 text-[#51636D]" strokeWidth={2} />
        </button>
      )}

      <GlobalSearchModal />
      <ItineraryModal />
    </>
  );
}
