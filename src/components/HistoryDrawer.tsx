import { X, Trash2, Award, Clock } from 'lucide-react';
import { TestResult } from '../types';
import { ThemeConfig } from '../utils/theme';

interface HistoryDrawerProps {
  theme: ThemeConfig;
  history: TestResult[];
  onClearHistory: () => void;
  onClose: () => void;
}

export function HistoryDrawer({
  theme,
  history,
  onClearHistory,
  onClose
}: HistoryDrawerProps) {
  // Compute overall personal best
  const personalBest = history.length > 0 ? Math.max(...history.map(h => h.wpm)) : 0;
  const averageWpm =
    history.length > 0
      ? Math.round(history.reduce((acc, cur) => acc + cur.wpm, 0) / history.length)
      : 0;
  const averageAcc =
    history.length > 0
      ? Math.round(history.reduce((acc, cur) => acc + cur.accuracy, 0) / history.length)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md h-full overflow-y-auto border-l ${theme.borderClass} ${theme.surfaceClass} p-6 shadow-2xl flex flex-col justify-between`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-current/10">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-current" />
              <h2 className="text-base font-bold tracking-tight text-current">
                Typing History & Records
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border ${theme.borderClass} ${theme.subtextClass} hover:text-current hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
              aria-label="Close history"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick aggregates */}
          <div className="grid grid-cols-3 gap-3 my-5">
            <div className={`p-3 rounded-xl border ${theme.borderClass} bg-black/5 dark:bg-white/5`}>
              <div className="flex items-center gap-1 text-[11px] opacity-60">
                <Award className="w-3 h-3 text-amber-500" />
                <span>Peak PB</span>
              </div>
              <div className={`text-xl font-mono font-bold tabular-nums mt-1 ${theme.accentClass}`}>
                {personalBest} <span className="text-[10px] font-normal">WPM</span>
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${theme.borderClass} bg-black/5 dark:bg-white/5`}>
              <div className="text-[11px] opacity-60">Avg Speed</div>
              <div className="text-xl font-mono font-bold tabular-nums mt-1 text-current">
                {averageWpm} <span className="text-[10px] font-normal">WPM</span>
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${theme.borderClass} bg-black/5 dark:bg-white/5`}>
              <div className="text-[11px] opacity-60">Avg Acc</div>
              <div className="text-xl font-mono font-bold tabular-nums mt-1 text-current">
                {averageAcc}%
              </div>
            </div>
          </div>

          {/* List of sessions */}
          <div className="space-y-2 mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
              Recent Sessions ({history.length})
            </h3>

            {history.length === 0 ? (
              <div className={`text-center py-12 text-xs ${theme.subtextClass}`}>
                No typing tests completed yet. Start typing to record your speed!
              </div>
            ) : (
              history.map(item => {
                const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border ${theme.borderClass} flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm capitalize text-current">
                          {item.mode}
                        </span>
                        <span className="text-xs font-mono opacity-50">
                          ({item.modeSetting})
                        </span>
                      </div>
                      <div className="text-[11px] opacity-40 font-mono mt-0.5">
                        {dateStr} · {item.elapsedSeconds}s
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono text-base font-bold tabular-nums ${theme.accentClass}`}>
                        {item.wpm} <span className="text-xs font-normal">wpm</span>
                      </div>
                      <div className="text-[11px] font-mono opacity-60 tabular-nums">
                        {item.accuracy}% acc · {item.consistency}% cst
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-current/10 flex justify-between items-center">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <span className="text-[11px] opacity-40">Saved in browser storage</span>
          </div>
        )}
      </div>
    </div>
  );
}
