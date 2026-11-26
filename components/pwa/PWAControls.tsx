'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import {
  Download,
  Smartphone,
  WifiOff,
  X,
  HardDriveDownload,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { NavActionTooltip } from '@/components/layout/NavActionTooltip';
import { DESTINATIONS } from '@/data/destinations';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function subscribeOnline(cb: () => void) {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
}

function getOnlineSnapshot() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

function getOnlineServerSnapshot() {
  return true;
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getOnlineServerSnapshot);
}

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => reg.update().catch(() => undefined))
        .catch(() => undefined);
    }
  }, []);
  return null;
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { t } = useApp();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="no-print fixed bottom-4 start-4 z-50 flex items-center gap-2 rounded-md bg-[#103B50] border border-[#C47B55] px-3.5 py-2 text-xs font-medium text-[#F4EFE5] shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#C47B55] shrink-0" />
      <span>{t('pwa.offlineBanner')}</span>
    </div>
  );
}

export function PWAInstallButton({
  compact = false,
  headerMinimal = false,
}: {
  compact?: boolean;
  headerMinimal?: boolean;
}) {
  const { t } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsInstalled(standalone);
      const ua = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(ua));
    });

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      active = false;
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (deferredPrompt) {
    if (headerMinimal) {
      return (
        <div className="relative hidden md:inline-flex items-center">
          <button
            type="button"
            onClick={handleInstall}
            aria-label={t('pwa.installApp')}
            aria-describedby="tooltip-nav-pwa"
            className="peer nav-action-button"
          >
            <Download className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
          </button>
          <NavActionTooltip id="tooltip-nav-pwa" label={t('pwa.installApp')} />
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={handleInstall}
        aria-label={t('pwa.installApp')}
        title={t('pwa.installApp')}
        className={`inline-flex items-center gap-1.5 rounded-md border border-[#087E9B]/30 bg-[#FAF8F3] hover:bg-[#087E9B] text-[#103B50] hover:text-white transition-colors whitespace-nowrap shrink-0 ${
          compact ? 'px-2.5 py-1.5 text-xs font-medium' : 'px-3 py-1.5 text-xs font-medium'
        }`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
        <span>{t('pwa.installApp')}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <div className={headerMinimal ? 'relative hidden md:inline-flex items-center' : 'inline-flex'}>
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            aria-label={t('pwa.installIOS')}
            aria-describedby={headerMinimal ? 'tooltip-nav-pwa-ios' : undefined}
            title={headerMinimal ? undefined : t('pwa.installIOS')}
            className={
              headerMinimal
                ? 'peer nav-action-button'
                : 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#103B50]/20 bg-[#FAF8F3] text-xs font-medium text-[#103B50] hover:bg-[#F4EFE5] transition-colors whitespace-nowrap shrink-0'
            }
          >
            <Smartphone className={headerMinimal ? 'w-[18px] h-[18px] shrink-0' : 'w-3.5 h-3.5 shrink-0'} strokeWidth={2} />
            {!headerMinimal && <span>{t('pwa.installIOS')}</span>}
          </button>
          {headerMinimal && (
            <NavActionTooltip id="tooltip-nav-pwa-ios" label={t('pwa.installIOS')} />
          )}
        </div>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('pwa.iosGuideTitle')}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#103B50]/50 p-4"
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="w-full max-w-sm rounded-lg bg-white border border-[#103B50]/15 p-6 shadow-xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-lg font-semibold text-[#103B50]">
                  {t('pwa.iosGuideTitle')}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={t('common.close')}
                  className="p-1 text-[#51636D] hover:text-[#103B50]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-[#51636D] leading-relaxed">{t('pwa.iosGuideBody')}</p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-[#103B50] text-white text-sm font-medium rounded-md hover:bg-[#087E9B] transition-colors"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

const OFFLINE_PACK_STORAGE_KEY = 'bejaia_offline_pack_ready_v2';

export function OfflinePackButton({ compact = false }: { compact?: boolean }) {
  const { t } = useApp();
  const isOnline = useOnlineStatus();
  const [caching, setCaching] = useState(false);
  const [progress, setProgress] = useState<{ cached: number; total: number } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        if (window.localStorage.getItem(OFFLINE_PACK_STORAGE_KEY) === '1') {
          setReady(true);
        }
      } catch {
        // Ignore storage errors
      }
    });
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data as
        | { type?: string; cached?: number; total?: number; done?: boolean }
        | undefined;
      if (data?.type === 'OFFLINE_CACHE_PROGRESS') {
        const cached = data.cached ?? 0;
        const total = data.total ?? 31;
        setProgress({ cached, total });
        if (data.done) {
          setCaching(false);
          setReady(true);
          try {
            window.localStorage.setItem(OFFLINE_PACK_STORAGE_KEY, '1');
          } catch {
            // Ignore storage errors
          }
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const handlePrepareOffline = async () => {
    if (!isOnline || caching) return;
    setCaching(true);
    const totalTargets = DESTINATIONS.length + 3;
    setProgress({ cached: 0, total: totalTargets });

    try {
      const reg =
        typeof navigator !== 'undefined' && 'serviceWorker' in navigator
          ? await navigator.serviceWorker.ready
          : null;

      if (reg?.active) {
        reg.active.postMessage({ type: 'CACHE_ALL_TRAVEL_PAGES' });
        return;
      }

      // Direct Cache Storage fallback if SW controller is still initializing
      if (typeof caches !== 'undefined') {
        const cache = await caches.open('bejaia-pages-v5');
        const routes = [
          '/destinations',
          '/carte',
          '/circuits',
          ...DESTINATIONS.map((d) => `/destinations/${d.slug}`),
        ];
        let done = 0;
        for (const r of routes) {
          try {
            const res = await fetch(r, { credentials: 'same-origin' });
            if (res.ok) await cache.put(r, res.clone());
          } catch {
            // Skip failed item
          }
          done += 1;
          setProgress({ cached: done, total: routes.length });
        }
        setReady(true);
        try {
          window.localStorage.setItem(OFFLINE_PACK_STORAGE_KEY, '1');
        } catch {
          // Ignore storage errors
        }
      }
    } finally {
      // If handled by fallback directly, turn off spinner
      setCaching((prev) => {
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
          return prev;
        }
        return false;
      });
    }
  };

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => void handlePrepareOffline()}
        disabled={!isOnline || caching}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-md border text-xs font-medium transition-colors disabled:opacity-55 ${
          ready
            ? 'bg-[#356B50]/10 border-[#356B50]/35 text-[#356B50] hover:bg-[#356B50]/15'
            : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
        } ${compact ? 'px-3 py-2' : 'px-3.5 py-2.5'}`}
      >
        {caching ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#087E9B] shrink-0" />
            <span className="tabular-nums">
              {t('pwa.offlinePackProgress')} ({progress?.cached ?? 0}/{progress?.total ?? 31})
            </span>
          </>
        ) : ready ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#356B50] shrink-0" />
            <span>{t('pwa.offlinePackReady')}</span>
          </>
        ) : (
          <>
            <HardDriveDownload className="w-3.5 h-3.5 text-[#087E9B] shrink-0" />
            <span>{t('pwa.offlinePackBtn')}</span>
          </>
        )}
      </button>
      {!compact && <p className="text-[11px] text-[#51636D] leading-snug">{t('pwa.offlinePackDesc')}</p>}
    </div>
  );
}
