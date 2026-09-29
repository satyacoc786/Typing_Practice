import { useState } from 'react';
import { RotateCcw, Share2, Award, Zap, Check, ArrowRight } from 'lucide-react';
import { TestResult } from '../types';
import { ThemeConfig } from '../utils/theme';
import { WpmChart } from './WpmChart';

interface ResultsViewProps {
  theme: ThemeConfig;
  result: TestResult;
  onRestart: () => void;
  onPracticeWeakKeys: (keys: string[]) => void;
  personalBestWpm: number;
}

export function ResultsView({
  theme,
  result,
  onRestart,
  onPracticeWeakKeys,
  personalBestWpm
}: ResultsViewProps) {
  const [copied, setCopied] = useState(false);
  const isPb = result.wpm > personalBestWpm && personalBestWpm > 0;

  const handleShare = () => {
    const text = `⚡ TypoCraft Typing Result\nMode: ${result.mode} (${result.modeSetting})\nWPM: ${result.wpm} | Raw: ${result.rawWpm}\nAccuracy: ${result.accuracy}%\nConsistency: ${result.consistency}%`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const weakKeys = result.keyMistakes.slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 animate-in fade-in zoom-in-95 duration-200">
      {/* PB Banner */}
      {isPb && (
        <div className="mb-6 flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-semibold text-sm">
          <Award className="w-5 h-5" />
          <span>New Personal Best! Previous best was {personalBestWpm} WPM.</span>
        </div>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* WPM */}
        <div className={`p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} flex flex-col justify-between`}>
          <span className={`text-xs uppercase tracking-wider font-semibold ${theme.subtextClass}`}>
            Net Speed
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-4xl md:text-5xl font-mono font-bold tabular-nums ${theme.accentClass}`}>
              {result.wpm}
            </span>
            <span className="text-xs font-mono opacity-60">WPM</span>
          </div>
          <span className="text-[11px] opacity-60 mt-2 font-mono">
            Raw: {result.rawWpm} WPM
          </span>
        </div>

        {/* Accuracy */}
        <div className={`p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} flex flex-col justify-between`}>
          <span className={`text-xs uppercase tracking-wider font-semibold ${theme.subtextClass}`}>
            Accuracy
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-mono font-bold tabular-nums text-current">
              {result.accuracy}%
            </span>
          </div>
          <span className="text-[11px] opacity-60 mt-2 font-mono">
            {result.charStats.correct} / {result.charStats.correct + result.charStats.incorrect} chars
          </span>
        </div>

        {/* Consistency */}
        <div className={`p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} flex flex-col justify-between`}>
          <span className={`text-xs uppercase tracking-wider font-semibold ${theme.subtextClass}`}>
            Consistency
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-mono font-bold tabular-nums text-current">
              {result.consistency}%
            </span>
          </div>
          <span className="text-[11px] opacity-60 mt-2 font-mono">
            Pacing stability
          </span>
        </div>

        {/* Time / Mode */}
        <div className={`p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} flex flex-col justify-between`}>
          <span className={`text-xs uppercase tracking-wider font-semibold ${theme.subtextClass}`}>
            Test Details
          </span>
          <div className="mt-2 flex flex-col gap-0.5">
            <span className="text-lg font-bold capitalize text-current">
              {result.mode}
            </span>
            <span className="text-xs font-mono opacity-60">
              {result.modeSetting} · {result.elapsedSeconds}s duration
            </span>
          </div>
          <span className="text-[11px] opacity-60 mt-2 font-mono">
            {result.charStats.incorrect === 0 ? 'Flawless run' : `${result.charStats.incorrect} errors`}
          </span>
        </div>
      </div>

      {/* Second-by-Second Speed Curve */}
      <div className="mb-6">
        <WpmChart theme={theme} data={result.secondHistory} height={180} />
      </div>

      {/* Weak Keys Diagnostic & Training Drill */}
      {weakKeys.length > 0 && (
        <div className={`mb-6 p-4 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-current">
                Weak Keys Detected ({weakKeys.map(k => `"${k.key}"`).join(', ')})
              </div>
              <div className={`text-xs ${theme.subtextClass} mt-0.5`}>
                Target these specific finger motions to unlock higher speed and lower hesitation.
              </div>
            </div>
          </div>

          <button
            onClick={() => onPracticeWeakKeys(weakKeys.map(k => k.key))}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold ${theme.accentBgClass} hover:opacity-90 transition-all shrink-0`}
          >
            <span>Train Weak Keys Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onRestart}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm ${theme.accentBgClass} hover:opacity-90 shadow-sm transition-all`}
          autoFocus
        >
          <RotateCcw className="w-4 h-4" />
          <span>Next Test (Enter or Space)</span>
        </button>

        <button
          onClick={handleShare}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border ${theme.borderClass} ${theme.surfaceClass} ${theme.subtextClass} hover:text-current hover:border-current/30 transition-all`}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Share Result'}</span>
        </button>
      </div>
    </div>
  );
}
