'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Volume2, Play, Pause, Square, Gauge, Headphones } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';

interface ArticleAudioPlayerProps {
  articleId: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  compact?: boolean;
}

const SPEED_OPTIONS = [0.85, 1, 1.15, 1.3] as const;
const STOP_OTHERS_EVENT = 'bejaia-article-audio-start';

const subscribeNoop = () => () => {};
const getSpeechSupportSnapshot = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;
const getSpeechSupportServerSnapshot = () => false;

function sanitizeForSpeech(text: string): string {
  return text
    .replace(/\[\d+\]/g, '')
    .replace(/[«»"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitForSpeech(text: string): string[] {
  const cleaned = sanitizeForSpeech(text);
  if (!cleaned) return [];
  const sentences = cleaned.match(/[^.!?؟;\n]+[.!?؟;\n]*/g) ?? [cleaned];
  const chunks: string[] = [];
  let buffer = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    if ((buffer + ' ' + trimmed).trim().length > 190 && buffer) {
      chunks.push(buffer.trim());
      buffer = trimmed;
    } else {
      buffer = buffer ? `${buffer} ${trimmed}` : trimmed;
    }
  }
  if (buffer.trim()) chunks.push(buffer.trim());
  return chunks;
}

function selectBestVoice(
  voices: SpeechSynthesisVoice[],
  targetLang: 'fr' | 'ar'
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const preferredOrder =
    targetLang === 'ar'
      ? ['ar-dz', 'ar-ma', 'ar-tn', 'ar-sa', 'ar-eg', 'ar-xa', 'ar']
      : ['fr-fr', 'fr-dz', 'fr-ca', 'fr-be', 'fr-ch', 'fr'];

  const scored = voices
    .filter((v) => v.lang.toLowerCase().startsWith(targetLang))
    .map((v) => {
      const langLower = v.lang.toLowerCase();
      const idx = preferredOrder.findIndex((p) => langLower === p || langLower.startsWith(p));
      const langScore = idx === -1 ? 0 : (preferredOrder.length - idx) * 10;
      const qualityBonus = /natural|neural|google|microsoft|thomas|aurelie|amelie|maged|tarik|salma|laila/i.test(
        v.name
      )
        ? 5
        : 0;
      return { voice: v, score: langScore + qualityBonus + (v.localService ? 1 : 0) };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.voice ?? null;
}

export function ArticleAudioPlayer({
  articleId,
  title,
  subtitle,
  paragraphs,
  compact = false,
}: ArticleAudioPlayerProps) {
  const { locale, t } = useApp();
  const instanceId = useId();
  const supported = useSyncExternalStore(
    subscribeNoop,
    getSpeechSupportSnapshot,
    getSpeechSupportServerSnapshot
  );

  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [rate, setRate] = useState<number>(1);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const sessionTokenRef = useRef(0);
  const targetLang: 'fr' | 'ar' = locale === 'ar' ? 'ar' : 'fr';

  useEffect(() => {
    if (!supported) return;
    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length > 0) setVoices(list);
    };
    queueMicrotask(loadVoices);
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
    };
  }, [supported]);

  const chunks = useMemo(() => {
    const fullText = [title, subtitle, ...paragraphs].filter(Boolean).join('. ');
    return splitForSpeech(fullText);
  }, [title, subtitle, paragraphs]);

  const activeVoice = useMemo(() => selectBestVoice(voices, targetLang), [voices, targetLang]);

  const stopPlayback = useCallback(() => {
    sessionTokenRef.current += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStatus('idle');
    setChunkIndex(0);
  }, []);

  // Stop this player if another article's audio starts playing
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onOtherStart = (event: Event) => {
      const custom = event as CustomEvent<{ instanceId?: string }>;
      if (custom.detail?.instanceId !== instanceId) {
        sessionTokenRef.current += 1;
        setStatus('idle');
        setChunkIndex(0);
      }
    };
    window.addEventListener(STOP_OTHERS_EVENT, onOtherStart);
    return () => {
      window.removeEventListener(STOP_OTHERS_EVENT, onOtherStart);
    };
  }, [instanceId]);

  // Cancel cleanly when unmounting or switching article / language
  useEffect(() => {
    return () => {
      sessionTokenRef.current += 1;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [articleId, targetLang]);

  const speakFromIndex = useCallback(
    (startIdx: number, playbackRate: number) => {
      if (!supported || chunks.length === 0) return;

      window.dispatchEvent(
        new CustomEvent(STOP_OTHERS_EVENT, { detail: { instanceId } })
      );

      const token = ++sessionTokenRef.current;
      window.speechSynthesis.cancel();

      const speakNext = (idx: number) => {
        if (sessionTokenRef.current !== token) return;
        if (idx >= chunks.length) {
          setStatus('idle');
          setChunkIndex(0);
          return;
        }
        setChunkIndex(idx);
        const utterance = new SpeechSynthesisUtterance(chunks[idx]);
        utterance.lang = activeVoice?.lang || (targetLang === 'ar' ? 'ar-SA' : 'fr-FR');
        utterance.rate = playbackRate;
        utterance.pitch = 1;
        if (activeVoice) {
          utterance.voice = activeVoice;
        }

        utterance.onend = () => {
          if (sessionTokenRef.current !== token) return;
          speakNext(idx + 1);
        };
        utterance.onerror = () => {
          if (sessionTokenRef.current !== token) return;
          setStatus('idle');
          setChunkIndex(0);
        };

        window.speechSynthesis.speak(utterance);
      };

      setStatus('playing');
      speakNext(startIdx);
    },
    [activeVoice, chunks, instanceId, supported, targetLang]
  );

  const handleTogglePlay = () => {
    if (!supported) return;
    if (status === 'idle') {
      speakFromIndex(0, rate);
      return;
    }
    if (status === 'playing') {
      window.speechSynthesis.pause();
      setStatus('paused');
      return;
    }
    if (status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('playing');
    }
  };

  const handleCycleSpeed = () => {
    const idx = SPEED_OPTIONS.indexOf(rate as (typeof SPEED_OPTIONS)[number]);
    const nextRate = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
    setRate(nextRate);
    if (status === 'playing') {
      speakFromIndex(chunkIndex, nextRate);
    }
  };

  if (!supported) {
    return null;
  }

  if (compact) {
    return (
      <div className="no-print inline-flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-pressed={status !== 'idle'}
          title={
            targetLang === 'ar' ? t('historyPage.audioLangAr') : t('historyPage.audioLangFr')
          }
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
            status !== 'idle'
              ? 'bg-[#087E9B] border-[#087E9B] text-white'
              : 'bg-[#FAF8F3] hover:bg-[#087E9B] text-[#103B50] hover:text-white border-[#103B50]/15'
          }`}
        >
          {status === 'playing' ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>{t('historyPage.audioPause')}</span>
            </>
          ) : status === 'paused' ? (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>{t('historyPage.audioResume')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('historyPage.audioBtn')}</span>
            </>
          )}
        </button>

        {status !== 'idle' && (
          <>
            <button
              type="button"
              onClick={handleCycleSpeed}
              className="px-2 py-1.5 rounded-md bg-white border border-[#103B50]/15 text-[11px] font-semibold text-[#103B50] tabular-nums"
            >
              {rate}×
            </button>
            <button
              type="button"
              onClick={stopPlayback}
              aria-label={t('historyPage.audioStop')}
              className="p-1.5 rounded-md bg-white border border-[#103B50]/15 text-[#103B50] hover:text-[#C47B55]"
            >
              <Square className="w-3 h-3 fill-current" />
            </button>
            <span className="text-[11px] font-medium text-[#356B50] tabular-nums">
              {chunkIndex + 1}/{chunks.length}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={t('historyPage.audioTitle')}
      className="no-print bg-[#FAF8F3] border border-[#103B50]/15 rounded-xl p-4 sm:p-5 space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-[#087E9B] shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#103B50]">
            {t('historyPage.audioTitle')}
          </span>
        </div>
        <span className="text-[11px] font-medium text-[#51636D]">
          {targetLang === 'ar' ? t('historyPage.audioLangAr') : t('historyPage.audioLangFr')}
          {activeVoice ? ` · ${activeVoice.name.split(' ')[0]}` : ''}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#087E9B] hover:bg-[#103B50] text-white text-xs font-medium transition-colors"
        >
          {status === 'playing' ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>{t('historyPage.audioPause')}</span>
            </>
          ) : status === 'paused' ? (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>{t('historyPage.audioResume')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('historyPage.audioBtn')}</span>
            </>
          )}
        </button>

        {status !== 'idle' && (
          <button
            type="button"
            onClick={stopPlayback}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5] text-xs font-medium transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>{t('historyPage.audioStop')}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleCycleSpeed}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white border border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5] text-xs font-medium transition-colors tabular-nums"
        >
          <Gauge className="w-3.5 h-3.5 text-[#087E9B]" />
          <span>{rate}×</span>
        </button>

        {status !== 'idle' && (
          <span className="text-xs font-medium text-[#356B50] tabular-nums ms-auto">
            {t('historyPage.audioProgress')} {chunkIndex + 1}/{chunks.length}
          </span>
        )}
      </div>
    </div>
  );
}
