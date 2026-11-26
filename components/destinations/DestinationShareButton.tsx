'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  PhoneCall,
  Send,
  Globe,
  Mail,
  X,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';

interface DestinationShareButtonProps {
  slug: string;
  title: string;
  commune: string;
  summary: string;
}

const FALLBACK_ORIGIN = 'https://bejaia-explorer.dz';

export function DestinationShareButton({
  slug,
  title,
  commune,
  summary,
}: DestinationShareButtonProps) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState(FALLBACK_ORIGIN);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    queueMicrotask(() => {
      setOrigin(window.location.origin);
      setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
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

  const shareUrl = `${origin}/destinations/${slug}`;
  const shareText = `${t('share.messagePrefix')} ${title} (${commune}) — ${summary}`;
  const sharePayload = `${shareText}\n${shareUrl}`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedPayload = encodeURIComponent(sharePayload);
  const encodedSubject = encodeURIComponent(`${title} · Béjaïa Explorer`);

  const messagingChannels = [
    {
      id: 'whatsapp',
      label: t('share.whatsapp'),
      href: `https://wa.me/?text=${encodedPayload}`,
      icon: MessageCircle,
      accentClass: 'text-[#1E7E45] border-[#1E7E45]/25 hover:bg-[#1E7E45]/10',
    },
    {
      id: 'viber',
      label: t('share.viber'),
      href: `viber://forward?text=${encodedPayload}`,
      icon: PhoneCall,
      accentClass: 'text-[#665CAC] border-[#665CAC]/25 hover:bg-[#665CAC]/10',
    },
    {
      id: 'facebook',
      label: t('share.facebook'),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      icon: Globe,
      accentClass: 'text-[#1877F2] border-[#1877F2]/25 hover:bg-[#1877F2]/10',
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

  const handleCopyLink = async () => {
    let success = false;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success && typeof document !== 'undefined') {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = shareUrl;
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
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    }
  };

  const handleNativeShare = async () => {
    if (!canNativeShare || typeof navigator === 'undefined') return;
    try {
      await navigator.share({
        title: `${title} · Béjaïa Explorer`,
        text: shareText,
        url: shareUrl,
      });
      setOpen(false);
    } catch {
      // User cancelled native share sheet
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium border transition-colors ${
          open
            ? 'bg-[#103B50] border-[#103B50] text-white'
            : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
        }`}
      >
        <Share2 className="w-4 h-4" />
        <span>{t('share.buttonLabel')}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t('share.panelTitle')}
          className="absolute start-0 mt-2 z-40 w-[min(92vw,340px)] bg-white border border-[#103B50]/15 rounded-lg shadow-xl p-4 space-y-4 text-start"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif text-base font-semibold text-[#103B50] leading-snug">
                {t('share.panelTitle')}
              </h3>
              <p className="text-xs text-[#51636D] mt-0.5 leading-relaxed">
                {t('share.panelSubtitle')}
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

          {/* Direct Copy Link Box */}
          <div className="flex items-center gap-2 p-1.5 bg-[#FAF8F3] border border-[#103B50]/12 rounded-md">
            <span
              dir="ltr"
              className="flex-1 truncate text-xs text-[#51636D] px-2 font-mono"
              title={shareUrl}
            >
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors shrink-0 ${
                copied
                  ? 'bg-[#356B50] text-white'
                  : 'bg-[#103B50] hover:bg-[#087E9B] text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t('share.copied') : t('share.copyLink')}</span>
            </button>
          </div>

          {/* Messaging Apps Popular in Algeria */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#51636D]">
              {t('share.messagingLabel')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {messagingChannels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={`inline-flex items-center justify-between gap-2 px-3 py-2 rounded-md border text-xs font-medium transition-colors bg-[#FAF8F3] ${channel.accentClass}`}
                  >
                    <span className="inline-flex items-center gap-2 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{channel.label}</span>
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Optional Native Mobile Share Sheet */}
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-md bg-[#F4EFE5] hover:bg-[#103B50] text-[#103B50] hover:text-white border border-[#103B50]/12 text-xs font-medium transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t('share.nativeShare')}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
