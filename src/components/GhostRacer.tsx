import { ThemeConfig } from '../utils/theme';

interface GhostRacerProps {
  theme: ThemeConfig;
  userProgressPercent: number; // 0 to 100
  pacerProgressPercent: number; // 0 to 100
  userWpm: number;
  pacerWpm: number;
  isActive: boolean;
}

export function GhostRacer({
  theme,
  userProgressPercent,
  pacerProgressPercent,
  userWpm,
  pacerWpm,
  isActive
}: GhostRacerProps) {
  const diffPercent = userProgressPercent - pacerProgressPercent;
  const isAhead = diffPercent >= 0;

  return (
    <div className={`w-full max-w-4xl mx-auto mb-6 p-3 rounded-xl border ${theme.borderClass} ${theme.surfaceClass} text-xs select-none transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-current">Racer Arena</span>
          <span className="opacity-40">·</span>
          <span className={theme.subtextClass}>
            Target: <strong className="tabular-nums font-semibold">{pacerWpm} WPM</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono tabular-nums">
          {isActive ? (
            <span className={isAhead ? 'text-emerald-500 font-semibold' : 'text-rose-400 font-semibold'}>
              {isAhead ? `+${Math.abs(Math.round(diffPercent))}% ahead` : `-${Math.abs(Math.round(diffPercent))}% behind`}
            </span>
          ) : (
            <span className={theme.subtextClass}>Ready to race</span>
          )}
        </div>
      </div>

      {/* Track 1: You */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-medium text-current">You ({userWpm} WPM)</span>
          <span className="font-mono tabular-nums opacity-60">{Math.round(userProgressPercent)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-150 ${theme.accentBgClass}`}
            style={{ width: `${Math.min(100, Math.max(0, userProgressPercent))}%` }}
          />
        </div>
      </div>

      {/* Track 2: Ghost / Pace Car */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1 text-slate-400">
          <span>Ghost Pacer ({pacerWpm} WPM)</span>
          <span className="font-mono tabular-nums opacity-60">{Math.round(pacerProgressPercent)}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-slate-400 dark:bg-slate-500 transition-all duration-200"
            style={{ width: `${Math.min(100, Math.max(0, pacerProgressPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
