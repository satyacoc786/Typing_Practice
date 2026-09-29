import { Clock, Type, Quote, Code2, Sparkles, Hash, ShieldAlert, Flag } from 'lucide-react';
import { GameMode, TimeOption, WordOption, QuoteLength, GameSettings } from '../types';
import { ThemeConfig } from '../utils/theme';

interface ModeSelectorProps {
  theme: ThemeConfig;
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  timeOption: TimeOption;
  onSelectTime: (time: TimeOption) => void;
  wordOption: WordOption;
  onSelectWords: (words: WordOption) => void;
  quoteLength: QuoteLength;
  onSelectQuoteLength: (len: QuoteLength) => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenCustomTextModal: () => void;
  disabled?: boolean;
}

export function ModeSelector({
  theme,
  mode,
  onSelectMode,
  timeOption,
  onSelectTime,
  wordOption,
  onSelectWords,
  quoteLength,
  onSelectQuoteLength,
  settings,
  onUpdateSettings,
  onOpenCustomTextModal,
  disabled = false
}: ModeSelectorProps) {
  return (
    <div className={`w-fit mx-auto px-3 py-1.5 rounded-xl border ${theme.borderClass} ${theme.surfaceClass} flex flex-wrap items-center justify-center gap-3 text-xs font-medium shadow-xs transition-opacity duration-200 ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
      {/* Mode Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSelectMode('time')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            mode === 'time'
              ? `${theme.accentBgClass} font-semibold shadow-xs`
              : `${theme.subtextClass} hover:text-current`
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Time</span>
        </button>

        <button
          onClick={() => onSelectMode('words')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            mode === 'words'
              ? `${theme.accentBgClass} font-semibold shadow-xs`
              : `${theme.subtextClass} hover:text-current`
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Words</span>
        </button>

        <button
          onClick={() => onSelectMode('quote')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            mode === 'quote'
              ? `${theme.accentBgClass} font-semibold shadow-xs`
              : `${theme.subtextClass} hover:text-current`
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>Quote</span>
        </button>

        <button
          onClick={() => onSelectMode('code')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            mode === 'code'
              ? `${theme.accentBgClass} font-semibold shadow-xs`
              : `${theme.subtextClass} hover:text-current`
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>

        <button
          onClick={() => onSelectMode('zen')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            mode === 'zen'
              ? `${theme.accentBgClass} font-semibold shadow-xs`
              : `${theme.subtextClass} hover:text-current`
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zen</span>
        </button>

        <button
          onClick={onOpenCustomTextModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            mode === 'custom'
              ? `${theme.accentBgClass} font-semibold shadow-xs`
              : `${theme.subtextClass} hover:text-current`
          }`}
        >
          <span>Custom</span>
        </button>
      </div>

      <div className={`h-4 w-px bg-current opacity-20`} />

      {/* Sub-options depending on mode */}
      {mode === 'time' && (
        <div className="flex items-center gap-1">
          {([15, 30, 60, 120] as TimeOption[]).map(t => (
            <button
              key={t}
              onClick={() => onSelectTime(t)}
              className={`px-2.5 py-1 rounded-md transition-colors tabular-nums ${
                timeOption === t
                  ? `${theme.accentClass} font-semibold bg-black/10 dark:bg-white/10`
                  : `${theme.subtextClass} hover:text-current`
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      )}

      {mode === 'words' && (
        <div className="flex items-center gap-1">
          {([10, 25, 50, 100] as WordOption[]).map(w => (
            <button
              key={w}
              onClick={() => onSelectWords(w)}
              className={`px-2.5 py-1 rounded-md transition-colors tabular-nums ${
                wordOption === w
                  ? `${theme.accentClass} font-semibold bg-black/10 dark:bg-white/10`
                  : `${theme.subtextClass} hover:text-current`
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      )}

      {mode === 'quote' && (
        <div className="flex items-center gap-1">
          {(['short', 'medium', 'long'] as QuoteLength[]).map(l => (
            <button
              key={l}
              onClick={() => onSelectQuoteLength(l)}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                quoteLength === l
                  ? `${theme.accentClass} font-semibold bg-black/10 dark:bg-white/10`
                  : `${theme.subtextClass} hover:text-current`
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Modifier toggles */}
      {(mode === 'time' || mode === 'words') && (
        <>
          <div className={`h-4 w-px bg-current opacity-20`} />
          <div className="flex items-center gap-1">
            <button
              onClick={() => onUpdateSettings({ includePunctuation: !settings.includePunctuation })}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                settings.includePunctuation
                  ? `${theme.accentClass} bg-black/10 dark:bg-white/10 font-semibold`
                  : `${theme.subtextClass} hover:text-current`
              }`}
              title="Toggle Punctuation"
            >
              <span>.,?!</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ includeNumbers: !settings.includeNumbers })}
              className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                settings.includeNumbers
                  ? `${theme.accentClass} bg-black/10 dark:bg-white/10 font-semibold`
                  : `${theme.subtextClass} hover:text-current`
              }`}
              title="Toggle Numbers"
            >
              <Hash className="w-3 h-3" />
              <span>123</span>
            </button>
          </div>
        </>
      )}

      <div className={`h-4 w-px bg-current opacity-20`} />

      {/* Challenge Modifiers */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onUpdateSettings({ masterMode: !settings.masterMode })}
          className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
            settings.masterMode
              ? 'text-rose-500 bg-rose-500/10 font-semibold'
              : `${theme.subtextClass} hover:text-current`
          }`}
          title="Master Mode: Sudden Death on 1 single typo!"
        >
          <ShieldAlert className="w-3 h-3" />
          <span>Sudden Death</span>
        </button>

        <button
          onClick={() => onUpdateSettings({ showGhostPacer: !settings.showGhostPacer })}
          className={`px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
            settings.showGhostPacer
              ? `${theme.accentClass} bg-black/10 dark:bg-white/10 font-semibold`
              : `${theme.subtextClass} hover:text-current`
          }`}
          title={`Ghost Pacer (Target: ${settings.pacerWpm} WPM)`}
        >
          <Flag className="w-3 h-3" />
          <span>Pacer ({settings.pacerWpm})</span>
        </button>
      </div>
    </div>
  );
}
