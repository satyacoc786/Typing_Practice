import { useState } from 'react';
import { X, Zap, Check } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface WeakKeysModalProps {
  theme: ThemeConfig;
  detectedKeys: string[];
  onStartDrill: (keys: string[]) => void;
  onClose: () => void;
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export function WeakKeysModal({
  theme,
  detectedKeys,
  onStartDrill,
  onClose
}: WeakKeysModalProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    detectedKeys.length > 0 ? detectedKeys.slice(0, 5) : ['z', 'x', 'p', 'b']
  );

  const toggleKey = (k: string) => {
    if (selectedKeys.includes(k)) {
      setSelectedKeys(prev => prev.filter(x => x !== k));
    } else {
      setSelectedKeys(prev => [...prev, k]);
    }
  };

  const handleLaunch = () => {
    if (selectedKeys.length > 0) {
      onStartDrill(selectedKeys);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md rounded-3xl border ${theme.borderClass} ${theme.surfaceClass} p-6 shadow-2xl transition-all`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-current/10">
          <div className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${theme.accentClass}`} />
            <h2 className="text-base font-bold tracking-tight text-current">
              Weak Keys Mastery Drill
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border ${theme.borderClass} ${theme.subtextClass} hover:text-current hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          <p className={theme.subtextClass}>
            Select the letters that cause hesitation or typos. We will dynamically generate a
            focused training vocabulary emphasizing those finger motions.
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-current">Select Letters:</span>
              <span className="font-mono tabular-nums opacity-60">
                {selectedKeys.length} selected
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 font-mono">
              {ALPHABET.map(letter => {
                const isSelected = selectedKeys.includes(letter);
                const isDetected = detectedKeys.includes(letter);

                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => toggleKey(letter)}
                    className={`h-9 rounded-lg border flex flex-col items-center justify-center text-xs font-semibold transition-all relative ${
                      isSelected
                        ? `${theme.accentBgClass} shadow-xs font-bold scale-105`
                        : `${theme.borderClass} hover:bg-black/5 dark:hover:bg-white/5 opacity-80`
                    }`}
                  >
                    <span>{letter}</span>
                    {isDetected && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {detectedKeys.length > 0 && (
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between">
              <div>
                <span className="font-semibold text-current">Recent Stumbles:</span>
                <span className="font-mono ml-2 opacity-75">
                  {detectedKeys.slice(0, 6).join(', ')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedKeys(detectedKeys.slice(0, 6))}
                className={`text-[11px] font-semibold ${theme.accentClass} underline`}
              >
                Select All
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-current/10">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium border ${theme.borderClass} ${theme.subtextClass} hover:text-current`}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedKeys.length === 0}
              onClick={handleLaunch}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold ${theme.accentBgClass} disabled:opacity-40 hover:opacity-90`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Start Drill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
