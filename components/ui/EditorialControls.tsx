'use client';

import React from 'react';
import { BookOpen, Eye, Printer, Type } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import type { ReaderPreferences } from '@/types';

const FONT_SCALES: { key: ReaderPreferences['fontScale']; labelKey: string }[] = [
  { key: 'standard', labelKey: 'reader.sizeStandard' },
  { key: 'comfort', labelKey: 'reader.sizeComfort' },
  { key: 'large', labelKey: 'reader.sizeLarge' },
];

export function getProseSizeClass(scale: ReaderPreferences['fontScale']): string {
  if (scale === 'comfort') return 'text-[17px] leading-[1.82]';
  if (scale === 'large') return 'text-[19px] leading-[1.85]';
  return 'text-base leading-[1.78]';
}

export function EditorialControls({ showPrint = true }: { showPrint?: boolean }) {
  const { t, readerPrefs, setReaderPrefs } = useApp();

  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-3 py-3 px-4 bg-[#FAF8F3] border border-[#103B50]/10 rounded-md text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[#51636D] font-medium me-1">
          <Type className="w-3.5 h-3.5 text-[#087E9B]" />
          <span>{t('reader.textSize')}</span>
        </span>
        <div
          role="group"
          aria-label={t('reader.textSize')}
          className="inline-flex items-center bg-white border border-[#103B50]/12 rounded p-0.5"
        >
          {FONT_SCALES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setReaderPrefs({ fontScale: item.key })}
              className={`px-2.5 py-1 rounded transition-colors ${
                readerPrefs.fontScale === item.key
                  ? 'bg-[#103B50] text-white font-medium'
                  : 'text-[#51636D] hover:text-[#103B50]'
              }`}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setReaderPrefs({ readerMode: !readerPrefs.readerMode })}
          aria-pressed={readerPrefs.readerMode}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors ${
            readerPrefs.readerMode
              ? 'bg-[#356B50] border-[#356B50] text-white font-medium'
              : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
          }`}
        >
          {readerPrefs.readerMode ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <BookOpen className="w-3.5 h-3.5 text-[#087E9B]" />
          )}
          <span>
            {readerPrefs.readerMode ? t('reader.exitReaderMode') : t('reader.readerMode')}
          </span>
        </button>

        {showPrint && (
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#103B50]/15 bg-white text-[#103B50] hover:bg-[#F4EFE5] transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#087E9B]" />
            <span>{t('detail.printSheet')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
