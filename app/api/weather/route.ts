import { NextResponse } from 'next/server';
import type {
  BejaiaWeatherData,
  MountainWeatherSnapshot,
  WeatherAlert,
  WeatherForecastDay,
} from '@/types';

// Littoral Béjaïa (Cap Carbon / Gouraya bay) & Highlands (Massif de l'Akfadou / Adekar)
const COAST_LAT = 36.7525;
const COAST_LON = 5.0556;
const MOUNTAIN_LAT = 36.6897;
const MOUNTAIN_LON = 4.6214;

interface OpenMeteoLocationPayload {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    wind_gusts_10m?: number;
    is_day?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: (number | null)[];
    wind_gusts_10m_max?: (number | null)[];
    precipitation_sum?: (number | null)[];
    snowfall_sum?: (number | null)[];
  };
}

const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const THUNDERSTORM_CODES = new Set([95, 96, 99]);
const HEAVY_RAIN_CODES = new Set([65, 82]);

function buildExtremeAlerts(
  coast: OpenMeteoLocationPayload,
  mountain?: OpenMeteoLocationPayload
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  const coastWind = Math.round(coast.current?.wind_speed_10m ?? 0);
  const coastGusts = Math.round(coast.current?.wind_gusts_10m ?? coastWind);
  const coastCode = coast.current?.weather_code ?? 0;
  const coastMaxGust48h = Math.round(
    Math.max(
      coastGusts,
      coast.daily?.wind_gusts_10m_max?.[0] ?? 0,
      coast.daily?.wind_gusts_10m_max?.[1] ?? 0
    )
  );
  const coastStormUpcoming =
    THUNDERSTORM_CODES.has(coastCode) ||
    THUNDERSTORM_CODES.has(coast.daily?.weather_code?.[0] ?? 0) ||
    THUNDERSTORM_CODES.has(coast.daily?.weather_code?.[1] ?? 0);

  // 1. Coastal Storm / Violent Winds Alert
  if (coastStormUpcoming || coastMaxGust48h >= 55 || coastWind >= 45) {
    const isSevere =
      coastMaxGust48h >= 75 ||
      coastCode === 96 ||
      coastCode === 99 ||
      coast.daily?.weather_code?.[0] === 96 ||
      coast.daily?.weather_code?.[0] === 99;

    alerts.push({
      id: 'coastal-storm',
      type: 'coastal_storm',
      severity: isSevere ? 'severe' : 'advisory',
      zone: 'coast',
      title: {
        fr: isSevere
          ? 'Alerte tempête et vents violents sur le littoral'
          : 'Vigilance rafales et orages sur le littoral',
        ar: isSevere
          ? 'تحذير من عاصفة ورياح عاتية على الساحل'
          : 'يقظة جوية: هبات رياح قوية وعواصف على الساحل',
      },
      description: {
        fr: `Conditions agitées détectées sur la baie de Béjaïa (rafales jusqu'à ${coastMaxGust48h} km/h). Risque de forte houle sur les corniches et plages exposées.`,
        ar: `أحوال جوية مضطربة على خليج بجاية (هبات رياح تصل إلى ${coastMaxGust48h} كم/سا) مع احتمال هيجان البحر على السواحل المكشوفة.`,
      },
      advice: {
        fr: 'Évitez les abords des falaises du Cap Carbon, les sorties en mer et respectez les drapeaux de baignade.',
        ar: 'تجنب الاقتراب من منحدرات رأس كربون والرحلات البحرية واحترم رايات السلامة على الشواطئ.',
      },
      metricLabel: `${coastMaxGust48h} km/h`,
    });
  }

  // 2. Mountain Snow / Freeze Alert (Akfadou & high reliefs)
  const mtnTemp = Math.round(mountain?.current?.temperature_2m ?? 99);
  const mtnCode = mountain?.current?.weather_code ?? 0;
  const mtnMin48h = Math.min(
    mtnTemp,
    mountain?.daily?.temperature_2m_min?.[0] ?? 99,
    mountain?.daily?.temperature_2m_min?.[1] ?? 99
  );
  const mtnSnowSum = Math.max(
    mountain?.daily?.snowfall_sum?.[0] ?? 0,
    mountain?.daily?.snowfall_sum?.[1] ?? 0,
    coast.daily?.snowfall_sum?.[0] ?? 0
  );
  const hasSnowCode =
    SNOW_CODES.has(mtnCode) ||
    SNOW_CODES.has(mountain?.daily?.weather_code?.[0] ?? 0) ||
    SNOW_CODES.has(mountain?.daily?.weather_code?.[1] ?? 0) ||
    SNOW_CODES.has(coastCode);
  const mountainFreezeWithPrecip =
    mtnMin48h <= 1 &&
    Math.max(
      mountain?.daily?.precipitation_sum?.[0] ?? 0,
      mountain?.daily?.precipitation_sum?.[1] ?? 0
    ) >= 2;

  if (hasSnowCode || mtnSnowSum > 0 || mountainFreezeWithPrecip) {
    const isSevere = mtnSnowSum >= 5 || mtnCode === 75 || mtnCode === 86;
    alerts.push({
      id: 'mountain-snow',
      type: 'mountain_snow',
      severity: isSevere ? 'severe' : 'advisory',
      zone: 'mountain',
      title: {
        fr: isSevere
          ? 'Alerte neige abondante et verglas en montagne'
          : 'Vigilance neige et froid sur les reliefs (Akfadou · Babors)',
        ar: isSevere
          ? 'تحذير من تساقط ثلوج كثيف وجليد في الجبال'
          : 'يقظة جوية: ثلوج وبرد شديد على المرتفعات (أكفادو · البابور)',
      },
      description: {
        fr:
          mtnSnowSum > 0
            ? `Épisode neigeux relevé sur les hauteurs de la Wilaya (cumul estimé ${mtnSnowSum.toFixed(1)} cm, température minimale ${Math.round(mtnMin48h)}°C).`
            : `Risque de neige ou de verglas sur les crêtes de l'Akfadou et des cols de montagne (minimale prévue ${Math.round(mtnMin48h)}°C).`,
        ar:
          mtnSnowSum > 0
            ? `تساقط ثلوج مرتقب على مرتفعات الولاية (تراكم مقدر بـ ${mtnSnowSum.toFixed(1)} سم ودرجة حرارة دنيا ${Math.round(mtnMin48h)}°م).`
            : `احتمال تشكل الجليد أو تساقط الثلوج على قمم أكفادو والممرات الجبلية (دنيا ${Math.round(mtnMin48h)}°م).`,
      },
      advice: {
        fr: 'Vérifiez l’état des axes montagneux (RN12 Adekar, RN9 Kherrata) et reportez les randonnées d’altitude non équipées.',
        ar: 'تحقق من حالة الطرق الجبلية (الوطني 12 أدكار، الوطني 9 خراطة) وأجّل جولات المشي الجبلي دون تجهيز شتوي.',
      },
      metricLabel: mtnSnowSum > 0 ? `${mtnSnowSum.toFixed(1)} cm` : `${Math.round(mtnMin48h)}°C`,
    });
  }

  // 3. Heavy Rain / Gorge Runoff Alert
  const maxRain48h = Math.max(
    coast.daily?.precipitation_sum?.[0] ?? 0,
    coast.daily?.precipitation_sum?.[1] ?? 0,
    mountain?.daily?.precipitation_sum?.[0] ?? 0
  );
  const heavyRainCode =
    HEAVY_RAIN_CODES.has(coastCode) ||
    HEAVY_RAIN_CODES.has(coast.daily?.weather_code?.[0] ?? 0);

  if (heavyRainCode || maxRain48h >= 25) {
    const isSevere = maxRain48h >= 45;
    alerts.push({
      id: 'heavy-rain',
      type: 'heavy_rain',
      severity: isSevere ? 'severe' : 'advisory',
      zone: 'wilaya',
      title: {
        fr: isSevere
          ? 'Alerte fortes pluies et ruissellements'
          : 'Vigilance pluies soutenues sur la Wilaya',
        ar: isSevere
          ? 'تحذير من أمطار غزيرة وسيول محتملة'
          : 'يقظة جوية: أمطار غزيرة متوقعة عبر الولاية',
      },
      description: {
        fr: `Cumuls de précipitations importants attendus (${Math.round(maxRain48h)} mm). Chaussées glissantes et risque de chutes de pierres dans les gorges.`,
        ar: `كميات أمطار معتبرة متوقعة (${Math.round(maxRain48h)} ملم)، مع خطر انزلاق الطرق وتساقط الصخور في المضايق الجبلية.`,
      },
      advice: {
        fr: 'Redoublez de prudence dans les gorges de Kherrata, près des oueds et sur les sentiers forestiers.',
        ar: 'توخَّ الحذر الشديد في مضيق خراطة وقرب الأودية وعلى المسالك الغابية.',
      },
      metricLabel: `${Math.round(maxRain48h)} mm`,
    });
  }

  // 4. Extreme Heatwave & Forest Fire Vigilance
  const currentTemp = Math.round(coast.current?.temperature_2m ?? 0);
  const apparentTemp = Math.round(coast.current?.apparent_temperature ?? currentTemp);
  const maxTemp48h = Math.round(
    Math.max(
      currentTemp,
      coast.daily?.temperature_2m_max?.[0] ?? 0,
      coast.daily?.temperature_2m_max?.[1] ?? 0
    )
  );

  if (currentTemp >= 36 || apparentTemp >= 38 || maxTemp48h >= 37) {
    const isSevere = maxTemp48h >= 40 || apparentTemp >= 42;
    alerts.push({
      id: 'heatwave',
      type: 'heatwave',
      severity: isSevere ? 'severe' : 'advisory',
      zone: 'wilaya',
      title: {
        fr: isSevere
          ? 'Alerte canicule et risque incendie élevé'
          : 'Vigilance fortes chaleurs sur la Wilaya',
        ar: isSevere
          ? 'تحذير من موجة حر شديدة وخطر حرائق الغابات'
          : 'يقظة جوية: درجات حرارة مرتفعة في الولاية',
      },
      description: {
        fr: `Températures élevées relevées ou prévues jusqu'à ${maxTemp48h}°C. Vigilance accrue dans les massifs forestiers de Gouraya et de l'Akfadou.`,
        ar: `درجات حرارة مرتفعة تصل إلى ${maxTemp48h}°م مع ضرورة اليقظة القصوى في الغابات (قوراية وأكفادو).`,
      },
      advice: {
        fr: 'Privilégiez les visites tôt le matin, hydratez-vous régulièrement et respectez l’interdiction absolue de feu en forêt.',
        ar: 'فضّل الزيارات في الصباح الباكر، واشرب كمية كافية من الماء، وتجنب إشعال أي نار في الغابات.',
      },
      metricLabel: `${maxTemp48h}°C`,
    });
  }

  return alerts;
}

export async function GET() {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', `${COAST_LAT},${MOUNTAIN_LAT}`);
  url.searchParams.set('longitude', `${COAST_LON},${MOUNTAIN_LON}`);
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,is_day'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_gusts_10m_max,precipitation_sum,snowfall_sum'
  );
  url.searchParams.set('timezone', 'Africa/Algiers');
  url.searchParams.set('forecast_days', '4');

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Weather provider returned an unexpected status' },
        { status: 502 }
      );
    }

    const raw = (await res.json()) as
      | OpenMeteoLocationPayload
      | OpenMeteoLocationPayload[];

    const coast = Array.isArray(raw) ? raw[0] : raw;
    const mountain = Array.isArray(raw) ? raw[1] : undefined;

    if (!coast?.current || !coast.daily?.time?.length) {
      return NextResponse.json(
        { error: 'Incomplete weather payload from Open-Meteo' },
        { status: 502 }
      );
    }

    const times = coast.daily.time;
    const startIdx = times.length >= 4 ? 1 : 0;
    const forecast: WeatherForecastDay[] = [];

    for (let i = startIdx; i < Math.min(times.length, startIdx + 3); i++) {
      forecast.push({
        date: times[i],
        weatherCode: coast.daily.weather_code?.[i] ?? 0,
        tempMax: Math.round(coast.daily.temperature_2m_max?.[i] ?? 0),
        tempMin: Math.round(coast.daily.temperature_2m_min?.[i] ?? 0),
        precipitationProbability:
          coast.daily.precipitation_probability_max?.[i] ?? null,
        windGustsMax:
          coast.daily.wind_gusts_10m_max?.[i] !== null &&
          coast.daily.wind_gusts_10m_max?.[i] !== undefined
            ? Math.round(coast.daily.wind_gusts_10m_max[i]!)
            : null,
        precipitationSum: coast.daily.precipitation_sum?.[i] ?? null,
        snowfallSum: coast.daily.snowfall_sum?.[i] ?? null,
      });
    }

    const mountainSnapshot: MountainWeatherSnapshot | undefined = mountain?.current
      ? {
          location: {
            fr: "Massif de l'Akfadou (Adekar)",
            ar: 'مرتفعات أكفادو (أدكار)',
          },
          elevationLabel: '~1 000–1 600 m',
          temperature: Math.round(mountain.current.temperature_2m ?? 0),
          windGusts: Math.round(
            mountain.current.wind_gusts_10m ?? mountain.current.wind_speed_10m ?? 0
          ),
          weatherCode: mountain.current.weather_code ?? 0,
        }
      : undefined;

    const alerts = buildExtremeAlerts(coast, mountain);

    const payload: BejaiaWeatherData = {
      location: 'Béjaïa, Algérie',
      fetchedAt: new Date().toISOString(),
      current: {
        temperature: Math.round(coast.current.temperature_2m ?? 0),
        apparentTemperature: Math.round(coast.current.apparent_temperature ?? 0),
        humidity: Math.round(coast.current.relative_humidity_2m ?? 0),
        windSpeed: Math.round(coast.current.wind_speed_10m ?? 0),
        windGusts: Math.round(
          coast.current.wind_gusts_10m ?? coast.current.wind_speed_10m ?? 0
        ),
        weatherCode: coast.current.weather_code ?? 0,
        isDay: (coast.current.is_day ?? 1) === 1,
      },
      mountain: mountainSnapshot,
      alerts,
      forecast,
      source: 'Open-Meteo (open-meteo.com)',
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to reach weather service' },
      { status: 503 }
    );
  }
}
