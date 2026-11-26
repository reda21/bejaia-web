'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translate, getLocalizedText, isRtlLocale } from '@/lib/i18n';
import type {
  CustomCircuit,
  DestinationJournalNote,
  ExportableExplorerBundle,
  Locale,
  LocalizedText,
  ReaderPreferences,
} from '@/types';
import { OfflineIndicator, ServiceWorkerRegistrar } from '@/components/pwa/PWAControls';

interface AppContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRtl: boolean;
  t: (keyPath: string) => string;
  lt: (text: LocalizedText | undefined) => string;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
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
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [itineraryOpen, setItineraryOpen] = useState(false);
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, DestinationJournalNote>>({});
  const [readerPrefs, setReaderPrefsState] = useState<ReaderPreferences>(DEFAULT_READER_PREFS);
  const [customCircuitSlugs, setCustomCircuitSlugsState] = useState<string[]>([]);
  const [savedCircuits, setSavedCircuits] = useState<CustomCircuit[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
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
    return () => {
      active = false;
    };
  }, []);

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

  // Global keyboard shortcut Cmd/Ctrl + K for encyclopedic search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

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
      isRtl: isRtlLocale(locale),
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

