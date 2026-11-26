'use client';

import { useCallback, useEffect, useState } from 'react';
import type { HistoryBookmarkEntry, HistorySectionKind } from '@/types';

const STORAGE_KEY = 'bejaia_explorer_history_bookmarks';
const SYNC_EVENT = 'bejaia-history-bookmarks-change';

function readBookmarksFromStorage(): HistoryBookmarkEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is HistoryBookmarkEntry =>
        Boolean(
          item &&
            typeof item === 'object' &&
            typeof item.id === 'string' &&
            (item.kind === 'era' ||
              item.kind === 'figure' ||
              item.kind === 'medina' ||
              item.kind === 'nature')
        )
    );
  } catch {
    return [];
  }
}

function writeBookmarksToStorage(next: HistoryBookmarkEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota/private-mode storage errors
  }
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
}

export function useHistoryBookmarks() {
  const [bookmarks, setBookmarks] = useState<HistoryBookmarkEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setBookmarks(readBookmarksFromStorage());
      setHydrated(true);
    });

    const onCustomSync = (event: Event) => {
      const custom = event as CustomEvent<HistoryBookmarkEntry[]>;
      if (Array.isArray(custom.detail)) {
        setBookmarks(custom.detail);
      } else {
        setBookmarks(readBookmarksFromStorage());
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setBookmarks(readBookmarksFromStorage());
      }
    };

    window.addEventListener(SYNC_EVENT, onCustomSync);
    window.addEventListener('storage', onStorage);
    return () => {
      active = false;
      window.removeEventListener(SYNC_EVENT, onCustomSync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((entry) => entry.id === id),
    [bookmarks]
  );

  const toggleBookmark = useCallback((id: string, kind: HistorySectionKind) => {
    const current = readBookmarksFromStorage();
    const exists = current.some((entry) => entry.id === id);
    const next = exists
      ? current.filter((entry) => entry.id !== id)
      : [{ id, kind, savedAt: new Date().toISOString() }, ...current];
    setBookmarks(next);
    writeBookmarksToStorage(next);
  }, []);

  const removeBookmark = useCallback((id: string) => {
    const next = readBookmarksFromStorage().filter((entry) => entry.id !== id);
    setBookmarks(next);
    writeBookmarksToStorage(next);
  }, []);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    writeBookmarksToStorage([]);
  }, []);

  return {
    bookmarks,
    hydrated,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearBookmarks,
  };
}
