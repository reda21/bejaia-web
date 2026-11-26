'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { useRouter } from 'next/navigation';
import { translate, getLocalizedText, isRtlLocale } from '@/lib/i18n';
import type {
  CustomCircuit,
  DestinationJournalNote,
  ExportableExplorerBundle,
  Locale,
  LocalizedText,
  ReaderPreferences,
  ThemePreference,
} from '@/types';
import { OfflineIndicator, ServiceWorkerRegistrar } from '@/components/pwa/PWAControls';
import { KeyboardShortcutsModal } from '@/components/ui/KeyboardShortcutsModal';

interface AppContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLocaleTransitioning: boolean;
  isRtl: boolean;
  theme: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemePreference, event?: React.MouseEvent | MouseEvent) => void;
  toggleTheme: (event?: React.MouseEvent | MouseEvent) => void;
  t: (keyPath: string) => string;
  lt: (text: LocalizedText | undefined) => string;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  favoritesOpen: boolean;
  setFavoritesOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  itineraryOpen: boolean;
  setItineraryOpen: (open: boolean) => void;
  visitedSlugs: string[];
  toggleVisited: (slug: string) => void;
  isVisited: (slug: string) => boolean;
  notes: Record<string, DestinationJournalNote>;
  setDestinationNote: (slug: string, note: string) => void;
  deleteDestinationNote: (slug: string) => void;
  readerPrefs: ReaderPreferences;
  setReaderPrefs: (prefs: Partial<ReaderPreferences>) => void;
  exportJournalBundle: () => ExportableExplorerBundle;
  importJournalBundle: (jsonText: string) => { ok: boolean; error?: string };
  customCircuitSlugs: string[];
  toggleCustomCircuitSlug: (slug: string) => void;
  setCustomCircuitSlugs: (slugs: string[]) => void;
  savedCircuits: CustomCircuit[];
  saveCustomCircuit: (name: string) => void;
  deleteSavedCircuit: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_LOCALE = 'bejaia_explorer_locale';
const STORAGE_THEME = 'bejaia_explorer_theme';
const STORAGE_FAVORITES = 'bejaia_explorer_favorites';
const STORAGE_VISITED = 'bejaia_explorer_visited';
const STORAGE_NOTES = 'bejaia_explorer_field_notes';
const STORAGE_READER_PREFS = 'bejaia_explorer_reader_prefs';
const STORAGE_CUSTOM_SLUGS = 'bejaia_explorer_custom_circuit_draft';
const STORAGE_SAVED_CIRCUITS = 'bejaia_explorer_saved_circuits';

const DEFAULT_READER_PREFS: ReaderPreferences = {
  fontScale: 'standard',
  readerMode: false,
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [theme, setThemeState] = useState<ThemePreference>('system');
  const [systemDark, setSystemDark] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [itineraryOpen, setItineraryOpen] = useState(false);
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, DestinationJournalNote>>({});
  const [readerPrefs, setReaderPrefsState] = useState<ReaderPreferences>(DEFAULT_READER_PREFS);
  const [customCircuitSlugs, setCustomCircuitSlugsState] = useState<string[]>([]);
  const [savedCircuits, setSavedCircuits] = useState<CustomCircuit[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isLocaleTransitioning, setIsLocaleTransitioning] = useState(false);
  const localeFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (active) setSystemDark(e.matches);
    };
    mq.addEventListener('change', handleMediaChange);

    queueMicrotask(() => {
      if (!active) return;
      setSystemDark(mq.matches);
      try {
        const savedTheme = localStorage.getItem(STORAGE_THEME) as ThemePreference | null;
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          setThemeState(savedTheme);
        }
        const savedLocale = localStorage.getItem(STORAGE_LOCALE) as Locale | null;
        if (savedLocale === 'fr' || savedLocale === 'ar' || savedLocale === 'kab') {
          setLocaleState(savedLocale);
        }
        const savedFavs = localStorage.getItem(STORAGE_FAVORITES);
        if (savedFavs) {
          const parsed = JSON.parse(savedFavs);
          if (Array.isArray(parsed)) setFavorites(parsed);
        }
        const savedVisited = localStorage.getItem(STORAGE_VISITED);
        if (savedVisited) {
          const parsed = JSON.parse(savedVisited);
          if (Array.isArray(parsed)) setVisitedSlugs(parsed);
        }
        const savedNotes = localStorage.getItem(STORAGE_NOTES);
        if (savedNotes) {
          const parsed = JSON.parse(savedNotes);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            setNotes(parsed as Record<string, DestinationJournalNote>);
          }
        }
        const savedReader = localStorage.getItem(STORAGE_READER_PREFS);
        if (savedReader) {
          const parsed = JSON.parse(savedReader) as Partial<ReaderPreferences>;
          if (parsed && typeof parsed === 'object') {
            setReaderPrefsState({
              fontScale:
                parsed.fontScale === 'comfort' || parsed.fontScale === 'large'
                  ? parsed.fontScale
                  : 'standard',
              readerMode: Boolean(parsed.readerMode),
            });
          }
        }
        const savedDraft = localStorage.getItem(STORAGE_CUSTOM_SLUGS);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (Array.isArray(parsed)) setCustomCircuitSlugsState(parsed);
        }
        const savedList = localStorage.getItem(STORAGE_SAVED_CIRCUITS);
        if (savedList) {
          const parsed = JSON.parse(savedList);
          if (Array.isArray(parsed)) setSavedCircuits(parsed);
        }
      } catch {
        // Ignore storage read errors in restricted contexts
      }
      setHydrated(true);
    });

    const handleStorage = (e: StorageEvent) => {
      if (!active) return;
      if (e.key === STORAGE_FAVORITES && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setFavorites(parsed);
        } catch {
          // ignore
        }
      }
      if (e.key === STORAGE_THEME) {
        const v = e.newValue as ThemePreference | null;
        if (v === 'light' || v === 'dark' || v === 'system') setThemeState(v);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      active = false;
      mq.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    if (!hydrated) return;
    const isDark = resolvedTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDark ? '#0B1922' : '#103B50');
    }
    try {
      localStorage.setItem(STORAGE_THEME, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme, resolvedTheme, hydrated]);

  useEffect(() => {
    const rtl = isRtlLocale(locale);
    document.documentElement.lang = locale === 'kab' ? 'kab' : locale;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_LOCALE, locale);
      } catch {
        // Ignore storage write errors
      }
    }
  }, [locale, hydrated]);

  useEffect(() => {
    return () => {
      if (localeFadeTimerRef.current) {
        clearTimeout(localeFadeTimerRef.current);
      }
    };
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      if (localeFadeTimerRef.current) {
        clearTimeout(localeFadeTimerRef.current);
      }

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setLocaleState(next);
        setIsLocaleTransitioning(false);
        return;
      }

      setIsLocaleTransitioning(true);
      localeFadeTimerRef.current = setTimeout(() => {
        setLocaleState(next);
        requestAnimationFrame(() => {
          setIsLocaleTransitioning(false);
        });
      }, 150);
    },
    [locale]
  );

  const runCircularThemeTransition = useCallback(
    (nextPref: ThemePreference, event?: React.MouseEvent | MouseEvent) => {
      const nextIsDark =
        nextPref === 'dark' || (nextPref === 'system' && systemDark);
      const currentIsDark = resolvedTheme === 'dark';

      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      };

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (
        !doc.startViewTransition ||
        prefersReducedMotion ||
        nextIsDark === currentIsDark
      ) {
        setThemeState(nextPref);
        return;
      }

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (
        event &&
        typeof event.clientX === 'number' &&
        typeof event.clientY === 'number' &&
        (event.clientX !== 0 || event.clientY !== 0)
      ) {
        x = event.clientX;
        y = event.clientY;
      } else {
        const btn = document.querySelector<HTMLElement>(
          '[aria-describedby="tooltip-nav-theme"]'
        );
        if (btn) {
          const rect = btn.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.documentElement.classList.add('theme-view-transitioning');

      const transition = doc.startViewTransition(() => {
        flushSync(() => {
          setThemeState(nextPref);
        });
        document.documentElement.classList.toggle('dark', nextIsDark);
        document.documentElement.style.colorScheme = nextIsDark ? 'dark' : 'light';
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 520,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          // Ignore if view transition is skipped
        });

      transition.finished.finally(() => {
        document.documentElement.classList.remove('theme-view-transitioning');
      });
    },
    [resolvedTheme, systemDark]
  );

  const setTheme = useCallback(
    (next: ThemePreference, event?: React.MouseEvent | MouseEvent) => {
      runCircularThemeTransition(next, event);
    },
    [runCircularThemeTransition]
  );

  const toggleTheme = useCallback(
    (event?: React.MouseEvent | MouseEvent) => {
      const nextPref: ThemePreference = resolvedTheme === 'dark' ? 'light' : 'dark';
      runCircularThemeTransition(nextPref, event);
    },
    [resolvedTheme, runCircularThemeTransition]
  );

  // Global keyboard shortcuts:
  // - Cmd/Ctrl+K or 's' (Search), 'f' or Alt+F (Favorites), 'm' (Map), 'i' or Alt+I (Itinerary)
  // - Alt+T (Theme), Alt+L (Language), Shift+? (Shortcuts help modal)
  useEffect(() => {
    const LOCALE_ORDER: Locale[] = ['fr', 'ar', 'kab'];

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable = Boolean(
        target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
      );

      const emitNavShortcut = (action: 'search' | 'lang' | 'theme' | 'itinerary' | 'favorites' | 'menu', shortcut: string) => {
        window.dispatchEvent(
          new CustomEvent('bejaia-nav-shortcut', {
            detail: { action, shortcut },
          })
        );
      };

      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        emitNavShortcut('search', 'Ctrl+K');
        return;
      }

      if (isEditable) return;

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
          e.preventDefault();
          setShortcutsHelpOpen((prev) => !prev);
          return;
        }

        if (!e.shiftKey) {
          const singleKey = e.key.toLowerCase();
          if (singleKey === 'f') {
            e.preventDefault();
            setFavoritesOpen((prev) => !prev);
            emitNavShortcut('favorites', 'F');
            return;
          } else if (singleKey === 's') {
            e.preventDefault();
            setSearchOpen((prev) => !prev);
            emitNavShortcut('search', 'S');
            return;
          } else if (singleKey === 'm') {
            e.preventDefault();
            router.push('/carte');
            return;
          } else if (singleKey === 'i') {
            e.preventDefault();
            setItineraryOpen((prev) => !prev);
            emitNavShortcut('itinerary', 'I');
            return;
          }
        }
      }

      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

      const key = e.key.toLowerCase();
      if (key === 'i') {
        e.preventDefault();
        setItineraryOpen((prev) => !prev);
        emitNavShortcut('itinerary', 'Alt+I');
      } else if (key === 'f') {
        e.preventDefault();
        setFavoritesOpen((prev) => !prev);
        emitNavShortcut('favorites', 'Alt+F');
      } else if (key === 't') {
        e.preventDefault();
        toggleTheme();
        emitNavShortcut('theme', 'Alt+T');
      } else if (key === 'l') {
        e.preventDefault();
        const idx = LOCALE_ORDER.indexOf(locale);
        const nextLocale = LOCALE_ORDER[(idx === -1 ? 0 : idx + 1) % LOCALE_ORDER.length];
        setLocale(nextLocale);
        emitNavShortcut('lang', 'Alt+L');
      } else if (key === 's') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        emitNavShortcut('search', 'Alt+S');
      } else if (key === 'm') {
        e.preventDefault();
        emitNavShortcut('menu', 'Alt+M');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [locale, router, setLocale, toggleTheme]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggleVisited = useCallback((slug: string) => {
    setVisitedSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_VISITED, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isVisited = useCallback((slug: string) => visitedSlugs.includes(slug), [visitedSlugs]);

  const setDestinationNote = useCallback((slug: string, note: string) => {
    setNotes((prev) => {
      const cleaned = note.trim();
      const next = { ...prev };
      if (!cleaned) {
        delete next[slug];
      } else {
        next[slug] = {
          note: cleaned,
          updatedAt: new Date().toISOString(),
        };
      }
      try {
        localStorage.setItem(STORAGE_NOTES, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const deleteDestinationNote = useCallback((slug: string) => {
    setNotes((prev) => {
      const next = { ...prev };
      delete next[slug];
      try {
        localStorage.setItem(STORAGE_NOTES, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setReaderPrefs = useCallback((partial: Partial<ReaderPreferences>) => {
    setReaderPrefsState((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_READER_PREFS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const exportJournalBundle = useCallback((): ExportableExplorerBundle => {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      favorites,
      visitedSlugs,
      notes,
      savedCircuits,
    };
  }, [favorites, visitedSlugs, notes, savedCircuits]);

  const importJournalBundle = useCallback((jsonText: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<ExportableExplorerBundle>;
      if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) {
        return { ok: false, error: 'Format de carnet invalide.' };
      }

      if (Array.isArray(parsed.favorites)) {
        const cleanFavs = parsed.favorites.filter((s): s is string => typeof s === 'string');
        setFavorites((prev) => {
          const merged = Array.from(new Set([...prev, ...cleanFavs]));
          try {
            localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(merged));
          } catch {
            // ignore
          }
          return merged;
        });
      }

      if (Array.isArray(parsed.visitedSlugs)) {
        const cleanVisited = parsed.visitedSlugs.filter((s): s is string => typeof s === 'string');
        setVisitedSlugs((prev) => {
          const merged = Array.from(new Set([...prev, ...cleanVisited]));
          try {
            localStorage.setItem(STORAGE_VISITED, JSON.stringify(merged));
          } catch {
            // ignore
          }
          return merged;
        });
      }

      if (parsed.notes && typeof parsed.notes === 'object' && !Array.isArray(parsed.notes)) {
        setNotes((prev) => {
          const next = { ...prev };
          for (const [slug, entry] of Object.entries(parsed.notes!)) {
            if (entry && typeof entry.note === 'string' && entry.note.trim()) {
              next[slug] = {
                note: entry.note.trim(),
                updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : new Date().toISOString(),
              };
            }
          }
          try {
            localStorage.setItem(STORAGE_NOTES, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }

      if (Array.isArray(parsed.savedCircuits)) {
        const validCircuits = parsed.savedCircuits.filter(
          (c): c is CustomCircuit =>
            Boolean(c && typeof c.id === 'string' && typeof c.name === 'string' && Array.isArray(c.destinationSlugs))
        );
        setSavedCircuits((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const merged = [...prev, ...validCircuits.filter((c) => !existingIds.has(c.id))];
          try {
            localStorage.setItem(STORAGE_SAVED_CIRCUITS, JSON.stringify(merged));
          } catch {
            // ignore
          }
          return merged;
        });
      }

      return { ok: true };
    } catch {
      return { ok: false, error: 'Impossible de lire le fichier JSON.' };
    }
  }, []);

  const setCustomCircuitSlugs = useCallback((slugs: string[]) => {
    setCustomCircuitSlugsState(slugs);
    try {
      localStorage.setItem(STORAGE_CUSTOM_SLUGS, JSON.stringify(slugs));
    } catch {
      // ignore
    }
  }, []);

  const toggleCustomCircuitSlug = useCallback((slug: string) => {
    setCustomCircuitSlugsState((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_CUSTOM_SLUGS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const saveCustomCircuit = useCallback(
    (name: string) => {
      if (!name.trim() || customCircuitSlugs.length < 2) return;
      const newCircuit: CustomCircuit = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        destinationSlugs: [...customCircuitSlugs],
        createdAt: new Date().toISOString(),
      };
      setSavedCircuits((prev) => {
        const next = [newCircuit, ...prev];
        try {
          localStorage.setItem(STORAGE_SAVED_CIRCUITS, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [customCircuitSlugs]
  );

  const deleteSavedCircuit = useCallback((id: string) => {
    setSavedCircuits((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(STORAGE_SAVED_CIRCUITS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      locale,
      setLocale,
      isLocaleTransitioning,
      isRtl: isRtlLocale(locale),
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      t: (keyPath: string) => translate(locale, keyPath),
      lt: (text: LocalizedText | undefined) => getLocalizedText(text, locale),
      favorites,
      toggleFavorite,
      isFavorite,
      favoritesOpen,
      setFavoritesOpen,
      searchOpen,
      setSearchOpen,
      itineraryOpen,
      setItineraryOpen,
      visitedSlugs,
      toggleVisited,
      isVisited,
      notes,
      setDestinationNote,
      deleteDestinationNote,
      readerPrefs,
      setReaderPrefs,
      exportJournalBundle,
      importJournalBundle,
      customCircuitSlugs,
      toggleCustomCircuitSlug,
      setCustomCircuitSlugs,
      savedCircuits,
      saveCustomCircuit,
      deleteSavedCircuit,
    }),
    [
      locale,
      setLocale,
      isLocaleTransitioning,
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      favorites,
      toggleFavorite,
      isFavorite,
      favoritesOpen,
      searchOpen,
      itineraryOpen,
      visitedSlugs,
      toggleVisited,
      isVisited,
      notes,
      setDestinationNote,
      deleteDestinationNote,
      readerPrefs,
      setReaderPrefs,
      exportJournalBundle,
      importJournalBundle,
      customCircuitSlugs,
      toggleCustomCircuitSlug,
      setCustomCircuitSlugs,
      savedCircuits,
      saveCustomCircuit,
      deleteSavedCircuit,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      <ServiceWorkerRegistrar />
      {children}
      <OfflineIndicator />
      <KeyboardShortcutsModal
        open={shortcutsHelpOpen}
        onClose={() => setShortcutsHelpOpen(false)}
        locale={locale}
      />
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProviders');
  }
  return ctx;
}

