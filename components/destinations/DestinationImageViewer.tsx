'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Eye,
  EyeOff,
  Focus,
  Camera,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { ResilientImage } from '@/components/ui/ResilientImage';
import { getPhotoPointsOfInterest } from '@/data/photoPois';
import type { Destination, MediaAsset, PhotoPointOfInterest } from '@/types';

interface DestinationImageViewerProps {
  destination: Destination;
  images: MediaAsset[];
  onOpenFullscreen: (index: number) => void;
}

const ZOOM_STEPS = [1, 1.5, 2.25, 3];

export function DestinationImageViewer({
  destination,
  images,
  onOpenFullscreen,
}: DestinationImageViewerProps) {
  const { t, lt, isRtl } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showPois, setShowPois] = useState(true);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; originX: number; originY: number } | null>(
    null
  );

  const safeIndex = activeIndex < images.length ? activeIndex : 0;
  const currentImage = images[safeIndex] ?? destination.coverImage;
  const zoom = ZOOM_STEPS[zoomIndex] ?? 1;

  const pois = useMemo(
    () => getPhotoPointsOfInterest(currentImage.src, destination),
    [currentImage.src, destination]
  );

  const activePoi: PhotoPointOfInterest | null = useMemo(() => {
    if (pois.length === 0) return null;
    return pois.find((p) => p.id === selectedPoiId) ?? pois[0];
  }, [pois, selectedPoiId]);

  const clampPan = useCallback((nextX: number, nextY: number, scale: number) => {
    if (scale <= 1 || !stageRef.current) return { x: 0, y: 0 };
    const rect = stageRef.current.getBoundingClientRect();
    const maxX = ((scale - 1) * rect.width) / 2;
    const maxY = ((scale - 1) * rect.height) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, nextX)),
      y: Math.max(-maxY, Math.min(maxY, nextY)),
    };
  }, []);

  const resetZoom = useCallback(() => {
    setZoomIndex(0);
    setPan({ x: 0, y: 0 });
  }, []);

  const selectImage = useCallback(
    (nextIdx: number) => {
      setActiveIndex(nextIdx);
      setSelectedPoiId(null);
      resetZoom();
    },
    [resetZoom]
  );

  const handlePrev = () => {
    if (images.length <= 1) return;
    selectImage((safeIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (images.length <= 1) return;
    selectImage((safeIndex + 1) % images.length);
  };

  const handleZoomIn = () => {
    setZoomIndex((prev) => {
      const next = Math.min(ZOOM_STEPS.length - 1, prev + 1);
      const nextScale = ZOOM_STEPS[next];
      setPan((currentPan) => clampPan(currentPan.x, currentPan.y, nextScale));
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoomIndex((prev) => {
      const next = Math.max(0, prev - 1);
      const nextScale = ZOOM_STEPS[next];
      setPan((currentPan) => clampPan(currentPan.x, currentPan.y, nextScale));
      return next;
    });
  };

  const focusOnPoi = (poi: PhotoPointOfInterest) => {
    setSelectedPoiId(poi.id);
    const targetScaleIndex = zoomIndex < 2 ? 2 : zoomIndex;
    const targetScale = ZOOM_STEPS[targetScaleIndex];
    setZoomIndex(targetScaleIndex);

    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      // Shift image so POI (poi.x%, poi.y%) moves toward center (50%, 50%)
      const offsetX = ((50 - poi.x) / 100) * rect.width * targetScale;
      const offsetY = ((50 - poi.y) / 100) * rect.height * targetScale;
      setPan(clampPan(offsetX, offsetY, targetScale));
    }
  };

  const handleStageDoubleClick = () => {
    if (zoomIndex === 0) {
      setZoomIndex(2);
    } else {
      resetZoom();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      originX: pan.x,
      originY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan(clampPan(dragStartRef.current.originX + dx, dragStartRef.current.originY + dy, zoom));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#087E9B] inline-flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>{t('galleryUi.viewerKicker')}</span>
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50] mt-0.5">
            {t('detail.gallery')}
          </h2>
        </div>

        <div className="no-print flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowPois((prev) => !prev)}
            aria-pressed={showPois}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors ${
              showPois
                ? 'bg-[#087E9B] border-[#087E9B] text-white'
                : 'bg-[#FAF8F3] border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
            }`}
          >
            {showPois ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showPois ? t('galleryUi.poisShow') : t('galleryUi.poisHide')}</span>
          </button>

          <div className="inline-flex items-center bg-[#FAF8F3] border border-[#103B50]/15 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomIndex === 0}
              aria-label={t('galleryUi.zoomOut')}
              title={t('galleryUi.zoomOut')}
              className="p-1.5 text-[#103B50] hover:bg-[#F4EFE5] disabled:opacity-40 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-semibold tabular-nums text-[#103B50] border-x border-[#103B50]/10">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomIndex === ZOOM_STEPS.length - 1}
              aria-label={t('galleryUi.zoomIn')}
              title={t('galleryUi.zoomIn')}
              className="p-1.5 text-[#103B50] hover:bg-[#F4EFE5] disabled:opacity-40 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {zoom > 1 && (
            <button
              type="button"
              onClick={resetZoom}
              aria-label={t('galleryUi.resetZoom')}
              title={t('galleryUi.resetZoom')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FAF8F3] hover:bg-[#F4EFE5] border border-[#103B50]/15 rounded-md text-xs font-medium text-[#103B50] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">100%</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenFullscreen(safeIndex)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#103B50] hover:bg-[#087E9B] text-white rounded-md text-xs font-medium transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{t('galleryUi.openFullscreen')}</span>
          </button>
        </div>
      </div>

      {/* High-Resolution Interactive Stage */}
      <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-xl overflow-hidden">
        <div
          ref={stageRef}
          onDoubleClick={handleStageDoubleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative aspect-[16/10] w-full overflow-hidden bg-[#0E2634] select-none ${
            zoom > 1
              ? isDragging
                ? 'cursor-grabbing touch-none'
                : 'cursor-grab touch-none'
              : 'cursor-zoom-in'
          }`}
        >
          {/* Zoomable + Pannable Media Layer with Synchronized POI Pins */}
          <div
            className="relative w-full h-full origin-center"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <ResilientImage
              src={currentImage.src}
              alt={lt(currentImage.alt)}
              fill
              priority={safeIndex === 0}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover pointer-events-none"
            />

            {/* Contextual Photo POI Markers */}
            {showPois &&
              pois.map((poi, idx) => {
                const isSelected = activePoi?.id === poi.id;
                return (
                  <button
                    key={poi.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPoiId(poi.id);
                    }}
                    aria-label={`${idx + 1}. ${lt(poi.label)}`}
                    aria-pressed={isSelected}
                    style={{
                      left: `${poi.x}%`,
                      top: `${poi.y}%`,
                      transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                    }}
                    className={`no-print absolute z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold tabular-nums shadow-lg border-2 transition-colors ${
                      isSelected
                        ? 'bg-[#C47B55] border-white text-white ring-4 ring-[#C47B55]/35'
                        : 'bg-[#103B50]/90 border-white/90 text-white hover:bg-[#087E9B]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
          </div>

          {/* Left / Right Image Switchers */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={isRtl ? handleNext : handlePrev}
                aria-label={t('common.previous')}
                className="no-print absolute start-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-md bg-[#103B50]/80 hover:bg-[#087E9B] text-white transition-colors shadow"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={isRtl ? handlePrev : handleNext}
                aria-label={t('common.next')}
                className="no-print absolute end-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-md bg-[#103B50]/80 hover:bg-[#087E9B] text-white transition-colors shadow"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </>
          )}

          {/* Subtle Bottom Overlay Status */}
          <div className="no-print pointer-events-none absolute bottom-3 inset-x-3 z-20 flex items-center justify-between gap-2 text-[11px] text-[#F4EFE5]">
            <span className="px-2.5 py-1 rounded bg-[#103B50]/85 backdrop-blur-xs tabular-nums">
              Fig. {safeIndex + 1} / {images.length}
            </span>
            {zoom > 1 && (
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-[#103B50]/85 backdrop-blur-xs">
                {t('galleryUi.dragToPan')}
              </span>
            )}
          </div>
        </div>

        {/* Contextual Caption + Photographic Points of Interest Panel */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#103B50]/10 pb-3">
            <p className="font-serif text-sm sm:text-base italic text-[#103B50] leading-relaxed">
              Fig. {safeIndex + 1} —{' '}
              {currentImage.caption ? lt(currentImage.caption) : lt(currentImage.alt)}
            </p>
            <span className="text-[11px] text-[#51636D] shrink-0">{currentImage.source}</span>
          </div>

          {pois.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#51636D] inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C47B55]" />
                  <span>{t('galleryUi.poisTitle')}</span>
                </h3>
                <span className="text-[11px] text-[#51636D]">{t('galleryUi.clickPoiHint')}</span>
              </div>

              {/* Numbered POI Selectors */}
              <div className="flex flex-wrap gap-2">
                {pois.map((poi, idx) => {
                  const isSelected = activePoi?.id === poi.id;
                  return (
                    <button
                      key={poi.id}
                      type="button"
                      onClick={() => {
                        setSelectedPoiId(poi.id);
                        setShowPois(true);
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-[#103B50] border-[#103B50] text-white'
                          : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full text-[11px] font-bold tabular-nums inline-flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#C47B55] text-white'
                            : 'bg-[#F4EFE5] text-[#103B50]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span>{lt(poi.label)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Contextual POI Detail Card */}
              {activePoi && (
                <div className="bg-white border border-[#103B50]/12 rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#103B50]">{lt(activePoi.label)}</p>
                    <p className="text-xs sm:text-sm text-[#51636D] leading-relaxed">
                      {lt(activePoi.description)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => focusOnPoi(activePoi)}
                    className="no-print shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FAF8F3] hover:bg-[#087E9B] text-[#103B50] hover:text-white border border-[#103B50]/15 text-xs font-medium transition-colors self-start"
                  >
                    <Focus className="w-3.5 h-3.5" />
                    <span>{t('galleryUi.zoomIn')}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Interactive Thumbnail Strip */}
          {images.length > 1 && (
            <div className="no-print flex items-center gap-2.5 overflow-x-auto pt-2 border-t border-[#103B50]/10">
              {images.map((img, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={`${img.src}-${idx}`}
                    type="button"
                    onClick={() => selectImage(idx)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`group relative w-24 sm:w-28 aspect-[4/3] rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                      isActive
                        ? 'border-[#C47B55] opacity-100'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="relative block w-full h-full">
                      <ResilientImage
                        src={img.src}
                        alt={lt(img.alt)}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
