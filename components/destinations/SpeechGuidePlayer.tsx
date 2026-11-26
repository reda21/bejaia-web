'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Volume2, Play, Pause, Square, Gauge } from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';

interface SpeechGuidePlayerProps {
  title: string;
  overview: string;
  experience: string;
  history?: string;
}

function splitIntoChunks(text: string): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  const sentences = cleaned.match(/[^.!?؟\n]+[.!?؟\n]*/g) ?? [cleaned];
  const chunks: string[] = [];
  let buffer = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    if ((buffer + ' ' + trimmed).trim().length > 220 && buffer) {
      chunks.push(buffer.trim());
      buffer = trimmed;
    } else {
      buffer = buffer ? `${buffer} ${trimmed}` : trimmed;
    }
  }
  if (buffer.trim()) chunks.push(buffer.trim());
  return chunks;
}

const SPEED_OPTIONS = [0.9, 1, 1.15, 1.3] as const;
const subscribeNoop = () => () => {};
const getSpeechSupportSnapshot = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;
const getSpeechSupportServerSnapshot = () => false;

export function SpeechGuidePlayer({
  title,
  overview,
  experience,
  history,
}: SpeechGuidePlayerProps) {
  const { locale, t } = useApp();
  const supported = useSyncExternalStore(
    subscribeNoop,
    getSpeechSupportSnapshot,
    getSpeechSupportServerSnapshot
  );
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [scope, setScope] = useState<'all' | 'history'>(history ? 'all' : 'all');
  const [rate, setRate] = useState<number>(1);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const sessionTokenRef = useRef(0);

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

  const activeText = useMemo(() => {
    if (scope === 'history' && history) {
      return `${title}. ${history}`;
    }
    return [title, overview, experience, history].filter(Boolean).join('. ');
  }, [scope, title, overview, experience, history]);

  const chunks = useMemo(() => splitIntoChunks(activeText), [activeText]);
  const targetLang = locale === 'ar' ? 'ar' : 'fr';

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;
    const exact = voices.find((v) =>
      v.lang.toLowerCase().startsWith(targetLang === 'ar' ? 'ar' : 'fr')
    );
    return exact ?? null;
  }, [voices, targetLang]);

  const stopPlayback = useCallback(() => {
    sessionTokenRef.current += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStatus('idle');
    setChunkIndex(0);
  }, []);

  // Cancel speech cleanly when unmounting or changing language
  useEffect(() => {
    return () => {
      sessionTokenRef.current += 1;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [locale, title]);

  const speakFromIndex = useCallback(
    (startIdx: number, playbackRate: number) => {
      if (!supported || chunks.length === 0) return;

      const token = ++sessionTokenRef.current;
      window.speechSynthesis.cancel();

      const voice = pickVoice();

      const speakNext = (idx: number) => {
        if (sessionTokenRef.current !== token) return;
        if (idx >= chunks.length) {
          setStatus('idle');
          setChunkIndex(0);
          return;
        }
        setChunkIndex(idx);
        const utterance = new SpeechSynthesisUtterance(chunks[idx]);
        utterance.lang = targetLang === 'ar' ? 'ar-DZ' : 'fr-FR';
        utterance.rate = playbackRate;
        if (voice) utterance.voice = voice;

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
    [supported, chunks, pickVoice, targetLang]
  );

  const handlePlayPause = () => {
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

  const handleScopeChange = (nextScope: 'all' | 'history') => {
    stopPlayback();
    setScope(nextScope);
  };

  const handleSpeedCycle = () => {
    const idx = SPEED_OPTIONS.indexOf(rate as (typeof SPEED_OPTIONS)[number]);
    const nextRate = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
    setRate(nextRate);
    if (status === 'playing') {
      speakFromIndex(chunkIndex, nextRate);
    }
  };

  if (!supported) {
    return (
      <div className="no-print p-4 bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg text-xs text-[#51636D] flex items-center gap-2.5">
        <Volume2 className="w-4 h-4 text-[#C47B55] shrink-0" />
        <span>{t('speech.unsupported')}</span>
      </div>
    );
  }

  return (
    <div
      id="audioguide"
      className="no-print scroll-mt-24 p-4 sm:p-5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-lg space-y-3"
      role="region"
      aria-label={t('speech.title')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#C47B55] inline-flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('speech.kicker')}</span>
          </p>
          <h2 className="font-serif text-lg font-semibold text-[#103B50]">
            {t('speech.title')}
          </h2>
          <p className="text-xs text-[#51636D]">{t('speech.subtitle')}</p>
        </div>

        {history && (
          <div className="inline-flex items-center gap-1 p-1 bg-white border border-[#103B50]/12 rounded-md">
            <button
              type="button"
              onClick={() => handleScopeChange('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                scope === 'all'
                  ? 'bg-[#103B50] text-white'
                  : 'text-[#51636D] hover:text-[#103B50]'
              }`}
            >
              {t('speech.scopeAll')}
            </button>
            <button
              type="button"
              onClick={() => handleScopeChange('history')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                scope === 'history'
                  ? 'bg-[#C47B55] text-white'
                  : 'text-[#51636D] hover:text-[#103B50]'
              }`}
            >
              {t('speech.scopeHistory')}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={handlePlayPause}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#087E9B] hover:bg-[#103B50] text-white text-xs font-medium rounded-md transition-colors"
        >
          {status === 'playing' ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>{t('speech.pause')}</span>
            </>
          ) : status === 'paused' ? (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>{t('speech.resume')}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>{t('speech.play')}</span>
            </>
          )}
        </button>

        {status !== 'idle' && (
          <button
            type="button"
            onClick={stopPlayback}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#103B50]/5 border border-[#103B50]/15 text-[#103B50] text-xs font-medium rounded-md transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>{t('speech.stop')}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleSpeedCycle}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#103B50]/5 border border-[#103B50]/15 text-[#103B50] text-xs font-medium rounded-md transition-colors tabular-nums"
        >
          <Gauge className="w-3.5 h-3.5 text-[#087E9B]" />
          <span>
            {t('speech.speed')} · {rate}×
          </span>
        </button>

        {status !== 'idle' && (
          <span
            aria-live="polite"
            className="text-xs font-medium text-[#356B50] tabular-nums ms-auto"
          >
            {status === 'playing' ? t('speech.speaking') : t('speech.paused')} ({chunkIndex + 1}/
            {chunks.length})
          </span>
        )}
      </div>
    </div>
  );
}
