'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Coins,
  RefreshCw,
  AlertCircle,
  WifiOff,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import type { ExchangeRatesPayload } from '@/types';

const FX_CACHE_KEY = 'bejaia_explorer_fx_cache';
const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000] as const;

interface CurrencyMeta {
  code: string;
  symbol: string;
  labelFr: string;
  labelAr: string;
}

const CURRENCIES: CurrencyMeta[] = [
  { code: 'DZD', symbol: 'DA', labelFr: 'Dinar algérien', labelAr: 'الدينار الجزائري' },
  { code: 'EUR', symbol: '€', labelFr: 'Euro', labelAr: 'اليورو' },
  { code: 'USD', symbol: '$', labelFr: 'Dollar américain', labelAr: 'الدولار الأمريكي' },
  { code: 'GBP', symbol: '£', labelFr: 'Livre sterling', labelAr: 'الجنيه الإسترليني' },
  { code: 'CAD', symbol: 'CA$', labelFr: 'Dollar canadien', labelAr: 'الدولار الكندي' },
  { code: 'CHF', symbol: 'CHF', labelFr: 'Franc suisse', labelAr: 'الفرنك السويسري' },
  { code: 'TND', symbol: 'DT', labelFr: 'Dinar tunisien', labelAr: 'الدينار التونسي' },
  { code: 'MAD', symbol: 'DH', labelFr: 'Dirham marocain', labelAr: 'الدرهم المغربي' },
  { code: 'AED', symbol: 'AED', labelFr: 'Dirham des ÉAU', labelAr: 'الدرهم الإماراتي' },
  { code: 'SAR', symbol: 'SAR', labelFr: 'Riyal saoudien', labelAr: 'الريال السعودي' },
];

const COMPARISON_CODES = ['EUR', 'USD', 'GBP', 'CAD', 'CHF', 'TND'] as const;

export function CurrencyConverter() {
  const { locale, t } = useApp();
  const isAr = locale === 'ar';

  const [amountInput, setAmountInput] = useState('2500');
  const [fromCurrency, setFromCurrency] = useState('DZD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [ratesData, setRatesData] = useState<ExchangeRatesPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fromOfflineCache, setFromOfflineCache] = useState(false);

  const loadRates = useCallback(async (isInitial = false) => {
    if (!isInitial) setLoading(true);
    setError(false);
    setFromOfflineCache(false);

    try {
      const res = await fetch('/api/exchange-rates');
      if (!res.ok) throw new Error('fx_fetch_failed');
      const data = (await res.json()) as ExchangeRatesPayload;
      if (!data?.rates?.DZD) throw new Error('fx_invalid_payload');
      setRatesData(data);
      try {
        localStorage.setItem(FX_CACHE_KEY, JSON.stringify(data));
      } catch {
        // Ignore storage errors
      }
    } catch {
      try {
        const cached = localStorage.getItem(FX_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as ExchangeRatesPayload;
          if (parsed?.rates?.DZD) {
            setRatesData(parsed);
            setFromOfflineCache(true);
            return;
          }
        }
      } catch {
        // Ignore cache read error
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) void loadRates(true);
    });
    return () => {
      active = false;
    };
  }, [loadRates]);

  const parsedAmount = useMemo(() => {
    const normalized = amountInput.replace(',', '.').replace(/[^0-9.]/g, '');
    const n = Number.parseFloat(normalized);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(n, 1_000_000_000);
  }, [amountInput]);

  const convert = useCallback(
    (amount: number, from: string, to: string): number | null => {
      if (!ratesData) return null;
      const fromRate = ratesData.rates[from];
      const toRate = ratesData.rates[to];
      if (!fromRate || !toRate) return null;
      // Base is DZD: rates[X] = units of X per 1 DZD
      const inDzd = amount / fromRate;
      return inDzd * toRate;
    },
    [ratesData]
  );

  const convertedValue = useMemo(
    () => convert(parsedAmount, fromCurrency, toCurrency),
    [convert, parsedAmount, fromCurrency, toCurrency]
  );

  const unitRate = useMemo(
    () => convert(1, fromCurrency, toCurrency),
    [convert, fromCurrency, toCurrency]
  );

  const inverseUnitRate = useMemo(
    () => convert(1, toCurrency, fromCurrency),
    [convert, fromCurrency, toCurrency]
  );

  const formatMoney = useCallback(
    (value: number, code: string) => {
      const decimals = code === 'DZD' ? (value >= 100 ? 0 : 2) : 2;
      try {
        return new Intl.NumberFormat(isAr ? 'ar-DZ' : 'fr-FR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value);
      } catch {
        return value.toFixed(decimals);
      }
    },
    [isAr]
  );

  const formatUpdatedDate = (utcString: string) => {
    try {
      const d = new Date(utcString);
      if (Number.isNaN(d.getTime())) return utcString;
      return new Intl.DateTimeFormat(isAr ? 'ar-DZ' : 'fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return utcString;
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const availableCurrencies = useMemo(() => {
    if (!ratesData) return CURRENCIES;
    return CURRENCIES.filter((c) => typeof ratesData.rates[c.code] === 'number');
  }, [ratesData]);

  const comparisonTargets = useMemo(() => {
    return COMPARISON_CODES.filter((code) => code !== fromCurrency && ratesData?.rates[code]);
  }, [fromCurrency, ratesData]);

  return (
    <div className="bg-white border border-[#103B50]/12 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#103B50]/10">
        <div className="space-y-1 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#087E9B] inline-flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5" />
            <span>{t('currency.kicker')}</span>
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
            {t('currency.title')}
          </h2>
          <p className="text-sm text-[#51636D] leading-relaxed">{t('currency.subtitle')}</p>
        </div>

        <button
          type="button"
          onClick={() => void loadRates(false)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F4EFE5] border border-[#103B50]/15 rounded-md text-xs font-medium text-[#103B50] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#087E9B] ${loading ? 'animate-spin' : ''}`} />
          <span>{t('currency.refresh')}</span>
        </button>
      </div>

      {loading && !ratesData ? (
        <div className="py-6 text-sm text-[#51636D]">{t('currency.loading')}</div>
      ) : error && !ratesData ? (
        <div className="p-4 bg-[#FAF8F3] border border-[#C47B55]/40 rounded-md flex items-center gap-2.5 text-sm text-[#103B50]">
          <AlertCircle className="w-4 h-4 text-[#C47B55] shrink-0" />
          <span>{t('currency.error')}</span>
        </div>
      ) : ratesData ? (
        <div className="space-y-6">
          {fromOfflineCache && (
            <div className="px-3.5 py-2 bg-[#FAF8F3] border border-[#C47B55]/35 rounded-md flex items-center gap-2 text-xs text-[#103B50]">
              <WifiOff className="w-3.5 h-3.5 text-[#C47B55] shrink-0" />
              <span>{t('currency.offlineCached')}</span>
            </div>
          )}

          {/* Input Controls Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4 space-y-1.5">
              <label
                htmlFor="fx-amount-input"
                className="block text-xs font-semibold text-[#103B50]"
              >
                {t('currency.amountLabel')}
              </label>
              <input
                id="fx-amount-input"
                type="text"
                inputMode="decimal"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="1000"
                className="w-full h-11 px-3.5 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-base font-semibold text-[#103B50] tabular-nums"
              />
            </div>

            <div className="lg:col-span-3 space-y-1.5">
              <label htmlFor="fx-from" className="block text-xs font-semibold text-[#103B50]">
                {t('currency.fromLabel')}
              </label>
              <select
                id="fx-from"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full h-11 px-3 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm font-medium text-[#103B50]"
              >
                {availableCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {isAr ? c.labelAr : c.labelFr}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                aria-label={t('currency.swap')}
                title={t('currency.swap')}
                className="w-full lg:w-11 h-11 inline-flex items-center justify-center gap-2 bg-[#103B50] hover:bg-[#087E9B] text-white rounded-md transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span className="lg:hidden text-xs font-medium">{t('currency.swap')}</span>
              </button>
            </div>

            <div className="lg:col-span-3 space-y-1.5">
              <label htmlFor="fx-to" className="block text-xs font-semibold text-[#103B50]">
                {t('currency.toLabel')}
              </label>
              <select
                id="fx-to"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full h-11 px-3 bg-[#FAF8F3] border border-[#103B50]/15 rounded-md text-sm font-medium text-[#103B50]"
              >
                {availableCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {isAr ? c.labelAr : c.labelFr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Arithmetic Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#51636D] me-1">{t('currency.quickAmounts')} :</span>
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmountInput(String(amt))}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors tabular-nums ${
                  parsedAmount === amt
                    ? 'bg-[#103B50] border-[#103B50] text-white'
                    : 'bg-[#FAF8F3] border-[#103B50]/12 text-[#103B50] hover:bg-[#F4EFE5]'
                }`}
              >
                {new Intl.NumberFormat(isAr ? 'ar-DZ' : 'fr-FR').format(amt)} {fromCurrency}
              </button>
            ))}
          </div>

          {/* Main Conversion Result + Live Unit Rate */}
          <div className="p-5 sm:p-6 bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-[#51636D] tabular-nums">
                {formatMoney(parsedAmount, fromCurrency)} {fromCurrency} =
              </p>
              <p className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50] tabular-nums">
                {convertedValue !== null ? formatMoney(convertedValue, toCurrency) : '—'}{' '}
                <span className="text-xl sm:text-2xl text-[#087E9B]">{toCurrency}</span>
              </p>
            </div>

            {unitRate !== null && inverseUnitRate !== null && (
              <div className="text-xs text-[#51636D] space-y-1 md:text-end tabular-nums">
                <p className="font-medium text-[#103B50]">
                  1 {fromCurrency} ={' '}
                  {unitRate < 0.05 ? unitRate.toFixed(4) : formatMoney(unitRate, toCurrency)}{' '}
                  {toCurrency}
                </p>
                <p>
                  1 {toCurrency} ={' '}
                  {inverseUnitRate < 0.05
                    ? inverseUnitRate.toFixed(4)
                    : formatMoney(inverseUnitRate, fromCurrency)}{' '}
                  {fromCurrency}
                </p>
                <p className="text-[11px]">
                  {t('currency.updatedLabel')} : {formatUpdatedDate(ratesData.updatedAtUtc)}
                </p>
              </div>
            )}
          </div>

          {/* Multi-Currency Comparison Grid */}
          {comparisonTargets.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#51636D]">
                {t('currency.multiTitle')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {comparisonTargets.map((code) => {
                  const meta = CURRENCIES.find((c) => c.code === code);
                  const val = convert(parsedAmount, fromCurrency, code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setToCurrency(code)}
                      className={`p-3 rounded-md border text-start transition-colors ${
                        toCurrency === code
                          ? 'bg-[#103B50] border-[#103B50] text-white'
                          : 'bg-[#FAF8F3] border-[#103B50]/10 hover:border-[#087E9B] text-[#103B50]'
                      }`}
                    >
                      <p
                        className={`text-[11px] font-semibold ${
                          toCurrency === code ? 'text-white/80' : 'text-[#087E9B]'
                        }`}
                      >
                        {code}
                      </p>
                      <p className="font-serif text-base font-semibold tabular-nums mt-0.5">
                        {val !== null ? formatMoney(val, code) : '—'}
                      </p>
                      <p
                        className={`text-[11px] truncate ${
                          toCurrency === code ? 'text-white/75' : 'text-[#51636D]'
                        }`}
                      >
                        {meta ? (isAr ? meta.labelAr : meta.labelFr) : code}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-xs text-[#51636D] leading-relaxed">{t('currency.disclaimer')}</p>
        </div>
      ) : null}
    </div>
  );
}
