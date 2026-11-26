import { NextRequest, NextResponse } from 'next/server';

interface CoordinateInput {
  lat: number;
  lng: number;
}

interface OsrmRouteResponse {
  code?: string;
  routes?: Array<{
    distance?: number;
    duration?: number;
    geometry?: {
      type: 'LineString';
      coordinates: [number, number][];
    };
  }>;
}

function formatDistance(meters: number, locale: string): string {
  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(1).replace('.', locale === 'ar' ? '.' : ',');
    return locale === 'ar' ? `${km} كم` : `${km} km`;
  }
  return locale === 'ar' ? `${Math.round(meters)} م` : `${Math.round(meters)} m`;
}

function formatDuration(seconds: number, locale: string): string {
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) {
    return locale === 'ar' ? `${mins} دقيقة` : `${mins} min`;
  }
  if (mins === 0) {
    return locale === 'ar' ? `${hours} ساعة` : `${hours} h`;
  }
  return locale === 'ar' ? `${hours} س ${mins} د` : `${hours} h ${mins} min`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      coordinates?: CoordinateInput[];
      locale?: string;
    };

    const locale = body?.locale === 'ar' ? 'ar' : 'fr';
    const coords = Array.isArray(body?.coordinates) ? body.coordinates : [];

    const validCoords = coords
      .filter(
        (c): c is CoordinateInput =>
          Boolean(
            c &&
              typeof c.lat === 'number' &&
              typeof c.lng === 'number' &&
              Number.isFinite(c.lat) &&
              Number.isFinite(c.lng) &&
              c.lat >= 34 &&
              c.lat <= 38 &&
              c.lng >= 2 &&
              c.lng <= 9
          )
      )
      .slice(0, 8);

    if (validCoords.length < 2) {
      return NextResponse.json(
        { error: 'Au moins deux étapes valides sont requises pour tracer un itinéraire.' },
        { status: 400 }
      );
    }

    const coordString = validCoords.map((c) => `${c.lng.toFixed(6)},${c.lat.toFixed(6)}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BejaiaExplorer/1.0 (https://bejaia-explorer.dz)',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Le service de calcul d’itinéraire OSRM est momentanément indisponible.' },
        { status: 502 }
      );
    }

    const data = (await res.json()) as OsrmRouteResponse;
    const route = data.routes?.[0];
    if (data.code !== 'Ok' || !route?.geometry) {
      return NextResponse.json(
        { error: 'Aucun itinéraire routier disponible entre ces étapes.' },
        { status: 404 }
      );
    }

    const distanceMeters = route.distance ?? 0;
    const durationSeconds = route.duration ?? 0;

    return NextResponse.json({
      geometry: route.geometry,
      distanceMeters,
      durationSeconds,
      distanceText: formatDistance(distanceMeters, locale),
      durationText: formatDuration(durationSeconds, locale),
      stopsCount: validCoords.length,
    });
  } catch {
    return NextResponse.json(
      { error: 'Impossible de calculer l’itinéraire routier.' },
      { status: 500 }
    );
  }
}
