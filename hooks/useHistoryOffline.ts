'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOnlineStatus } from '@/components/pwa/PWAControls';
import type { OfflineHistoryArticlePayload } from '@/types';

const HISTORY_CACHE_NAME = 'bejaia-history-v5';
const PAGES_CACHE_NAME = 'bejaia-pages-v5';
const ASSETS_CACHE_NAME = 'bejaia-assets-v5';
const OFFLINE_SYNC_EVENT = 'bejaia-history-offline-change';

function collectCurrentHistoryAssets(extraUrls: string[] = []): string[] {
  const urls = new Set<string>(['/histoire']);
  for (const u of extraUrls) {
    if (u && u.startsWith('/')) urls.add(u);
  }
  if (typeof document !== 'undefined') {
    document
      .querySelectorAll<HTMLScriptElement>('script[src^="/_next/"]')
      .forEach((el) => {
        const src = el.getAttribute('src');
        if (src) urls.add(src);
      });
    document
      .querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href^="/_next/"]')
      .forEach((el) => {
        const href = el.getAttribute('href');
        if (href) urls.add(href);
      });
  }
  return Array.from(urls);
}

async function readCachedIdsDirectly(): Promise<string[]> {
  if (typeof caches === 'undefined') return [];
  try {
    const cache = await caches.open(HISTORY_CACHE_NAME);
    const keys = await cache.keys();
    const ids: string[] = [];
    for (const req of keys) {
      try {
        const u = new URL(req.url);
        if (u.pathname === '/api/history-articles') {
          const id = u.searchParams.get('id');
          if (id) ids.push(id);
        }
      } catch {
        // Ignore malformed URLs
      }
    }
    return Array.from(new Set(ids));
  } catch {
    return [];
  }
}

function broadcastCachedIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OFFLINE_SYNC_EVENT, { detail: ids }));
}

export function useHistoryOffline() {
  const isOnline = useOnlineStatus();
  const [cachedIds, setCachedIds] = useState<string[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [cachingAll, setCachingAll] = useState(false);

  const syncFromCaches = useCallback(async () => {
    const ids = await readCachedIdsDirectly();
    setCachedIds(ids);
    return ids;
  }, []);

  useEffect(() => {
    let active = true;

    void readCachedIdsDirectly().then((ids) => {
      if (active) {
        setCachedIds(ids);
      }
    });

    const onLocalSync = (event: Event) => {
      if (!active) return;
      const custom = event as CustomEvent<string[]>;
      if (Array.isArray(custom.detail)) {
        setCachedIds(custom.detail);
      }
    };
    window.addEventListener(OFFLINE_SYNC_EVENT, onLocalSync);

    const onSwMessage = (event: MessageEvent) => {
      if (!active) return;
      const data = event.data as
        | {
            type?: string;
            cachedIds?: string[];
            lastCachedId?: string;
            lastRemovedId?: string;
            allDone?: boolean;
          }
        | undefined;
      if (data?.type === 'HISTORY_OFFLINE_STATUS' && Array.isArray(data.cachedIds)) {
        setCachedIds(data.cachedIds);
        broadcastCachedIds(data.cachedIds);
        if (data.lastCachedId) {
          setPendingIds((prev) => prev.filter((id) => id !== data.lastCachedId));
        }
        if (data.lastRemovedId) {
          setPendingIds((prev) => prev.filter((id) => id !== data.lastRemovedId));
        }
        if (data.allDone) {
          setCachingAll(false);
          setPendingIds([]);
        }
      }
    };

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', onSwMessage);
      navigator.serviceWorker.ready
        .then((reg) => {
          reg.active?.postMessage({ type: 'GET_CACHED_HISTORY_ARTICLES' });
        })
        .catch(() => undefined);
    }

    return () => {
      active = false;
      window.removeEventListener(OFFLINE_SYNC_EVENT, onLocalSync);
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', onSwMessage);
      }
    };
  }, [syncFromCaches]);

  const isArticleOfflineReady = useCallback(
    (id: string) => cachedIds.includes(id),
    [cachedIds]
  );

  const isArticlePending = useCallback(
    (id: string) => pendingIds.includes(id),
    [pendingIds]
  );

  const saveArticleForOffline = useCallback(
    async (articleId: string, coverImageSrc?: string) => {
      if (!isOnline) return false;
      setPendingIds((prev) => (prev.includes(articleId) ? prev : [...prev, articleId]));

      const extraUrls = collectCurrentHistoryAssets(coverImageSrc ? [coverImageSrc] : []);
      const apiUrl = `/api/history-articles?id=${encodeURIComponent(articleId)}`;

      try {
        // Ask active Service Worker to cache article payload + page shell + assets
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready.catch(() => null);
          if (reg?.active) {
            reg.active.postMessage({
              type: 'CACHE_HISTORY_ARTICLE',
              articleId,
              urls: extraUrls,
            });
          }
        }

        // Also mirror directly into Cache Storage so state resolves deterministically even before SW claims
        if (typeof caches !== 'undefined') {
          const [historyCache, pagesCache, assetsCache] = await Promise.all([
            caches.open(HISTORY_CACHE_NAME),
            caches.open(PAGES_CACHE_NAME),
            caches.open(ASSETS_CACHE_NAME),
          ]);
          const res = await fetch(apiUrl, { credentials: 'same-origin' });
          if (res.ok) {
            await historyCache.put(apiUrl, res.clone());
          }
          await Promise.all(
            extraUrls.map(async (u) => {
              try {
                const assetRes = await fetch(u, { credentials: 'same-origin' });
                if (assetRes.ok) {
                  const targetCache = u === '/histoire' ? pagesCache : assetsCache;
                  await targetCache.put(u, assetRes.clone());
                }
              } catch {
                // Skip non-critical static asset failures
              }
            })
          );
        }

        const nextIds = await syncFromCaches();
        broadcastCachedIds(nextIds);
        return nextIds.includes(articleId);
      } catch {
        return false;
      } finally {
        setPendingIds((prev) => prev.filter((id) => id !== articleId));
      }
    },
    [isOnline, syncFromCaches]
  );

  const removeArticleFromOffline = useCallback(
    async (articleId: string) => {
      setPendingIds((prev) => (prev.includes(articleId) ? prev : [...prev, articleId]));
      try {
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready.catch(() => null);
          if (reg?.active) {
            reg.active.postMessage({
              type: 'REMOVE_HISTORY_ARTICLE',
              articleId,
            });
          }
        }
        if (typeof caches !== 'undefined') {
          const cache = await caches.open(HISTORY_CACHE_NAME);
          await cache.delete(`/api/history-articles?id=${encodeURIComponent(articleId)}`);
        }
        const nextIds = await syncFromCaches();
        broadcastCachedIds(nextIds);
      } finally {
        setPendingIds((prev) => prev.filter((id) => id !== articleId));
      }
    },
    [syncFromCaches]
  );

  const saveAllArticlesForOffline = useCallback(
    async (articleIds: string[], coverImages: string[] = []) => {
      if (!isOnline || cachingAll || articleIds.length === 0) return false;
      setCachingAll(true);
      const extraUrls = collectCurrentHistoryAssets(coverImages);

      try {
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready.catch(() => null);
          if (reg?.active) {
            reg.active.postMessage({
              type: 'CACHE_ALL_HISTORY_ARTICLES',
              articleIds,
              urls: extraUrls,
            });
          }
        }

        if (typeof caches !== 'undefined') {
          const [historyCache, pagesCache, assetsCache] = await Promise.all([
            caches.open(HISTORY_CACHE_NAME),
            caches.open(PAGES_CACHE_NAME),
            caches.open(ASSETS_CACHE_NAME),
          ]);

          await Promise.all([
            ...articleIds.map(async (id) => {
              const apiUrl = `/api/history-articles?id=${encodeURIComponent(id)}`;
              try {
                const res = await fetch(apiUrl, { credentials: 'same-origin' });
                if (res.ok) await historyCache.put(apiUrl, res.clone());
              } catch {
                // Skip individual failure
              }
            }),
            ...extraUrls.map(async (u) => {
              try {
                const res = await fetch(u, { credentials: 'same-origin' });
                if (res.ok) {
                  const targetCache = u === '/histoire' ? pagesCache : assetsCache;
                  await targetCache.put(u, res.clone());
                }
              } catch {
                // Skip individual failure
              }
            }),
          ]);
        }

        const nextIds = await syncFromCaches();
        broadcastCachedIds(nextIds);
        return true;
      } catch {
        return false;
      } finally {
        setCachingAll(false);
      }
    },
    [cachingAll, isOnline, syncFromCaches]
  );

  const loadCachedArticle = useCallback(
    async (articleId: string): Promise<OfflineHistoryArticlePayload | null> => {
      const apiUrl = `/api/history-articles?id=${encodeURIComponent(articleId)}`;
      try {
        if (typeof caches !== 'undefined') {
          const cache = await caches.open(HISTORY_CACHE_NAME);
          const cachedRes = await cache.match(apiUrl);
          if (cachedRes) {
            const json = (await cachedRes.json()) as {
              article?: OfflineHistoryArticlePayload;
            };
            if (json?.article) return json.article;
          }
        }
        const netRes = await fetch(apiUrl, { credentials: 'same-origin' });
        if (netRes.ok) {
          const json = (await netRes.json()) as {
            article?: OfflineHistoryArticlePayload;
          };
          return json?.article ?? null;
        }
      } catch {
        // Offline & uncached fallback handled by caller
      }
      return null;
    },
    []
  );

  return {
    isOnline,
    cachedIds,
    cachingAll,
    isArticleOfflineReady,
    isArticlePending,
    saveArticleForOffline,
    removeArticleFromOffline,
    saveAllArticlesForOffline,
    loadCachedArticle,
  };
}
