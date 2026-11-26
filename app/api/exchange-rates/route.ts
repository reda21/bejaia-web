import { NextResponse } from 'next/server';
import type { ExchangeRatesPayload } from '@/types';

const SUPPORTED_CURRENCIES = [
  'DZD',
  'EUR',
  'USD',
  'GBP',
  'CAD',
  'CHF',
  'TND',
  'MAD',
  'AED',
  'SAR',
] as const;

interface OpenErApiResponse {
  result?: string;
  time_last_update_utc?: string;
  rates?: Record<string, number>;
}

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/DZD', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(7000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Exchange rate provider returned an unexpected status' },
        { status: 502 }
      );
    }

    const raw = (await res.json()) as OpenErApiResponse;
    if (raw.result !== 'success' || !raw.rates || typeof raw.rates !== 'object') {
      return NextResponse.json(
        { error: 'Invalid exchange rate payload' },
        { status: 502 }
      );
    }

    const filteredRates: Record<string, number> = { DZD: 1 };
    for (const code of SUPPORTED_CURRENCIES) {
      const value = raw.rates[code];
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        filteredRates[code] = value;
      }
    }

    if (Object.keys(filteredRates).length < 3) {
      return NextResponse.json(
        { error: 'Incomplete exchange rate table' },
        { status: 502 }
      );
    }

    const payload: ExchangeRatesPayload = {
      base: 'DZD',
      updatedAtUtc:
        typeof raw.time_last_update_utc === 'string'
          ? raw.time_last_update_utc
          : new Date().toUTCString(),
      fetchedAt: new Date().toISOString(),
      rates: filteredRates,
      source: 'ExchangeRate-API (open.er-api.com)',
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to reach exchange rate service' },
      { status: 503 }
    );
  }
}
