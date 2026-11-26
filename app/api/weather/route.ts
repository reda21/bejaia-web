import { NextResponse } from 'next/server';
import type { BejaiaWeatherData, WeatherForecastDay } from '@/types';

const BEJAIA_LAT = 36.7525;
const BEJAIA_LON = 5.0556;

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    is_day?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: (number | null)[];
  };
}

export async function GET() {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(BEJAIA_LAT));
  url.searchParams.set('longitude', String(BEJAIA_LON));
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max'
  );
  url.searchParams.set('timezone', 'Africa/Algiers');
  url.searchParams.set('forecast_days', '4');

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Weather provider returned an unexpected status' },
        { status: 502 }
      );
    }

    const raw = (await res.json()) as OpenMeteoResponse;
    if (!raw.current || !raw.daily?.time?.length) {
      return NextResponse.json(
        { error: 'Incomplete weather payload from Open-Meteo' },
        { status: 502 }
      );
    }

    // Take the next 3 days (indices 1..3 when 4 days returned, fallback to 0..2)
    const times = raw.daily.time;
    const startIdx = times.length >= 4 ? 1 : 0;
    const forecast: WeatherForecastDay[] = [];

    for (let i = startIdx; i < Math.min(times.length, startIdx + 3); i++) {
      forecast.push({
        date: times[i],
        weatherCode: raw.daily.weather_code?.[i] ?? 0,
        tempMax: Math.round(raw.daily.temperature_2m_max?.[i] ?? 0),
        tempMin: Math.round(raw.daily.temperature_2m_min?.[i] ?? 0),
        precipitationProbability:
          raw.daily.precipitation_probability_max?.[i] ?? null,
      });
    }

    const payload: BejaiaWeatherData = {
      location: 'Béjaïa, Algérie',
      fetchedAt: new Date().toISOString(),
      current: {
        temperature: Math.round(raw.current.temperature_2m ?? 0),
        apparentTemperature: Math.round(raw.current.apparent_temperature ?? 0),
        humidity: Math.round(raw.current.relative_humidity_2m ?? 0),
        windSpeed: Math.round(raw.current.wind_speed_10m ?? 0),
        weatherCode: raw.current.weather_code ?? 0,
        isDay: (raw.current.is_day ?? 1) === 1,
      },
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
