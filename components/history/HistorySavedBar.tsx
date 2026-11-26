'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HardDriveDownload,
  Loader2,
  Trash2,
  WifiOff,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { useHistoryBookmarks } from '@/hooks/useHistoryBookmarks';
import { useHistoryOffline } from '@/hooks/useHistoryOffline';
import {
  buildAllHistoryArticlePayloads,
  getHistoryTabForKind,
} from '@/services/historyArticlesService';
import type { HistorySectionKind, OfflineHistoryArticlePayload } from '@/types';

interface HistorySavedBarProps {
  onNavigateToSection: (
    tab: 'timeline' | 'figures' | 'medina' | 'nature',
    anchorSlug: string
  ) => void;
  onOpenOfflineArticle: (payload: OfflineHistoryArticlePayload) => void;
}

export function HistorySavedBar({
  onNavigateToSection,
  onOpenOfflineArticle,
}: HistorySavedBarProps) {
  const { t, lt } = useApp();
  const { bookmarks, removeBookmark, clearBookmarks } = useHistoryBookmarks();
  const {
    isOnline,
    cachedIds,
    cachingAll,
    saveAllArticlesForOffline,
    removeArticleFromOffline,
    loadCachedArticle,
  } = useHistoryOffline();

  const [openPanel, setOpenPanel] = useState<'none' | 'bookmarks' | 'offline'>('none');
  const [openingId, setOpeningId] = useState<string | null>(null);

  const allArticles = useMemo(() => buildAllHistoryArticlePayloads(), []);
  const articleMap = useMemo(() => {
    const map = new Map<string, OfflineHistoryArticlePayload>();
    for (const item of allArticles) {
      map.set(item.id, item);
    }
    return map;
  }, [allArticles]);

  const kindLabel = (kind: HistorySectionKind) => {
    if (kind === 'era') return t('historyPage.kindEra');
    if (kind === 'figure') return t('historyPage.kindFigure');
    if (kind === 'medina') return t('historyPage.kindMedina');
    return t('historyPage.kindNature');
  };

  const resolvedBookmarks = useMemo(
    () =>
      bookmarks
        .map((entry) => ({
          entry,
          article: articleMap.get(entry.id),
        }))
        .filter((item): item is { entry: typeof bookmarks[number]; article: OfflineHistoryArticlePayload } =>
          Boolean(item.article)
        ),
    [articleMap, bookmarks]
  );

  const resolvedOfflineArticles = useMemo(
    () =>
      cachedIds
        .map((id) => articleMap.get(id))
        .filter((item): item is OfflineHistoryArticlePayload => Boolean(item)),
    [articleMap, cachedIds]
  );

  const allCached = allArticles.length > 0 && resolvedOfflineArticles.length >= allArticles.length;

  const handleSaveAll = async () => {
    const ids = allArticles.map((a) => a.id);
    const images = Array.from(
      new Set(allArticles.map((a) => a.coverImage?.src).filter((s): s is string => Boolean(s)))
    );
    await saveAllArticlesForOffline(ids, images);
  };

  const handleOpenCached = async (article: OfflineHistoryArticlePayload) => {
    setOpeningId(article.id);
    try {
      const fromCache = await loadCachedArticle(article.id);
      onOpenOfflineArticle(fromCache ?? article);
    } finally {
      setOpeningId(null);
    }
  };

  const showOfflinePanel = openPanel === 'offline' || (!isOnline && resolvedOfflineArticles.length > 0);

  return (
    <section
      aria-label={`${t('historyPage.bookmarksTitle')} & ${t('historyPage.offlineLibraryTitle')}`}
      className="no-print space-y-3"
    >
      {/* Compact Utility Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenPanel((p) => (p === 'bookmarks' ? 'none' : 'bookmarks'))}
            aria-expanded={openPanel === 'bookmarks'}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              openPanel === 'bookmarks'
                ? 'bg-[#A45834] border-[#A45834] text-white'
                : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 shrink-0" />
            <span>
              {t('historyPage.bookmarksTitle')} ({resolvedBookmarks.length})
            </span>
            {openPanel === 'bookmarks' ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setOpenPanel((p) => (p === 'offline' ? 'none' : 'offline'))}
            aria-expanded={showOfflinePanel}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              showOfflinePanel
                ? 'bg-[#356B50] border-[#356B50] text-white'
                : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
            }`}
          >
            <HardDriveDownload className="w-3.5 h-3.5 shrink-0" />
            <span className="tabular-nums">
              {t('historyPage.offlineLibraryTitle')} ({resolvedOfflineArticles.length}/{allArticles.length})
            </span>
            {openPanel === 'offline' ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => void handleSaveAll()}
          disabled={!isOnline || cachingAll || allCached}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border text-xs font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-65 ${
            allCached
              ? 'bg-[#356B50]/10 border-[#356B50]/35 text-[#356B50]'
              : 'bg-[#103B50] hover:bg-[#087E9B] border-[#103B50] text-white'
          }`}
        >
          {cachingAll ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>{t('historyPage.offlineSaving')}</span>
            </>
          ) : allCached ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{t('historyPage.offlineAllReady')}</span>
            </>
          ) : (
            <>
              <HardDriveDownload className="w-3.5 h-3.5 shrink-0" />
              <span>{t('historyPage.offlineSaveAll')}</span>
            </>
          )}
        </button>
      </div>

      {/* Persistent Bookmarks Drawer Panel */}
      {openPanel === 'bookmarks' && (
        <div className="bg-white border border-[#103B50]/12 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-lg font-semibold text-[#103B50] inline-flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#C47B55]" />
              <span>{t('historyPage.bookmarksTitle')}</span>
            </h2>
            {resolvedBookmarks.length > 0 && (
              <button
                type="button"
                onClick={clearBookmarks}
                className="text-xs font-medium text-[#51636D] hover:text-[#C47B55] transition-colors"
              >
                {t('historyPage.bookmarksClear')}
              </button>
            )}
          </div>

          {resolvedBookmarks.length === 0 ? (
            <p className="text-sm text-[#51636D] leading-relaxed">
              {t('historyPage.bookmarksEmpty')}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resolvedBookmarks.map(({ entry, article }) => {
                const targetTab = getHistoryTabForKind(entry.kind);
                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-md bg-[#FAF8F3] border border-[#103B50]/10 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-[11px] font-medium text-[#C47B55]">
                        {kindLabel(entry.kind)} · {lt(article.kicker)}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateToSection(targetTab, article.slug);
                          setOpenPanel('none');
                        }}
                        className="text-start font-serif text-base font-semibold text-[#103B50] hover:text-[#087E9B] transition-colors leading-snug block"
                      >
                        {lt(article.title)}
                      </button>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateToSection(targetTab, article.slug);
                          setOpenPanel('none');
                        }}
                        aria-label={`${t('historyPage.bookmarksJump')} : ${lt(article.title)}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white border border-[#103B50]/12 text-xs font-medium text-[#103B50] hover:bg-[#F4EFE5] transition-colors"
                      >
                        <span>{t('historyPage.bookmarksJump')}</span>
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBookmark(entry.id)}
                        aria-label={t('historyPage.bookmarksRemove')}
                        className="p-1.5 rounded text-[#51636D] hover:text-[#C47B55] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Service Worker Offline Reading Library Panel */}
      {showOfflinePanel && (
        <div className="bg-white border border-[#103B50]/12 rounded-lg p-5 space-y-4">
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-semibold text-[#103B50] inline-flex items-center gap-2">
              <HardDriveDownload className="w-4 h-4 text-[#356B50]" />
              <span>{t('historyPage.offlineLibraryTitle')}</span>
            </h2>
            <p className="text-xs text-[#51636D] leading-relaxed">
              {t('historyPage.offlineLibraryDesc')}
            </p>
          </div>

          {!isOnline && (
            <div className="p-3 rounded-md bg-[#FAF8F3] border border-[#C47B55]/40 flex items-center gap-2 text-xs font-medium text-[#103B50]">
              <WifiOff className="w-4 h-4 text-[#C47B55] shrink-0" />
              <span>{t('historyPage.offlineActiveNotice')}</span>
            </div>
          )}

          {resolvedOfflineArticles.length === 0 ? (
            <p className="text-sm text-[#51636D] leading-relaxed">
              {t('historyPage.offlineLibraryEmpty')}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resolvedOfflineArticles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 rounded-md bg-[#FAF8F3] border border-[#103B50]/10 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-[11px] font-medium text-[#356B50]">
                      {kindLabel(article.kind)} · {lt(article.kicker)}
                    </p>
                    <p className="font-serif text-base font-semibold text-[#103B50] leading-snug">
                      {lt(article.title)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => void handleOpenCached(article)}
                      disabled={openingId === article.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#103B50] hover:bg-[#087E9B] text-white text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      <BookOpenText className="w-3.5 h-3.5" />
                      <span>{t('historyPage.offlineOpenReader')}</span>
                    </button>
                    {isOnline && (
                      <button
                        type="button"
                        onClick={() => void removeArticleFromOffline(article.id)}
                        aria-label={t('historyPage.offlineRemove')}
                        className="p-1.5 rounded text-[#51636D] hover:text-[#C47B55] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
