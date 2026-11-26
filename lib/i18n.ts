import frMessages from '@/messages/fr.json';
import arMessages from '@/messages/ar.json';
import kabMessages from '@/messages/kab.json';
import type { Locale, LocalizedText } from '@/types';

type NestedRecord = { [key: string]: string | NestedRecord };

const DICTIONARIES: Record<Locale, NestedRecord> = {
  fr: frMessages as NestedRecord,
  ar: arMessages as NestedRecord,
  kab: kabMessages as NestedRecord,
};

function resolvePath(dict: NestedRecord, keyPath: string): string | undefined {
  const parts = keyPath.split('.');
  let current: string | NestedRecord | undefined = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function translate(locale: Locale, keyPath: string): string {
  const exact = resolvePath(DICTIONARIES[locale], keyPath);
  if (exact) return exact;
  // Verified French fallback when Kabyle translation awaits official linguistic validation
  const fallback = resolvePath(DICTIONARIES.fr, keyPath);
  return fallback ?? keyPath;
}

export function getLocalizedText(text: LocalizedText | undefined, locale: Locale): string {
  if (!text) return '';
  if (locale === 'ar') return text.ar || text.fr;
  if (locale === 'kab') return text.kab || text.fr;
  return text.fr;
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === 'ar';
}
