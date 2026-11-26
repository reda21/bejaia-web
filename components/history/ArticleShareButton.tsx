'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Smartphone,
  X,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';

export type HistoryShareTab = 'timeline' | 'figures' | 'medina' | 'nature';

interface ArticleShareButtonProps {
  tab: HistoryShareTab;
  anchorId: string;
  title: string;
  kicker?: string;
  excerpt: string;
  inverted?: boolean;
}

const FALLBACK_ORIGIN = 'https://bejaia-explorer.dz';

function buildExcerptSnippet(raw: string, maxLength = 220): string {
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  const sliced = cleaned.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 120 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

export function ArticleShareButton({
  tab,
  anchorId,
  title,
  kicker,
  excerpt,
  inverted = false,
}: ArticleShareButtonProps) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const [copiedMode, setCopiedMode] = useState<'none' | 'link' | 'excerpt'>('none');
  const [origin, setOrigin] = useState(FALLBACK_ORIGIN);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    queueMicrotask(() => {
      setOrigin(window.location.origin);
      setCanNativeShare(
        typeof navigator !== 'undefined' && typeof navigator.share === 'function'
      );
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const encodedAnchor = encodeURIComponent(anchorId);
  const deepLinkUrl = `${origin}/histoire?tab=${tab}&section=${encodedAnchor}#${encodedAnchor}`;
  const snippet = buildExcerptSnippet(excerpt);
  const fullTitle = kicker ? `${title} (${kicker})` : title;
  const shareText = `« ${snippet} » — ${fullTitle} · ${t('share.historyPrefix')}`;
  const sharePayload = `${shareText}\n${deepLinkUrl}`;

  const encodedUrl = encodeURIComponent(deepLinkUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedPayload = encodeURIComponent(sharePayload);
  const encodedSubject = encodeURIComponent(`${title} · ${t('share.historyPrefix')}`);

  const socialChannels = [
    {
      id: 'whatsapp',
      label: t('share.whatsapp'),
      href: `https://wa.me/?text=${encodedPayload}`,
      icon: MessageCircle,
      accentClass: 'text-[#1E7E45] border-[#1E7E45]/25 hover:bg-[#1E7E45]/10',
    },
    {
      id: 'facebook',
      label: t('share.facebook'),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      icon: Globe,
      accentClass: 'text-[#1877F2] border-[#1877F2]/25 hover:bg-[#1877F2]/10',
    },
    {
      id: 'x',
      label: t('share.xTwitter'),
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: Share2,
      accentClass: 'text-[#103B50] border-[#103B50]/20 hover:bg-[#F4EFE5]',
    },
    {
      id: 'linkedin',
      label: t('share.linkedin'),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Globe,
      accentClass: 'text-[#0A66C2] border-[#0A66C2]/25 hover:bg-[#0A66C2]/10',
    },
    {
      id: 'telegram',
      label: t('share.telegram'),
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: Send,
      accentClass: 'text-[#0088CC] border-[#0088CC]/25 hover:bg-[#0088CC]/10',
    },
    {
      id: 'email',
      label: t('share.email'),
      href: `mailto:?subject=${encodedSubject}&body=${encodedPayload}`,
      icon: Mail,
      accentClass: 'text-[#103B50] border-[#103B50]/20 hover:bg-[#F4EFE5]',
    },
  ];

  const copyToClipboard = async (value: string, mode: 'link' | 'excerpt') => {
    let success = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        success = true;
      } catch {
        success = false;
      }
    }
    if (!success && typeof document !== 'undefined') {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = value;
        tempInput.setAttribute('readonly', '');
        tempInput.className = 'fixed -top-full opacity-0';
        document.body.appendChild(tempInput);
        tempInput.select();
        success = document.execCommand('copy');
        document.body.removeChild(tempInput);
      } catch {
        success = false;
      }
    }
    if (success) {
      setCopiedMode(mode);
      window.setTimeout(() => setCopiedMode('none'), 2400);
    }
  };

  const handleNativeShare = async () => {
    if (!canNativeShare || typeof navigator === 'undefined') return;
    try {
      await navigator.share({
        title: fullTitle,
        text: shareText,
        url: deepLinkUrl,
      });
      setOpen(false);
    } catch {
      // User cancelled native share sheet
    }
  };

  const triggerBaseClass = open
    ? 'bg-[#103B50] border-[#103B50] text-white'
    : inverted
      ? 'bg-transparent border-white/25 text-current hover:bg-white/10'
      : 'bg-[#FAF8F3] hover:bg-[#103B50] text-[#103B50] hover:text-white border-[#103B50]/15';

  return (
    <div ref={containerRef} className="no-print relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={t('share.historyPanelTitle')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${triggerBaseClass}`}
      >
        <Share2 className="w-3.5 h-3.5 shrink-0" />
        <span>{t('share.buttonLabel')}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t('share.historyPanelTitle')}
          className="absolute end-0 mt-2 z-50 w-[min(92vw,360px)] bg-white border border-[#103B50]/15 rounded-lg shadow-xl p-4 space-y-3.5 text-start"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-base font-semibold text-[#103B50] leading-snug">
                {t('share.historyPanelTitle')}
              </h3>
              <p className="text-xs text-[#51636D] mt-0.5 leading-relaxed">
                {t('share.historyPanelSubtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('common.close')}
              className="p-1 text-[#51636D] hover:text-[#103B50] rounded transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quoted Encyclopedia Excerpt Preview */}
          <div className="p-3 rounded-md bg-[#FAF8F3] border border-[#103B50]/12 space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#C47B55]">
              {t('share.excerptLabel')}
            </p>
            <p className="text-xs font-serif italic text-[#102530]/90 leading-relaxed line-clamp-3">
              « {snippet} »
            </p>
          </div>

          {/* Deep Link Copy Bar */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-1.5 bg-[#FAF8F3] border border-[#103B50]/12 rounded-md">
              <span
                dir="ltr"
                className="flex-1 truncate text-[11px] text-[#51636D] px-2 font-mono"
                title={deepLinkUrl}
              >
                {deepLinkUrl}
              </span>
              <button
                type="button"
                onClick={() => void copyToClipboard(deepLinkUrl, 'link')}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${
                  copiedMode === 'link'
                    ? 'bg-[#356B50] text-white'
                    : 'bg-[#103B50] hover:bg-[#087E9B] text-white'
                }`}
              >
                {copiedMode === 'link' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedMode === 'link' ? t('share.copied') : t('share.copyLink')}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => void copyToClipboard(sharePayload, 'excerpt')}
              className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                copiedMode === 'excerpt'
                  ? 'bg-[#356B50] border-[#356B50] text-white'
                  : 'bg-[#FAF8F3] hover:bg-[#F4EFE5] border-[#103B50]/12 text-[#103B50]'
              }`}
            >
              {copiedMode === 'excerpt' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>
                {copiedMode === 'excerpt' ? t('share.copied') : t('share.copyExcerptLink')}
              </span>
            </button>
          </div>

          {/* Native Web Share Sheet when supported */}
          {canNativeShare && (
            <button
              type="button"
              onClick={() => void handleNativeShare()}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-md bg-[#087E9B] hover:bg-[#103B50] text-white text-xs font-medium transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t('share.nativeShare')}</span>
            </button>
          )}

          {/* Social Networks with Deep Links */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#51636D]">
              {t('share.messagingLabel')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {socialChannels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={`inline-flex items-center justify-between gap-2 px-2.5 py-2 rounded-md border text-xs font-medium transition-colors bg-[#FAF8F3] ${channel.accentClass}`}
                  >
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{channel.label}</span>
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
