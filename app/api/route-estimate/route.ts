import { NextRequest, NextResponse } from 'next/server';
import type { RouteEstimateResponse, RouteModeEstimate, TravelMode } from '@/types';

// Downtown Béjaïa (Place Gueydon / Boulevard de la Soummam)
const BEJAIA_CENTER = {
  lat: 36.7515,
  lng: 5.0567,
  label: {
    fr: 'Centre-ville de Béjaïa (Place Gueydon)',
    ar: 'وسط مدينة بجاية (ساحة غيدون)',
  },
};

interface OsrmRouteApiResponse {
  code?: string;
  routes?: Array<{
    distance?: number;
    duration?: number;
  }>;
}

function formatDistance(meters: number, locale: 'fr' | 'ar'): string {
  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(1).replace('.', locale === 'ar' ? '.' : ',');
    return locale === 'ar' ? `${km} كم` : `${km} km`;
  }
  return locale === 'ar' ? `${Math.round(meters)} م` : `${Math.round(meters)} m`;
}

function formatDuration(seconds: number, locale: 'fr' | 'ar'): string {
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

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchOsrmProfile(
  profile: 'driving' | 'foot',
  destLat: number,
  destLng: number
): Promise<{ distance: number; duration: number } | null> {
  const coords = `${BEJAIA_CENTER.lng.toFixed(6)},${BEJAIA_CENTER.lat.toFixed(6)};${destLng.toFixed(6)},${destLat.toFixed(6)}`;
  const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=false`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BejaiaExplorer/1.0 (https://bejaia-explorer.dz)',
      },
      signal: AbortSignal.timeout(5500),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as OsrmRouteApiResponse;
    const route = data.routes?.[0];
    if (data.code !== 'Ok' || typeof route?.distance !== 'number' || typeof route?.duration !== 'number') {
      return null;
    }
    return {
      distance: Math.max(100, route.distance),
      duration: Math.max(60, route.duration),
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      destinationLat?: number;
      destinationLng?: number;
      locale?: string;
    };

    const locale: 'fr' | 'ar' = body?.locale === 'ar' ? 'ar' : 'fr';
    const destLat = body?.destinationLat;
    const destLng = body?.destinationLng;

    if (
      typeof destLat !== 'number' ||
      typeof destLng !== 'number' ||
      !Number.isFinite(destLat) ||
      !Number.isFinite(destLng) ||
      destLat < 34 ||
      destLat > 38 ||
      destLng < 2 ||
      destLng > 9
    ) {
      return NextResponse.json(
        { error: 'Coordonnées de destination invalides pour la Wilaya de Béjaïa.' },
        { status: 400 }
      );
    }

    const [drivingResult, footResult] = await Promise.all([
      fetchOsrmProfile('driving', destLat, destLng),
      fetchOsrmProfile('foot', destLat, destLng),
    ]);

    const straightLineMeters = haversineMeters(
      BEJAIA_CENTER.lat,
      BEJAIA_CENTER.lng,
      destLat,
      destLng
    );

    const isLiveOsrm = Boolean(drivingResult);
    // Coastal & mountain road tortuosity factor for Béjaïa relief when falling back
    const carDistance = drivingResult ? drivingResult.distance : Math.max(300, Math.round(straightLineMeters * 1.32));
    const carDuration = drivingResult
      ? Math.max(120, Math.round(drivingResult.duration))
      : Math.max(180, Math.round((carDistance / 1000 / 42) * 3600));

    // Bus / public transport estimation based on road itinerary + stops & boarding time
    const busDistance = carDistance;
    const isShortUrban = carDistance <= 12000;
    const busFactor = isShortUrban ? 1.48 : 1.38;
    const busOverheadSeconds = isShortUrban ? 10 * 60 : 15 * 60;
    const busDuration = Math.max(carDuration + 300, Math.round(carDuration * busFactor + busOverheadSeconds));

    // Walking route via OSRM foot profile or realistic 4.5 km/h pedestrian pace
    const walkDistance = footResult ? footResult.distance : Math.max(250, Math.round(carDistance * 0.94));
    const walkDuration = footResult
      ? Math.max(120, Math.round(footResult.duration))
      : Math.max(180, Math.round((walkDistance / 1000 / 4.5) * 3600));

    const speedOf = (meters: number, seconds: number) =>
      Math.max(1, Math.round((meters / 1000 / (seconds / 3600)) * 10) / 10);

    const walkKm = walkDistance / 1000;
    const carKm = carDistance / 1000;

    const modes: Record<TravelMode, RouteModeEstimate> = {
      car: {
        mode: 'car',
        distanceMeters: carDistance,
        distanceText: formatDistance(carDistance, locale),
        durationSeconds: carDuration,
        durationText: formatDuration(carDuration, locale),
        averageSpeedKmh: speedOf(carDistance, carDuration),
        recommended: carKm >= 2.5,
        note: {
          fr:
            carKm > 25
              ? 'Trajet intercommunal par route nationale ou corniche. Prévoir un léger supplément en haute saison estivale.'
              : 'Accès direct depuis le centre-ville de Béjaïa. Circulation plus dense aux heures de pointe et les week-ends d’été.',
          ar:
            carKm > 25
              ? 'مسار بين البلديات عبر الطريق الوطني أو الكورنيش. يُنصح باحتساب وقت إضافي خلال موسم الصيف.'
              : 'وصول مباشر من وسط مدينة بجاية. قد تزداد حركة المرور خلال ساعات الذروة وعطلات الصيف.',
        },
      },
      bus: {
        mode: 'bus',
        distanceMeters: busDistance,
        distanceText: formatDistance(busDistance, locale),
        durationSeconds: busDuration,
        durationText: formatDuration(busDuration, locale),
        averageSpeedKmh: speedOf(busDistance, busDuration),
        recommended: carKm >= 3 && carKm <= 60,
        note: {
          fr: isShortUrban
            ? 'Estimation incluant les arrêts urbains et le temps d’attente (bus urbains / navettes depuis le centre-ville ou la gare routière).'
            : 'Estimation indicative pour les liaisons intercommunales (bus / fourgons depuis la gare routière de Béjaïa, arrêts inclus).',
          ar: isShortUrban
            ? 'تقدير يشمل التوقفات الحضرية ووقت الانتظار (حافلات النقل الحضري من وسط المدينة أو المحطة البرية).'
            : 'تقدير تقريبي لخطوط النقل بين البلديات (حافلات انطلاقاً من المحطة البرية لبجاية مع احتساب التوقفات).',
        },
      },
      walking: {
        mode: 'walking',
        distanceMeters: walkDistance,
        distanceText: formatDistance(walkDistance, locale),
        durationSeconds: walkDuration,
        durationText: formatDuration(walkDuration, locale),
        averageSpeedKmh: speedOf(walkDistance, walkDuration),
        recommended: walkKm <= 6,
        note: {
          fr:
            walkKm > 12
              ? 'Distance importante depuis le centre-ville : privilégiez la voiture ou le bus pour rejoindre le point de départ, puis explorez à pied sur place.'
              : walkKm > 4
                ? 'Randonnée urbaine ou côtière soutenue avec dénivelé possible. Emportez de l’eau et des chaussures confortables.'
                : 'Parfaitement accessible à pied depuis le centre-ville de Béjaïa pour une découverte au rythme de la marche.',
          ar:
            walkKm > 12
              ? 'مسافة طويلة انطلاقاً من وسط المدينة: يُفضل استخدام السيارة أو الحافلة للوصول ثم الاستكشاف مشياً في عين المكان.'
              : walkKm > 4
                ? 'مسار مشي متوسط إلى طويل قد يتضمن مرتفعات. يُنصح باصطحاب الماء وارتداء أحذية مريحة.'
                : 'وجهة مناسبة جداً للوصول مشياً على الأقدام من وسط مدينة بجاية.',
        },
      },
    };

    const payload: RouteEstimateResponse = {
      origin: BEJAIA_CENTER,
      destination: {
        lat: destLat,
        lng: destLng,
      },
      source: isLiveOsrm ? 'osrm_live' : 'estimated_relief',
      modes,
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Impossible d’estimer les temps de trajet pour le moment.' },
      { status: 500 }
    );
  }
}
