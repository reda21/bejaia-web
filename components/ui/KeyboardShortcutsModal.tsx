'use client';

import React, { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import type { Locale } from '@/types';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
}

const COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    close: string;
    items: { keys: string[]; label: string }[];
  }
> = {
  fr: {
    title: 'Raccourcis clavier',
    subtitle: 'Navigation rapide dans Béjaïa Explorer',
    close: 'Fermer',
    items: [
      { keys: ['S'], label: 'Ouvrir la recherche (ou Ctrl+K)' },
      { keys: ['F'], label: 'Ouvrir les favoris / carnet (ou Alt+F)' },
      { keys: ['M'], label: 'Aller à la carte interactive' },
      { keys: ['I'], label: 'Mon itinéraire (ou Alt+I)' },
      { keys: ['Alt', 'T'], label: 'Changer de thème (clair / sombre)' },
      { keys: ['Alt', 'L'], label: 'Changer de langue (FR / AR / KAB)' },
      { keys: ['Shift', '?'], label: 'Afficher ou masquer cette aide' },
    ],
  },
  ar: {
    title: 'اختصارات لوحة المفاتيح',
    subtitle: 'تنقّل سريع داخل مستكشف بجاية',
    close: 'إغلاق',
    items: [
      { keys: ['S'], label: 'فتح البحث (أو Ctrl+K)' },
      { keys: ['F'], label: 'فتح المفضلة (أو Alt+F)' },
      { keys: ['M'], label: 'الانتقال إلى الخريطة التفاعلية' },
      { keys: ['I'], label: 'مساري (أو Alt+I)' },
      { keys: ['Alt', 'T'], label: 'تبديل المظهر (فاتح / داكن)' },
      { keys: ['Alt', 'L'], label: 'تغيير اللغة (FR / AR / KAB)' },
      { keys: ['Shift', '?'], label: 'إظهار أو إخفاء هذه النافذة' },
    ],
  },
  kab: {
    title: 'Inegzumen n unasiw',
    subtitle: 'Tunigin tuzribt di Bgayet Explorer',
    close: 'Mdel',
    items: [
      { keys: ['S'], label: 'Ldi anadi (neɣ Ctrl+K)' },
      { keys: ['F'], label: 'Ldi imenyifen (neɣ Alt+F)' },
      { keys: ['M'], label: 'Ddu ɣer tkarḍa tamyigawt' },
      { keys: ['I'], label: 'Abrid-iw (neɣ Alt+I)' },
      { keys: ['Alt', 'T'], label: 'Beddel asentel (afaw / aberkan)' },
      { keys: ['Alt', 'L'], label: 'Beddel tutlayt (FR / AR / KAB)' },
      { keys: ['Shift', '?'], label: 'Sken neɣ ffer tallalt-a' },
    ],
  },
};

export function KeyboardShortcutsModal({
  open,
  onClose,
  locale,
}: KeyboardShortcutsModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const content = COPY[locale] ?? COPY.fr;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      onClick={onClose}
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-[#103B50]/45 backdrop-blur-[2px] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-[#103B50]/15 bg-white dark:bg-[#10222E] dark:border-white/15 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#103B50]/10 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#C47B55]/15 text-[#C47B55]">
              <Keyboard className="w-4 h-4" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-[#103B50] dark:text-white leading-tight">
                {content.title}
              </h2>
              <p className="text-[11px] text-[#51636D] dark:text-slate-400">
                {content.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={content.close}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#51636D] hover:text-[#103B50] hover:bg-[#F4EFE5] dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <ul className="divide-y divide-[#103B50]/8 dark:divide-white/8 px-5 py-2">
          {content.items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 py-2.5 text-xs"
            >
              <span className="text-[#103B50]/90 dark:text-slate-200">{item.label}</span>
              <span className="inline-flex items-center gap-1 shrink-0">
                {item.keys.map((k, idx) => (
                  <React.Fragment key={k}>
                    {idx > 0 && (
                      <span className="text-[10px] text-[#51636D] dark:text-slate-400">+</span>
                    )}
                    <kbd className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded border border-[#103B50]/15 bg-[#F4EFE5] text-[#103B50] dark:border-white/15 dark:bg-white/10 dark:text-white">
                      {k}
                    </kbd>
                  </React.Fragment>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
