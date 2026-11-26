'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  LocateFixed,
  ExternalLink,
  ArrowRight,
  Loader2,
  WifiOff,
  X,
  Layers,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import { useOnlineStatus } from '@/components/pwa/PWAControls';
import { CATEGORY_MAP } from '@/data/categories';
import { ResilientImage } from '@/components/ui/ResilientImage';
import type { Destination, ResolvedMapLocation, RouteSummaryResult } from '@/types';

// General regional center for the Wilaya of Béjaïa ([lng, lat] for MapLibre)
const BEJAIA_VIEWPORT_CENTER: [number, number] = [5.0557, 36.7515];

const OPENFREEMAP_STYLES = [
  { id: 'liberty', label: 'Liberty', url: 'https://tiles.openfreemap.org/styles/liberty' },
  { id: 'bright', label: 'Bright', url: 'https://tiles.openfreemap.org/styles/bright' },
  { id: 'positron', label: 'Positron', url: 'https://tiles.openfreemap.org/styles/positron' },
] as const;

type OpenFreeMapStyleId = (typeof OPENFREEMAP_STYLES)[number]['id'];

interface RouteGeoJsonGeometry {
  type: 'LineString';
  coordinates: [number, number][];
}

// In-memory session cache shared across page navigations
const sessionPlaceCache: Record<string, ResolvedMapLocation> = {};

const ROUTE_SOURCE_ID = 'bejaia-circuit-route-source';
const ROUTE_CASING_LAYER_ID = 'bejaia-circuit-route-casing';
const ROUTE_LINE_LAYER_ID = 'bejaia-circuit-route-line';

export interface BejaiaMapLibreMapProps {
  destinations: Destination[];
  activeSlug?: string | null;
  onSelectSlug?: (slug: string | null) => void;
  heightClass?: string;
  autoResolveLimit?: number;
  zoom?: number;
  showUserLocateButton?: boolean;
  onResolvedChange?: (resolved: Record<string, ResolvedMapLocation>) => void;
  routeRequestId?: number;
  onRouteComputed?: (summary: RouteSummaryResult | null, error?: string | null) => void;
  onRouteLoadingChange?: (loading: boolean) => void;
}

export function BejaiaMapLibreMap({
  destinations,
  activeSlug: controlledActiveSlug,
  onSelectSlug: controlledOnSelectSlug,
  heightClass = 'h-[520px]',
  autoResolveLimit = 8,
  zoom = 10,
  showUserLocateButton = true,
  onResolvedChange,
  routeRequestId = 0,
  onRouteComputed,
  onRouteLoadingChange,
}: BejaiaMapLibreMapProps) {
  const { locale, t, lt } = useApp();
  const isOnline = useOnlineStatus();
  const [internalSlug, setInternalSlug] = useState<string | null>(null);
  const [styleId, setStyleId] = useState<OpenFreeMapStyleId>('liberty');
  const [resolvedMap, setResolvedMap] = useState<Record<string, ResolvedMapLocation>>(() => ({
    ...sessionPlaceCache,
  }));
  const [resolving, setResolving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const routeGeometryRef = useRef<RouteGeoJsonGeometry | null>(null);
  const inFlightRef = useRef<Record<string, boolean>>({});
  const initialZoomRef = useRef(zoom);

  const activeSlug =
    controlledActiveSlug !== undefined ? controlledActiveSlug : internalSlug;
  const onSelectSlug = controlledOnSelectSlug ?? setInternalSlug;

  const removeRouteFromMap = useCallback((map: maplibregl.Map) => {
    try {
      if (map.getLayer(ROUTE_LINE_LAYER_ID)) map.removeLayer(ROUTE_LINE_LAYER_ID);
      if (map.getLayer(ROUTE_CASING_LAYER_ID)) map.removeLayer(ROUTE_CASING_LAYER_ID);
      if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
    } catch {
      // Ignore if style is currently reloading
    }
  }, []);

  const drawRouteOnMap = useCallback(
    (map: maplibregl.Map, geometry: RouteGeoJsonGeometry) => {
      if (!map.isStyleLoaded()) return;
      removeRouteFromMap(map);
      map.addSource(ROUTE_SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry,
        },
      });
      map.addLayer({
        id: ROUTE_CASING_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 7,
          'line-opacity': 0.9,
        },
      });
      map.addLayer({
        id: ROUTE_LINE_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#087E9B',
          'line-width': 4,
          'line-opacity': 0.95,
        },
      });
    },
    [removeRouteFromMap]
  );

  // Batch geocode helper backed by /api/geocode (OpenStreetMap Nominatim proxy)
  const resolveBatch = useCallback(
    async (targets: Destination[]): Promise<Record<string, ResolvedMapLocation>> => {
      const missing = targets.filter(
        (d) => !sessionPlaceCache[d.slug] && !inFlightRef.current[d.slug]
      );
      if (missing.length === 0) {
        return { ...sessionPlaceCache };
      }

      missing.forEach((d) => {
        inFlightRef.current[d.slug] = true;
      });

      try {
        const res = await fetch('/api/geocode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: missing.map((d) => ({
              slug: d.slug,
              primaryQuery: d.osmSearchQuery || d.mapsSearchQuery,
              fallbackQuery: `${d.commune.fr}, Béjaïa, Algérie`,
            })),
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            results?: Record<string, ResolvedMapLocation>;
          };
          if (data.results) {
            Object.entries(data.results).forEach(([slug, loc]) => {
              sessionPlaceCache[slug] = loc;
            });
          }
        }
      } catch {
        // Ignore transient network errors
      } finally {
        missing.forEach((d) => {
          delete inFlightRef.current[d.slug];
        });
      }

      return { ...sessionPlaceCache };
    },
    []
  );

  // Initialize MapLibre GL map with OpenFreeMap vector tiles
  useEffect(() => {
    if (!isOnline || !containerRef.current) return;

    maplibregl.setWorkerUrl(new URL('/maplibre-gl-worker.js', window.location.origin).href);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OPENFREEMAP_STYLES[0].url,
      center: BEJAIA_VIEWPORT_CENTER,
      zoom: initialZoomRef.current,
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-right');

    map.on('load', () => {
      setMapReady(true);
    });

    map.on('style.load', () => {
      if (routeGeometryRef.current) {
        drawRouteOnMap(map, routeGeometryRef.current);
      }
    });

    mapRef.current = map;

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [isOnline, drawRouteOnMap]);

  // Switch OpenFreeMap style cleanly
  const handleStyleSwitch = (nextStyleId: OpenFreeMapStyleId) => {
    if (nextStyleId === styleId) return;
    setStyleId(nextStyleId);
    const chosen = OPENFREEMAP_STYLES.find((s) => s.id === nextStyleId);
    if (chosen && mapRef.current) {
      mapRef.current.setStyle(chosen.url);
    }
  };

  // Auto-resolve initial visible destinations
  useEffect(() => {
    if (!isOnline || destinations.length === 0) return;
    let cancelled = false;

    const batch = destinations.slice(0, autoResolveLimit);
    const missing = batch.filter((d) => !sessionPlaceCache[d.slug]);

    void Promise.resolve().then(async () => {
      if (missing.length === 0) {
        const current = { ...sessionPlaceCache };
        if (!cancelled) {
          setResolvedMap(current);
          onResolvedChange?.(current);
        }
        return;
      }

      if (!cancelled) setResolving(true);
      const updated = await resolveBatch(missing);
      if (cancelled) return;
      setResolvedMap(updated);
      onResolvedChange?.(updated);
      setResolving(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isOnline, destinations, autoResolveLimit, resolveBatch, onResolvedChange]);

  // Synchronize custom MapLibre DOM markers with resolved destinations
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    destinations.forEach((dest) => {
      const resolved = resolvedMap[dest.slug];
      if (!resolved) return;

      const cat = CATEGORY_MAP[dest.category];
      const isSelected = activeSlug === dest.slug;

      const el = document.createElement('button');
      el.type = 'button';
      el.setAttribute('aria-label', lt(dest.name));
      el.title = lt(dest.name);
      el.style.width = isSelected ? '26px' : '20px';
      el.style.height = isSelected ? '26px' : '20px';
      el.style.borderRadius = '9999px';
      el.style.backgroundColor = cat.accentColor;
      el.style.border = isSelected ? '3px solid #103B50' : '2.5px solid #FFFFFF';
      el.style.boxShadow = isSelected
        ? '0 4px 14px rgba(16, 59, 80, 0.45)'
        : '0 2px 6px rgba(16, 59, 80, 0.32)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 150ms ease';

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectSlug(dest.slug);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([resolved.lng, resolved.lat])
        .addTo(map);

      markersRef.current[dest.slug] = marker;
    });
  }, [destinations, resolvedMap, activeSlug, mapReady, lt, onSelectSlug]);

  // Resolve and fly to activeSlug whenever selected
  useEffect(() => {
    if (!isOnline || !activeSlug) return;
    const targetDest = destinations.find((d) => d.slug === activeSlug);
    if (!targetDest) return;

    const focusOn = (loc: ResolvedMapLocation) => {
      const map = mapRef.current;
      if (map) {
        map.flyTo({
          center: [loc.lng, loc.lat],
          zoom: Math.max(map.getZoom(), 12.5),
          speed: 1.25,
          essential: true,
        });
      }
    };

    if (sessionPlaceCache[activeSlug]) {
      focusOn(sessionPlaceCache[activeSlug]);
      return;
    }

    let cancelled = false;
    void Promise.resolve().then(async () => {
      if (cancelled) return;
      setResolving(true);
      const updated = await resolveBatch([targetDest]);
      if (cancelled) return;
      setResolving(false);
      setResolvedMap(updated);
      onResolvedChange?.(updated);
      if (updated[activeSlug]) {
        focusOn(updated[activeSlug]);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isOnline, activeSlug, destinations, resolveBatch, onResolvedChange]);

  // Center on single-destination detail pages once resolved
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || destinations.length !== 1) return;
    const only = resolvedMap[destinations[0].slug];
    if (only) {
      map.flyTo({ center: [only.lng, only.lat], zoom: 13, essential: true });
    }
  }, [mapReady, destinations, resolvedMap]);

  // On-demand OSRM route tracing on OpenFreeMap + MapLibre
  useEffect(() => {
    const map = mapRef.current;
    if (routeRequestId === 0) {
      routeGeometryRef.current = null;
      if (map) removeRouteFromMap(map);
      return;
    }
    if (!isOnline || !map || destinations.length < 2) return;

    let cancelled = false;
    void Promise.resolve().then(async () => {
      if (cancelled) return;
      onRouteLoadingChange?.(true);

      try {
        const stopsPool = destinations.slice(0, 6);
        const updated = await resolveBatch(stopsPool);
        if (cancelled) return;

        setResolvedMap(updated);
        onResolvedChange?.(updated);

        const resolvedStops = stopsPool
          .map((d) => updated[d.slug])
          .filter((loc): loc is ResolvedMapLocation => Boolean(loc));

        if (resolvedStops.length < 2) {
          onRouteComputed?.(
            null,
            'Impossible de localiser au moins deux étapes via OpenStreetMap pour tracer l’itinéraire.'
          );
          onRouteLoadingChange?.(false);
          return;
        }

        const res = await fetch('/api/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locale,
            coordinates: resolvedStops.map((s) => ({ lat: s.lat, lng: s.lng })),
          }),
        });

        const data = (await res.json()) as {
          geometry?: RouteGeoJsonGeometry;
          distanceText?: string;
          durationText?: string;
          stopsCount?: number;
          error?: string;
        };

        if (cancelled) return;

        if (!res.ok || !data.geometry) {
          onRouteComputed?.(
            null,
            data.error || 'Aucun itinéraire routier disponible entre ces étapes.'
          );
          onRouteLoadingChange?.(false);
          return;
        }

        routeGeometryRef.current = data.geometry;
        drawRouteOnMap(map, data.geometry);

        const bounds = new maplibregl.LngLatBounds();
        data.geometry.coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 48, maxZoom: 13 });
        }

        onRouteComputed?.(
          {
            distanceText: data.distanceText,
            durationText: data.durationText,
            stopsCount: data.stopsCount ?? resolvedStops.length,
          },
          null
        );
      } catch {
        if (!cancelled) {
          onRouteComputed?.(
            null,
            'Le calcul du tracé routier OpenStreetMap / OSRM n’a pas abouti.'
          );
        }
      } finally {
        if (!cancelled) {
          onRouteLoadingChange?.(false);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    routeRequestId,
    isOnline,
    destinations,
    locale,
    resolveBatch,
    removeRouteFromMap,
    drawRouteOnMap,
    onResolvedChange,
    onRouteComputed,
    onRouteLoadingChange,
  ]);

  const handleLocateMe = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError(t('map.locationDenied'));
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lngLat: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setLocating(false);
        const map = mapRef.current;
        if (map) {
          userMarkerRef.current?.remove();
          const dot = document.createElement('div');
          dot.style.width = '16px';
          dot.style.height = '16px';
          dot.style.borderRadius = '9999px';
          dot.style.backgroundColor = '#087E9B';
          dot.style.border = '3px solid #FFFFFF';
          dot.style.boxShadow = '0 0 0 4px rgba(8, 126, 155, 0.25)';

          userMarkerRef.current = new maplibregl.Marker({ element: dot })
            .setLngLat(lngLat)
            .addTo(map);
          map.flyTo({ center: lngLat, zoom: 12, essential: true });
        }
      },
      () => {
        setLocating(false);
        setLocationError(t('map.locationDenied'));
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  if (!isOnline) {
    return (
      <div
        className={`w-full ${heightClass} bg-[#FAF8F3] border border-[#103B50]/15 rounded-lg p-5 overflow-y-auto flex flex-col justify-between gap-4`}
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C47B55]">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>{t('pwa.offlineBanner')}</span>
          </div>
          <p className="text-sm text-[#51636D] leading-relaxed">{t('pwa.offlineMapNotice')}</p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 content-start">
          {destinations.slice(0, 12).map((dest) => (
            <li
              key={dest.slug}
              className="p-3 bg-white border border-[#103B50]/12 rounded-md flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <p className="font-serif text-sm font-semibold text-[#103B50] truncate">
                  {lt(dest.name)}
                </p>
                <p className="text-[11px] text-[#51636D] truncate">{lt(dest.commune)}</p>
              </div>
              <Link
                href={`/destinations/${dest.slug}`}
                className="text-xs font-medium text-[#087E9B] hover:underline shrink-0"
              >
                {t('destinations.discover')}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const activeDestination = activeSlug
    ? destinations.find((d) => d.slug === activeSlug) ?? null
    : null;
  const activeResolved = activeSlug ? resolvedMap[activeSlug] : undefined;
  const activeCategory = activeDestination ? CATEGORY_MAP[activeDestination.category] : null;

  return (
    <div
      className={`relative w-full ${heightClass} rounded-lg overflow-hidden border border-[#103B50]/15 bg-[#F4EFE5]`}
    >
      <div ref={containerRef} className="w-full h-full" />

      {/* Top-start OpenFreeMap Style Switcher */}
      <div className="absolute top-3 start-3 z-10 flex items-center gap-1 p-1 bg-white/95 backdrop-blur-xs border border-[#103B50]/15 rounded-md shadow-sm">
        <Layers className="w-3.5 h-3.5 text-[#087E9B] ms-1.5 me-0.5 shrink-0" aria-hidden="true" />
        {OPENFREEMAP_STYLES.map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => handleStyleSwitch(st.id)}
            className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
              styleId === st.id
                ? 'bg-[#103B50] text-white'
                : 'text-[#51636D] hover:text-[#103B50] hover:bg-[#F4EFE5]'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Selected Destination Floating Editorial Info Card (React JSX — XSS-safe) */}
      {activeDestination && activeCategory && destinations.length > 1 && (
        <div className="absolute bottom-14 sm:bottom-4 end-3 sm:end-14 z-20 w-[265px] sm:w-[290px] bg-white border border-[#103B50]/15 rounded-lg shadow-xl overflow-hidden">
          <div className="relative w-full h-28 bg-[#F4EFE5]">
            <ResilientImage
              src={activeDestination.coverImage.src}
              alt={lt(activeDestination.coverImage.alt)}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onSelectSlug(null)}
              aria-label={t('common.close')}
              className="absolute top-2 end-2 p-1 rounded-md bg-[#103B50]/80 hover:bg-[#103B50] text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-3.5 space-y-2 text-[#102530]">
            <div>
              <p className="text-[11px] font-medium text-[#087E9B]">
                {lt(activeCategory.shortTitle)} · {lt(activeDestination.commune)}
              </p>
              <h4 className="font-serif text-base font-semibold text-[#103B50] leading-snug mt-0.5">
                {lt(activeDestination.name)}
              </h4>
              {activeResolved?.formattedAddress && (
                <p className="text-[11px] text-[#51636D] line-clamp-1 mt-0.5">
                  {activeResolved.formattedAddress}
                </p>
              )}
              <p className="text-xs text-[#51636D] line-clamp-2 mt-1">
                {lt(activeDestination.shortDescription)}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#103B50]/10">
              <Link
                href={`/destinations/${activeDestination.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#087E9B] hover:text-[#103B50]"
              >
                <span>{t('destinations.discover')}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
              <a
                href={
                  activeResolved?.googleMapsURI ||
                  `https://www.openstreetmap.org/search?query=${encodeURIComponent(
                    activeDestination.osmSearchQuery
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#51636D] hover:text-[#103B50]"
              >
                <span>OpenStreetMap</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-start locate button + resolving status */}
      <div className="absolute bottom-3 start-3 z-10 flex flex-wrap items-center gap-2">
        {showUserLocateButton && (
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locating}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-[#103B50] hover:bg-[#F4EFE5] border border-[#103B50]/15 rounded-md shadow-md text-xs font-medium transition-colors"
          >
            {locating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#087E9B]" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5 text-[#087E9B]" />
            )}
            <span>{locating ? t('map.locating') : t('map.locateMe')}</span>
          </button>
        )}

        {resolving && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/95 text-[#103B50] border border-[#103B50]/15 rounded-md shadow-sm text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#087E9B]" />
            <span>{t('map.resolvingPlaces')}</span>
          </div>
        )}
      </div>

      {locationError && (
        <div className="absolute top-14 start-3 z-10 max-w-xs px-3 py-2 bg-white border border-[#C47B55]/40 text-xs text-[#103B50] rounded-md shadow">
          {locationError}
        </div>
      )}
    </div>
  );
}
