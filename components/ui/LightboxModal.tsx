'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import { useApp } from '@/components/providers/AppProviders';
import type { MediaAsset } from '@/types';

interface LightboxModalProps {
  images: MediaAsset[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
}

export function LightboxModal({
  images,
  activeIndex,
  onClose,
  onChangeIndex,
}: LightboxModalProps) {
  const { t, lt, isRtl } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isZoomed, setIsZoomed] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [touchOffsetX, setTouchOffsetX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(
    null
  );
  const lastTapTimeRef = useRef<number>(0);

  const resetTransform = useCallback(() => {
    setIsZoomed(false);
    setPanOffset({ x: 0, y: 0 });
    setTouchOffsetX(0);
  }, []);

  const handleClose = useCallback(() => {
    resetTransform();
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  }, [onClose, resetTransform]);

  const goToIndex = useCallback(
    (nextIdx: number) => {
      resetTransform();
      onChangeIndex(nextIdx);
    },
    [onChangeIndex, resetTransform]
  );

  const handleNext = useCallback(() => {
    if (activeIndex === null || images.length <= 1) return;
    goToIndex((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, goToIndex]);

  const handlePrev = useCallback(() => {
    if (activeIndex === null || images.length <= 1) return;
    goToIndex((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, goToIndex]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => {
      if (prev) {
        setPanOffset({ x: 0, y: 0 });
      }
      return !prev;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') {
        if (isRtl) handlePrev();
        else handleNext();
      }
      if (e.key === 'ArrowLeft') {
        if (isRtl) handleNext();
        else handlePrev();
      }
      if (e.key === '+' || e.key === '=') {
        setIsZoomed(true);
      }
      if (e.key === '-') {
        setIsZoomed(false);
        setPanOffset({ x: 0, y: 0 });
      }
    };
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    window.addEventListener('keydown', handleKey);
    document.addEventListener('fullscreenchange', handleFsChange);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.body.style.overflow = '';
    };
  }, [activeIndex, handleClose, handleNext, handlePrev, isRtl]);

  if (activeIndex === null || !images[activeIndex]) return null;
  const current = images[activeIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const now = Date.now();
    if (now - lastTapTimeRef.current < 280) {
      toggleZoom();
      lastTapTimeRef.current = 0;
      return;
    }
    lastTapTimeRef.current = now;

    if (isZoomed) {
      panStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        originX: panOffset.x,
        originY: panOffset.y,
      };
      touchStartRef.current = null;
    } else {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: now };
      panStartRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (isZoomed && panStartRef.current) {
      const dx = touch.clientX - panStartRef.current.x;
      const dy = touch.clientY - panStartRef.current.y;
      setPanOffset({
        x: Math.max(-220, Math.min(220, panStartRef.current.originX + dx)),
        y: Math.max(-180, Math.min(180, panStartRef.current.originY + dy)),
      });
      return;
    }

    if (touchStartRef.current) {
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        setTouchOffsetX(dx);
      }
    }
  };

  const handleTouchEnd = () => {
    panStartRef.current = null;
    if (!touchStartRef.current) return;

    const threshold = 55;
    if (touchOffsetX < -threshold) {
      if (isRtl) handlePrev();
      else handleNext();
    } else if (touchOffsetX > threshold) {
      if (isRtl) handleNext();
      else handlePrev();
    } else {
      setTouchOffsetX(0);
    }
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={lt(current.alt)}
      className="no-print fixed inset-0 z-50 bg-[#0A1F2B]/97 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none"
      onClick={handleClose}
    >
      {/* Top Toolbar */}
      <div
        className="flex items-center justify-between gap-3 text-[#F4EFE5]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-widest uppercase tabular-nums text-[#F4EFE5]/85">
            {activeIndex + 1} / {images.length}
          </span>
          <span className="hidden md:inline text-xs text-[#F4EFE5]/60">
            {t('galleryUi.swipeHint')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleZoom}
            aria-label={isZoomed ? t('galleryUi.zoomOut') : t('galleryUi.zoomIn')}
            title={isZoomed ? t('galleryUi.zoomOut') : t('galleryUi.zoomIn')}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs text-[#F4EFE5] hover:bg-white/10 rounded-md transition-colors"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isZoomed ? t('galleryUi.zoomOut') : t('galleryUi.zoomIn')}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? t('galleryUi.exitFullscreen') : t('galleryUi.fullscreen')}
            title={isFullscreen ? t('galleryUi.exitFullscreen') : t('galleryUi.fullscreen')}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs text-[#F4EFE5] hover:bg-white/10 rounded-md transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? t('galleryUi.exitFullscreen') : t('galleryUi.fullscreen')}
            </span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm text-[#F4EFE5] bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            aria-label={t('common.close')}
          >
            <span className="hidden sm:inline">{t('common.close')}</span>
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Main High-Res Touch Stage */}
      <div
        className="relative flex-1 flex items-center justify-center my-3 max-w-6xl w-full mx-auto overflow-hidden touch-pan-y"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label={t('common.previous')}
            className="absolute start-1 sm:start-2 z-20 p-2.5 sm:p-3 bg-[#103B50]/85 hover:bg-[#087E9B] text-white rounded-md transition-colors shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 rtl:rotate-180" />
          </button>
        )}

        <div
          onDoubleClick={toggleZoom}
          className={`relative w-full h-[56vh] sm:h-[65vh] md:h-[70vh] rounded-md overflow-hidden bg-[#103B50]/35 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          style={{
            transform: isZoomed
              ? `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(1.85)`
              : `translate3d(${touchOffsetX}px, 0, 0)`,
            transition: touchOffsetX !== 0 ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <ResilientImage
            src={current.src}
            alt={lt(current.alt)}
            fill
            priority
            sizes="100vw"
            className="object-contain pointer-events-none"
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label={t('common.next')}
            className="absolute end-1 sm:end-2 z-20 p-2.5 sm:p-3 bg-[#103B50]/85 hover:bg-[#087E9B] text-white rounded-md transition-colors shadow-lg"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* Caption + Interactive Thumbnail Filmstrip */}
      <div
        className="max-w-4xl w-full mx-auto text-center text-[#F4EFE5] space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <p className="font-serif text-base sm:text-lg leading-snug">
            <span className="text-xs uppercase tracking-widest font-sans text-[#C47B55] me-2">
              Fig. {activeIndex + 1} —
            </span>
            {current.caption ? lt(current.caption) : lt(current.alt)}
          </p>
          <p className="text-xs text-[#F4EFE5]/70 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>
              {current.source} · {current.attribution}
            </span>
          </p>
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={`${img.src}-${idx}`}
                type="button"
                onClick={() => goToIndex(idx)}
                aria-label={`Image ${idx + 1}`}
                aria-current={idx === activeIndex ? 'true' : undefined}
                className={`relative w-14 h-10 sm:w-16 sm:h-11 rounded overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activeIndex
                    ? 'border-[#C47B55] opacity-100 scale-105'
                    : 'border-white/15 opacity-55 hover:opacity-90'
                }`}
              >
                <ResilientImage
                  src={img.src}
                  alt={lt(img.alt)}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
