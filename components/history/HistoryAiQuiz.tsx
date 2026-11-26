'use client';

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Loader2,
  AlertCircle,
  Landmark,
  BookOpen,
} from 'lucide-react';
import { useApp } from '@/components/providers/AppProviders';
import type {
  HistoryQuizDifficulty,
  HistoryQuizQuestion,
  HistoryQuizResponse,
  HistoryQuizTopic,
} from '@/types';

const BEST_SCORE_STORAGE_KEY = 'bejaia_history_quiz_best_pct';
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function HistoryAiQuiz() {
  const { locale, t } = useApp();
  const [topic, setTopic] = useState<HistoryQuizTopic>('both');
  const [difficulty, setDifficulty] = useState<HistoryQuizDifficulty>('intermediaire');
  const [questions, setQuestions] = useState<HistoryQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<'setup' | 'loading' | 'playing' | 'results'>('setup');
  const [error, setError] = useState<string | null>(null);
  const [bestPct, setBestPct] = useState<number | null>(null);

  const apiLocale: 'fr' | 'ar' = locale === 'ar' ? 'ar' : 'fr';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
      if (saved) {
        const parsed = Number.parseInt(saved, 10);
        if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
          queueMicrotask(() => setBestPct(parsed));
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const handleGenerateQuiz = async () => {
    setPhase('loading');
    setError(null);
    setAnswers({});
    setCurrentIdx(0);

    try {
      const res = await fetch('/api/history-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          difficulty,
          count: 5,
          locale: apiLocale,
        }),
      });

      const data = (await res.json()) as HistoryQuizResponse & { error?: string };

      if (!res.ok || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(data.error || t('historyQuiz.errorGeneric'));
      }

      setQuestions(data.questions);
      setPhase('playing');
    } catch (err: unknown) {
      setError(err instanceof Error && err.message ? err.message : t('historyQuiz.errorGeneric'));
      setPhase('setup');
    }
  };

  const currentQuestion = questions[currentIdx];
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;
  const hasAnsweredCurrent = selectedOption !== undefined;

  const totalCorrect = questions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const handleSelectOption = (optionIdx: number) => {
    if (!currentQuestion || hasAnsweredCurrent) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      return;
    }

    const pct = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;
    if (bestPct === null || pct > bestPct) {
      setBestPct(pct);
      try {
        window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(pct));
      } catch {
        // Ignore storage write errors
      }
    }
    setPhase('results');
  };

  const romaineStats = questions
    .filter((q) => q.period === 'romaine')
    .reduce(
      (acc, q) => ({
        total: acc.total + 1,
        correct: acc.correct + (answers[q.id] === q.correctIndex ? 1 : 0),
      }),
      { total: 0, correct: 0 }
    );

  const hammaditeStats = questions
    .filter((q) => q.period === 'hammadite')
    .reduce(
      (acc, q) => ({
        total: acc.total + 1,
        correct: acc.correct + (answers[q.id] === q.correctIndex ? 1 : 0),
      }),
      { total: 0, correct: 0 }
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Controls Card */}
      <div className="bg-[#FAF8F3] border border-[#103B50]/12 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C47B55] inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('historyQuiz.kicker')}</span>
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#103B50] leading-tight">
              {t('historyQuiz.title')}
            </h2>
            <p className="text-sm text-[#51636D] leading-relaxed">{t('historyQuiz.subtitle')}</p>
          </div>

          {bestPct !== null && (
            <div className="px-4 py-2.5 rounded-lg bg-white border border-[#103B50]/12 text-center shrink-0">
              <p className="text-[11px] uppercase tracking-wider text-[#51636D] inline-flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-[#C47B55]" />
                <span>{t('historyQuiz.bestScore')}</span>
              </p>
              <p className="font-serif text-xl font-semibold text-[#103B50] tabular-nums">
                {bestPct}%
              </p>
            </div>
          )}
        </div>

        {/* Setup Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#103B50]/10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#51636D]">
              {t('historyQuiz.topicLabel')}
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'both', label: t('historyQuiz.topicBoth') },
                  { id: 'romaine', label: t('historyQuiz.topicRomaine') },
                  { id: 'hammadite', label: t('historyQuiz.topicHammadite') },
                ] as { id: HistoryQuizTopic; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={phase === 'loading'}
                  onClick={() => setTopic(opt.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    topic === opt.id
                      ? 'bg-[#103B50] border-[#103B50] text-white'
                      : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#51636D]">
              {t('historyQuiz.difficultyLabel')}
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'decouverte', label: t('historyQuiz.diffDecouverte') },
                  { id: 'intermediaire', label: t('historyQuiz.diffIntermediaire') },
                  { id: 'expert', label: t('historyQuiz.diffExpert') },
                ] as { id: HistoryQuizDifficulty; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={phase === 'loading'}
                  onClick={() => setDifficulty(opt.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    difficulty === opt.id
                      ? 'bg-[#087E9B] border-[#087E9B] text-white'
                      : 'bg-white border-[#103B50]/15 text-[#103B50] hover:bg-[#F4EFE5]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleGenerateQuiz()}
            disabled={phase === 'loading'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#103B50] hover:bg-[#087E9B] disabled:opacity-60 text-white text-sm font-medium transition-colors"
          >
            {phase === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>
              {questions.length > 0 ? t('historyQuiz.regenerateBtn') : t('historyQuiz.generateBtn')}
            </span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-white border border-[#C47B55]/40 flex items-start gap-2.5 text-sm text-[#103B50]">
            <AlertCircle className="w-4 h-4 text-[#C47B55] shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {phase === 'loading' && (
        <div className="bg-white border border-[#103B50]/12 rounded-xl p-10 text-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-[#087E9B] mx-auto" />
          <p className="font-serif text-lg text-[#103B50]">{t('historyQuiz.generating')}</p>
        </div>
      )}

      {/* Active Playing Card */}
      {phase === 'playing' && currentQuestion && (
        <div className="bg-white border border-[#103B50]/12 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Progress & Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#103B50] tabular-nums">
                  {t('historyQuiz.questionProgress')} {currentIdx + 1} / {questions.length}
                </span>
                <span aria-hidden="true" className="text-[#51636D]">
                  ·
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    currentQuestion.period === 'romaine' ? 'text-[#C47B55]' : 'text-[#087E9B]'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>
                    {currentQuestion.period === 'romaine'
                      ? t('historyQuiz.periodRomaineTag')
                      : t('historyQuiz.periodHammaditeTag')}
                  </span>
                </span>
              </div>

              <span className="font-semibold text-[#356B50] tabular-nums">
                {t('historyQuiz.scoreLabel')} : {totalCorrect} / {questions.length}
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#F4EFE5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#087E9B] transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {currentQuestion.historicalAnchor && (
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#51636D]">
                {currentQuestion.historicalAnchor}
              </p>
            )}
          </div>

          {/* Question */}
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#103B50] leading-snug">
            {currentQuestion.question}
          </h3>

          {/* 4 Multiple Choice Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectOption = optIdx === currentQuestion.correctIndex;

              let optionStyle =
                'bg-[#FAF8F3] border-[#103B50]/12 text-[#103B50] hover:bg-[#F4EFE5] hover:border-[#087E9B]';

              if (hasAnsweredCurrent) {
                if (isCorrectOption) {
                  optionStyle = 'bg-[#356B50]/12 border-[#356B50] text-[#103B50]';
                } else if (isSelected) {
                  optionStyle = 'bg-[#C47B55]/15 border-[#C47B55] text-[#103B50]';
                } else {
                  optionStyle = 'bg-[#FAF8F3]/60 border-[#103B50]/10 text-[#51636D] opacity-75';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={hasAnsweredCurrent}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-start p-4 rounded-lg border transition-colors flex items-start gap-3 ${optionStyle}`}
                >
                  <span className="w-6 h-6 rounded-md bg-white border border-[#103B50]/15 text-xs font-bold text-[#103B50] inline-flex items-center justify-center shrink-0 mt-0.5">
                    {OPTION_LETTERS[optIdx] ?? optIdx + 1}
                  </span>
                  <span className="flex-1 text-sm sm:text-base leading-relaxed">{option}</span>
                  {hasAnsweredCurrent && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-[#356B50] shrink-0 mt-0.5" />
                  )}
                  {hasAnsweredCurrent && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-[#C47B55] shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Historical Explanation Feedback */}
          {hasAnsweredCurrent && (
            <div className="p-4 sm:p-5 rounded-lg bg-[#FAF8F3] border border-[#103B50]/12 space-y-3">
              <p
                className={`text-sm font-semibold inline-flex items-center gap-1.5 ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'text-[#356B50]'
                    : 'text-[#C47B55]'
                }`}
              >
                {selectedOption === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('historyQuiz.correctBadge')}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>{t('historyQuiz.wrongBadge')}</span>
                  </>
                )}
              </p>

              <p className="text-sm text-[#102530]/90 leading-relaxed flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-[#087E9B] shrink-0 mt-0.5" />
                <span>{currentQuestion.explanation}</span>
              </p>

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#103B50] hover:bg-[#087E9B] text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  <span>
                    {currentIdx < questions.length - 1
                      ? t('historyQuiz.nextQuestion')
                      : t('historyQuiz.seeResults')}
                  </span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results & Detailed Review */}
      {phase === 'results' && questions.length > 0 && (
        <div className="bg-white border border-[#103B50]/12 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#103B50]/10">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#356B50] inline-flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                <span>{t('historyQuiz.resultsTitle')}</span>
              </p>
              <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-[#103B50] tabular-nums">
                {totalCorrect} / {questions.length} (
                {Math.round((totalCorrect / questions.length) * 100)}%)
              </h3>
            </div>

            <button
              type="button"
              onClick={() => void handleGenerateQuiz()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#087E9B] hover:bg-[#103B50] text-white text-xs sm:text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('historyQuiz.regenerateBtn')}</span>
            </button>
          </div>

          {/* Period Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {romaineStats.total > 0 && (
              <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#103B50]/10 space-y-1">
                <p className="text-xs font-semibold text-[#C47B55]">
                  {t('historyQuiz.periodRomaineTag')}
                </p>
                <p className="font-serif text-2xl font-semibold text-[#103B50] tabular-nums">
                  {romaineStats.correct} / {romaineStats.total}
                </p>
              </div>
            )}
            {hammaditeStats.total > 0 && (
              <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#103B50]/10 space-y-1">
                <p className="text-xs font-semibold text-[#087E9B]">
                  {t('historyQuiz.periodHammaditeTag')}
                </p>
                <p className="font-serif text-2xl font-semibold text-[#103B50] tabular-nums">
                  {hammaditeStats.correct} / {hammaditeStats.total}
                </p>
              </div>
            )}
          </div>

          {/* Full Review List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#51636D]">
              {t('historyQuiz.reviewAnswers')}
            </h4>
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAns = answers[q.id];
                const isOk = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-lg bg-[#FAF8F3] border border-[#103B50]/10 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-[#103B50]">
                        {idx + 1}. {q.question}
                      </p>
                      {isOk ? (
                        <CheckCircle2 className="w-4 h-4 text-[#356B50] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#C47B55] shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-[#356B50] font-medium">
                      ✓ {q.options[q.correctIndex]}
                    </p>
                    <p className="text-xs text-[#51636D] leading-relaxed">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
