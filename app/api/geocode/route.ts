import { NextRequest, NextResponse } from 'next/server';
import type { ResolvedMapLocation } from '@/types';

// Wilaya of Béjaïa geographic bounding box (left,top,right,bottom)
const BEJAIA_VIEWBOX = '4.35,36.98,5.68,36.25';
const NOMINATIM_HEADERS = {
  'User-Agent': 'BejaiaExplorer/1.0 (https://bejaia-explorer.dz; tourism-portal)',
  Accept: 'application/json',
};

// In-memory server cache across requests to respect Nominatim usage policy
const geocodeCache = new Map<string, ResolvedMapLocation | null>();

interface NominatimItem {
  place_id?: number;
  lat?: string;
  lon?: string;
  display_name?: string;
  name?: string;
  osm_type?: string;
  osm_id?: number;
}

interface GeocodeRequestItem {
  slug: string;
  primaryQuery: string;
  fallbackQuery?: string;
}

async function queryNominatim(query: string, bounded: boolean): Promise<NominatimItem | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'dz');
  url.searchParams.set('viewbox', BEJAIA_VIEWBOX);
  if (bounded) {
    url.searchParams.set('bounded', '1');
  }
  url.searchParams.set('accept-language', 'fr,ar');

  const res = await fetch(url.toString(), {
    headers: NOMINATIM_HEADERS,
    next: { revalidate: 86400 },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as NominatimItem[];
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

function buildOsmUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=15/${lat.toFixed(5)}/${lng.toFixed(5)}`;
}

async function resolveSingle(item: GeocodeRequestItem): Promise<ResolvedMapLocation | null> {
  const cacheKey = `${item.slug}::${item.primaryQuery}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) ?? null;
  }

  let match: NominatimItem | null = null;
  try {
    match = await queryNominatim(item.primaryQuery, true);
    if (!match) {
      match = await queryNominatim(item.primaryQuery, false);
    }
    if (!match && item.fallbackQuery && item.fallbackQuery !== item.primaryQuery) {
      match = await queryNominatim(item.fallbackQuery, true);
    }
  } catch {
    return null;
  }

  if (!match?.lat || !match?.lon) {
    geocodeCache.set(cacheKey, null);
    return null;
  }

  const lat = Number.parseFloat(match.lat);
  const lng = Number.parseFloat(match.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    geocodeCache.set(cacheKey, null);
    return null;
  }

  const resolved: ResolvedMapLocation = {
    slug: item.slug,
    lat,
    lng,
    formattedAddress: match.display_name,
    googleMapsURI: buildOsmUrl(lat, lng),
    placeId: match.place_id ? String(match.place_id) : undefined,
    displayName: match.name || undefined,
  };

  geocodeCache.set(cacheKey, resolved);
  return resolved;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { items?: GeocodeRequestItem[] };
    const rawItems = Array.isArray(body?.items) ? body.items : [];
    const items = rawItems
      .filter(
        (it): it is GeocodeRequestItem =>
          Boolean(
            it &&
              typeof it.slug === 'string' &&
              typeof it.primaryQuery === 'string' &&
              it.slug.trim().length > 0 &&
              it.primaryQuery.trim().length > 0
          )
      )
      .slice(0, 10);

    if (items.length === 0) {
      return NextResponse.json({ results: {} });
    }

    const results: Record<string, ResolvedMapLocation> = {};

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const cacheKey = `${item.slug}::${item.primaryQuery}`;
      const wasCached = geocodeCache.has(cacheKey);
      const resolved = await resolveSingle(item);
      if (resolved) {
        results[item.slug] = resolved;
      }
      if (!wasCached && i < items.length - 1) {
        await sleep(320);
      }
    }

    return NextResponse.json(
      { results },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid geocode request payload', results: {} },
      { status: 400 }
    );
  }
}
