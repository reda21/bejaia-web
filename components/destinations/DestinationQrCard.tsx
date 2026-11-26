'use client';

import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Volume2, FileText } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';

interface DestinationQrCardProps {
  slug: string;
  title: string;
  hasAudioGuide: boolean;
}

const DEFAULT_ORIGIN = 'https://bejaia-explorer.dz';

export function DestinationQrCard({
  slug,
  title,
  hasAudioGuide,
}: DestinationQrCardProps) {
  const { t } = useApp();
  const [origin, setOrigin] = useState(DEFAULT_ORIGIN);
  const [mode, setMode] = useState<'page' | 'audio'>('page');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active && typeof window !== 'undefined' && window.location.origin) {
        setOrigin(window.location.origin);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const targetUrl = useMemo(() => {
    const base = `${origin}/destinations/${slug}`;
    return mode === 'audio' && hasAudioGuide ? `${base}#audioguide` : base;
  }, [origin, slug, mode, hasAudioGuide]);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(targetUrl, {
      width: 240,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#103B50',
        light: '#FFFFFF',
      },
    })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [targetUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `bejaia-explorer-${slug}${mode === 'audio' ? '-audioguide' : ''}-qr.png`;
    link.click();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <section
      aria-label={t('qrCode.title')}
      className="bg-white border border-[#103B50]/12 rounded-lg p-5 space-y-4"
    >
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#087E9B] inline-flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5" />
          <span>{t('qrCode.kicker')}</span>
        </p>
        <h3 className="font-serif text-lg font-semibold text-[#103B50]">
          {t('qrCode.title')}
        </h3>
        <p className="text-xs text-[#51636D] leading-relaxed">{t('qrCode.subtitle')}</p>
      </div>

      {hasAudioGuide && (
        <div className="no-print grid grid-cols-2 gap-1 p-1 bg-[#FAF8F3] border border-[#103B50]/10 rounded-md">
          <button
            type="button"
            onClick={() => setMode('page')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${
              mode === 'page'
                ? 'bg-[#103B50] text-white'
                : 'text-[#51636D] hover:text-[#103B50]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t('qrCode.modePage')}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('audio')}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${
              mode === 'audio'
                ? 'bg-[#C47B55] text-white'
                : 'text-[#51636D] hover:text-[#103B50]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('qrCode.modeAudio')}</span>
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center p-4 bg-[#FAF8F3] border border-[#103B50]/10 rounded-md">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrDataUrl}
            alt={`QR Code — ${title}`}
            width={176}
            height={176}
            className="w-44 h-44 rounded bg-white p-1.5 border border-[#103B50]/10"
          />
        ) : (
          <div className="w-44 h-44 rounded bg-white border border-[#103B50]/10 flex items-center justify-center text-xs text-[#51636D]">
            QR...
          </div>
        )}
        <p className="mt-2.5 text-[11px] font-medium text-[#103B50] text-center truncate max-w-full">
          {title}
        </p>
      </div>

      <div className="no-print grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#103B50] hover:bg-[#087E9B] disabled:opacity-45 text-white text-xs font-medium rounded-md transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('qrCode.downloadPng')}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FAF8F3] hover:bg-[#F4EFE5] border border-[#103B50]/15 text-[#103B50] text-xs font-medium rounded-md transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#356B50]" />
              <span className="text-[#356B50]">{t('qrCode.copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#087E9B]" />
              <span>{t('qrCode.copyLink')}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
