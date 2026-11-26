'use client';

import React from 'react';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  HardDriveDownload,
  Loader2,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { useHistoryBookmarks } from '@/hooks/useHistoryBookmarks';
import { useHistoryOffline } from '@/hooks/useHistoryOffline';
import type { HistorySectionKind } from '@/types';

interface ArticleSaveActionsProps {
  articleId: string;
  kind: HistorySectionKind;
  coverImageSrc?: string;
  compact?: boolean;
  inverted?: boolean;
}

export function ArticleSaveActions({
  articleId,
  kind,
  coverImageSrc,
  compact = true,
  inverted = false,
}: ArticleSaveActionsProps) {
  const { t } = useApp();
  const { isBookmarked, toggleBookmark } = useHistoryBookmarks();
  const {
    isOnline,
    isArticleOfflineReady,
    isArticlePending,
    saveArticleForOffline,
    removeArticleFromOffline,
  } = useHistoryOffline();

  const bookmarked = isBookmarked(articleId);
  const offlineReady = isArticleOfflineReady(articleId);
  const pending = isArticlePending(articleId);

  const handleOfflineClick = async () => {
    if (pending) return;
    if (offlineReady) {
      if (!isOnline) return;
      await removeArticleFromOffline(articleId);
    } else {
      await saveArticleForOffline(articleId, coverImageSrc);
    }
  };

  const baseNeutralClass = inverted
    ? 'bg-transparent border-white/25 text-current hover:bg-white/10'
    : 'bg-[#FAF8F3] hover:bg-[#103B50] text-[#103B50] hover:text-white border-[#103B50]/15';

  const padClass = compact ? 'px-2.5 py-1.5' : 'px-3 py-2';

  return (
    <div className="no-print inline-flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={() => toggleBookmark(articleId, kind)}
        aria-pressed={bookmarked}
        title={bookmarked ? t('historyPage.bookmarkSaved') : t('historyPage.bookmarkAdd')}
        className={`inline-flex items-center gap-1.5 ${padClass} rounded-md border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
          bookmarked
            ? 'bg-[#A45834] border-[#A45834] text-white hover:bg-[#8E4A2A]'
            : baseNeutralClass
        }`}
      >
        {bookmarked ? (
          <BookmarkCheck className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Bookmark className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>
          {bookmarked ? t('historyPage.bookmarkSaved') : t('historyPage.bookmarkAdd')}
        </span>
      </button>

      <button
        type="button"
        onClick={() => void handleOfflineClick()}
        disabled={pending || !isOnline}
        aria-pressed={offlineReady}
        title={
          offlineReady
            ? isOnline
              ? `${t('historyPage.offlineReady')} — ${t('historyPage.offlineRemove')}`
              : t('historyPage.offlineReady')
            : t('historyPage.offlineSave')
        }
        className={`inline-flex items-center gap-1.5 ${padClass} rounded-md border text-xs font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-60 ${
          offlineReady
            ? 'bg-[#356B50]/12 border-[#356B50]/40 text-[#356B50] hover:bg-[#356B50]/20'
            : baseNeutralClass
        }`}
      >
        {pending ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>{t('historyPage.offlineSaving')}</span>
          </>
        ) : offlineReady ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{t('historyPage.offlineReady')}</span>
          </>
        ) : (
          <>
            <HardDriveDownload className="w-3.5 h-3.5 shrink-0" />
            <span>{t('historyPage.offlineSave')}</span>
          </>
        )}
      </button>
    </div>
  );
}
