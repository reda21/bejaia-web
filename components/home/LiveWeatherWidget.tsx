'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  Cloud,
  CloudFog,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  RefreshCw,
  Thermometer,
  AlertTriangle,
  ShieldCheck,
  Mountain,
  Flame,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import type { BejaiaWeatherData, WeatherAlert } from '@/types';

function describeWmoCode(code: number, locale: string): string {
  const isAr = locale === 'ar';
  if (code === 0) return isAr ? 'سماء صافية' : 'Ciel dégagé';
  if (code === 1 || code === 2) return isAr ? 'غائم جزئياً' : 'Peu nuageux';
  if (code === 3) return isAr ? 'غائم' : 'Couvert';
  if (code === 45 || code === 48) return isAr ? 'ضباب' : 'Brume ou brouillard';
  if (code >= 51 && code <= 57) return isAr ? 'رذاذ خفيف' : 'Bruine légère';
  if (code >= 61 && code <= 67) return isAr ? 'أمطار' : 'Pluie';
  if (code >= 71 && code <= 77) return isAr ? 'تساقط ثلوج' : 'Neige en altitude';
  if (code >= 80 && code <= 82) return isAr ? 'زخات مطرية' : 'Averses';
  if (code === 85 || code === 86) return isAr ? 'زخات ثلجية' : 'Averses de neige';
  if (code >= 95) return isAr ? 'عواصف رعدية' : 'Orages';
  return isAr ? 'طقس معتدل' : 'Temps variable';
}

function WeatherCodeIcon({
  code,
  isDay = true,
  className = 'w-6 h-6',
}: {
  code: number;
  isDay?: boolean;
  className?: string;
}) {
  if (code === 0) {
    return isDay ? (
      <Sun className={`${className} text-[#C47B55]`} />
    ) : (
      <Moon className={`${className} text-[#087E9B]`} />
    );
  }
  if (code === 1 || code === 2) {
    return <CloudSun className={`${className} text-[#C47B55]`} />;
  }
  if (code === 3) {
    return <Cloud className={`${className} text-[#51636D]`} />;
  }
  if (code === 45 || code === 48) {
    return <CloudFog className={`${className} text-[#51636D]`} />;
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return <CloudRain className={`${className} text-[#087E9B]`} />;
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return <Snowflake className={`${className} text-[#087E9B]`} />;
  }
  if (code >= 95) {
    return <CloudLightning className={`${className} text-[#C47B55]`} />;
  }
  return <CloudSun className={`${className} text-[#087E9B]`} />;
}

function AlertIcon({ type, className = 'w-5 h-5' }: { type: WeatherAlert['type']; className?: string }) {
  if (type === 'coastal_storm') return <CloudLightning className={className} />;
  if (type === 'mountain_snow') return <Snowflake className={className} />;
  if (type === 'heavy_rain') return <CloudRain className={className} />;
  if (type === 'heatwave') return <Flame className={className} />;
  return <AlertTriangle className={className} />;
}

export function LiveWeatherWidget() {
  const { locale, t, lt } = useApp();
  const [weather, setWeather] = useState<BejaiaWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadWeather = useCallback(async (isInitial = false) => {
    if (!isInitial) {
      setLoading(true);
    }
    setError(false);
    try {
      const res = await fetch('/api/weather');
      if (!res.ok) throw new Error('weather_fetch_failed');
      const data = (await res.json()) as BejaiaWeatherData;
      setWeather(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) void loadWeather(true);
    });
    return () => {
      active = false;
    };
  }, [loadWeather]);

  const formatDayLabel = (isoDate: string) => {
    try {
      const date = new Date(`${isoDate}T12:00:00Z`);
      return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-DZ' : 'fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(date);
    } catch {
      return isoDate;
    }
  };

  const alerts = weather?.alerts ?? [];

  return (
    <section
      aria-label={t('weather.title')}
      className="bg-[#FAF8F3] border-b border-[#103B50]/10 py-8 sm:py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#103B50]/12 rounded-lg p-5 sm:p-7 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#103B50]/10">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#087E9B]">
                {t('weather.kicker')}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50]">
                {t('weather.title')}
              </h2>
              <p className="text-xs text-[#51636D]">{t('weather.locationLabel')}</p>
            </div>

            <button
              type="button"
              onClick={() => void loadWeather(false)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F4EFE5] border border-[#103B50]/15 rounded-md text-xs font-medium text-[#103B50] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#087E9B] ${loading ? 'animate-spin' : ''}`} />
              <span>{t('weather.refresh')}</span>
            </button>
          </div>

          {loading && !weather ? (
            <div className="py-8 text-sm text-[#51636D]">{t('weather.loading')}</div>
          ) : error && !weather ? (
            <div className="py-6 text-sm text-[#C47B55]">{t('weather.error')}</div>
          ) : weather ? (
            <div className="space-y-5 pt-5">
              {/* Automatic Extreme Weather Alerts Banner (Coastal Storm / Mountain Snow / Heavy Rain / Heatwave) */}
              {alerts.length > 0 ? (
                <div
                  role="alert"
                  aria-label={t('weather.alertsTitle')}
                  className="space-y-3"
                >
                  {alerts.map((alert) => {
                    const isSevere = alert.severity === 'severe';
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-start gap-3.5 ${
                          isSevere
                            ? 'bg-[#C47B55]/15 border-[#C47B55] text-[#103B50]'
                            : 'bg-[#FAF8F3] border-[#C47B55]/55 text-[#103B50]'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-md shrink-0 self-start ${
                            isSevere
                              ? 'bg-[#C47B55] text-white'
                              : 'bg-[#C47B55]/15 text-[#C47B55]'
                          }`}
                        >
                          <AlertIcon type={alert.type} className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C47B55]">
                              {isSevere ? t('weather.alertSevere') : t('weather.alertAdvisory')}
                            </span>
                            {alert.metricLabel && (
                              <>
                                <span aria-hidden="true" className="text-[#51636D]/50">
                                  ·
                                </span>
                                <span className="text-xs font-semibold text-[#103B50] tabular-nums">
                                  {alert.metricLabel}
                                </span>
                              </>
                            )}
                          </div>
                          <h3 className="font-serif text-base sm:text-lg font-semibold text-[#103B50]">
                            {lt(alert.title)}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#51636D] leading-relaxed">
                            {lt(alert.description)}
                          </p>
                          <p className="text-xs font-medium text-[#103B50] pt-0.5">
                            {lt(alert.advice)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-2.5 bg-[#FAF8F3] border border-[#356B50]/25 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="inline-flex items-center gap-2 text-[#103B50]">
                    <ShieldCheck className="w-4 h-4 text-[#356B50] shrink-0" />
                    <span>{t('weather.noAlerts')}</span>
                  </span>
                  {weather.mountain && (
                    <span className="inline-flex items-center gap-1.5 text-[#51636D] tabular-nums">
                      <Mountain className="w-3.5 h-3.5 text-[#356B50] shrink-0" />
                      <span className="font-medium text-[#103B50]">
                        {t('weather.mountainLabel')} :
                      </span>
                      <span>
                        {weather.mountain.temperature}°C ·{' '}
                        {describeWmoCode(weather.mountain.weatherCode, locale)}
                      </span>
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Current conditions */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center gap-5 bg-[#FAF8F3] border border-[#103B50]/10 rounded-lg p-5">
                    <div className="p-3.5 bg-white border border-[#103B50]/10 rounded-full shrink-0">
                      <WeatherCodeIcon
                        code={weather.current.weatherCode}
                        isDay={weather.current.isDay}
                        className="w-9 h-9"
                      />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-serif text-4xl font-semibold text-[#103B50] tabular-nums">
                          {weather.current.temperature}°C
                        </span>
                        <span className="text-sm font-medium text-[#087E9B]">
                          {describeWmoCode(weather.current.weatherCode, locale)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#51636D] tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-[#C47B55]" />
                          {t('weather.feelsLike')} {weather.current.apparentTemperature}°C
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Wind className="w-3.5 h-3.5 text-[#087E9B]" />
                          {t('weather.wind')} {weather.current.windSpeed} km/h
                          {typeof weather.current.windGusts === 'number' &&
                            weather.current.windGusts > weather.current.windSpeed + 8 && (
                              <span>
                                {' '}
                                ({t('weather.gusts')} {weather.current.windGusts})
                              </span>
                            )}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-[#356B50]" />
                          {t('weather.humidity')} {weather.current.humidity}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {weather.mountain && alerts.length > 0 && (
                    <div className="px-4 py-2.5 bg-[#FAF8F3] border border-[#103B50]/10 rounded-md flex items-center justify-between gap-2 text-xs tabular-nums">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#103B50]">
                        <Mountain className="w-3.5 h-3.5 text-[#356B50]" />
                        <span>{lt(weather.mountain.location)}</span>
                      </span>
                      <span className="text-[#51636D]">
                        {weather.mountain.temperature}°C · {t('weather.gusts')}{' '}
                        {weather.mountain.windGusts} km/h
                      </span>
                    </div>
                  )}
                </div>

                {/* 3-day forecast */}
                <div className="lg:col-span-7 space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#51636D]">
                    {t('weather.forecastTitle')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {weather.forecast.map((day) => (
                      <div
                        key={day.date}
                        className="p-3.5 bg-[#FAF8F3] border border-[#103B50]/10 rounded-md flex sm:flex-col items-center sm:items-start justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <WeatherCodeIcon code={day.weatherCode} className="w-5 h-5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-[#103B50] capitalize">
                              {formatDayLabel(day.date)}
                            </p>
                            <p className="text-[11px] text-[#51636D]">
                              {describeWmoCode(day.weatherCode, locale)}
                            </p>
                          </div>
                        </div>
                        <div className="text-end sm:text-start sm:w-full sm:pt-2 sm:border-t sm:border-[#103B50]/10 flex sm:items-center sm:justify-between gap-2 text-xs tabular-nums">
                          <span className="font-semibold text-[#103B50]">
                            {day.tempMin}° / {day.tempMax}°C
                          </span>
                          {day.precipitationProbability !== null &&
                            day.precipitationProbability > 0 && (
                              <span className="text-[11px] text-[#087E9B]">
                                {t('weather.precipChance')} {day.precipitationProbability}%
                              </span>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#51636D]">{t('weather.sourceNote')}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
