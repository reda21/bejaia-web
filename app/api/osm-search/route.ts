import { NextRequest, NextResponse } from 'next/server';

const BEJAIA_VIEWBOX = '4.35,36.98,5.68,36.25';

interface NominatimSearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
  class?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      query?: string;
      locale?: string;
      lat?: number;
      lng?: number;
    };

    const rawQuery = typeof body?.query === 'string' ? body.query.trim() : '';
    if (!rawQuery || rawQuery.length < 2) {
      return NextResponse.json({ error: 'Requête trop courte.' }, { status: 400 });
    }

    const locale = body?.locale === 'ar' ? 'ar' : 'fr';
    const hasBejaia =
      rawQuery.toLowerCase().includes('bejaia') ||
      rawQuery.toLowerCase().includes('béjaïa') ||
      rawQuery.includes('بجاية');

    const finalQuery = hasBejaia
      ? rawQuery
      : `${rawQuery}, ${locale === 'ar' ? 'بجاية، الجزائر' : 'Béjaïa, Algérie'}`;

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', finalQuery);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '8');
    url.searchParams.set('countrycodes', 'dz');
    url.searchParams.set('viewbox', BEJAIA_VIEWBOX);
    url.searchParams.set('bounded', '1');
    url.searchParams.set('accept-language', locale === 'ar' ? 'ar,fr' : 'fr,ar');

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'BejaiaExplorer/1.0 (https://bejaia-explorer.dz; tourism-portal)',
        Accept: 'application/json',
      },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Le service de recherche OpenStreetMap est temporairement indisponible.' },
        { status: 502 }
      );
    }

    const items = (await res.json()) as NominatimSearchResult[];
    const places = (Array.isArray(items) ? items : []).map((item) => {
      const lat = Number.parseFloat(item.lat);
      const lng = Number.parseFloat(item.lon);
      const title = item.name?.trim() || item.display_name.split(',')[0] || rawQuery;
      return {
        title,
        address: item.display_name,
        category: item.type || item.class || 'place',
        lat,
        lng,
        uri: `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=16/${lat.toFixed(5)}/${lng.toFixed(5)}`,
      };
    });

    return NextResponse.json({
      query: rawQuery,
      places,
      source: 'OpenStreetMap / Nominatim',
    });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la recherche OpenStreetMap.' },
      { status: 500 }
    );
  }
}
