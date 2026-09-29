import { X, Volume2, Palette, Sparkles, Flag, Keyboard } from 'lucide-react';
import { GameSettings, SwitchSound, CaretStyle, ThemeId } from '../types';
import { THEMES, ThemeConfig } from '../utils/theme';

interface SettingsModalProps {
  theme: ThemeConfig;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export function SettingsModal({
  theme,
  settings,
  onUpdateSettings,
  onClose
}: SettingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border ${theme.borderClass} ${theme.surfaceClass} p-6 shadow-2xl transition-all`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-current/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className={`w-5 h-5 ${theme.accentClass}`} />
            <h2 className="text-lg font-bold tracking-tight text-current">
              Typing Studio Preferences
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border ${theme.borderClass} ${theme.subtextClass} hover:text-current hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content sections */}
        <div className="py-5 space-y-6 text-sm">
          {/* Theme Palette */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-current mb-3">
              <Palette className="w-4 h-4" />
              <span>Color Theme</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.values(THEMES).map(t => {
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onUpdateSettings({ theme: t.id as ThemeId })}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? `${theme.accentBorderClass} bg-black/5 dark:bg-white/5 font-semibold`
                        : `${theme.borderClass} opacity-70 hover:opacity-100`
                    }`}
                  >
                    <span className="text-xs truncate">{t.name}</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: t.accentColor }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound & Switch Profiles */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-current mb-3">
              <Volume2 className="w-4 h-4" />
              <span>Mechanical Switch Audio</span>
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(
                [
                  { id: 'thock', name: 'Thock (Lubed)' },
                  { id: 'clicky', name: 'Clicky (Blue)' },
                  { id: 'tactile', name: 'Tactile (Brown)' },
                  { id: 'typewriter', name: 'Typewriter' },
                  { id: 'bubble', name: 'Bubble Pop' },
                  { id: 'off', name: 'Muted (Off)' }
                ] as { id: SwitchSound; name: string }[]
              ).map(s => {
                const isSelected = settings.sound === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onUpdateSettings({ sound: s.id })}
                    className={`py-2 px-3 rounded-xl border text-xs text-center transition-all ${
                      isSelected
                        ? `${theme.accentBgClass} font-semibold shadow-xs`
                        : `${theme.borderClass} ${theme.subtextClass} hover:text-current`
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>

            {settings.sound !== 'off' && (
              <div className="flex items-center gap-3 text-xs mt-3">
                <span className={theme.subtextClass}>Volume</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={settings.volume}
                  onChange={e => onUpdateSettings({ volume: parseFloat(e.target.value) })}
                  className="flex-grow accent-current cursor-pointer"
                />
                <span className="font-mono tabular-nums w-8 text-right opacity-60">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Caret Style */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-current mb-3">
              <span>Caret Style</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: 'line', name: 'Smooth Line' },
                  { id: 'block', name: 'Solid Block' },
                  { id: 'underline', name: 'Underline' },
                  { id: 'outline', name: 'Outline' }
                ] as { id: CaretStyle; name: string }[]
              ).map(c => {
                const isSelected = settings.caretStyle === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onUpdateSettings({ caretStyle: c.id })}
                    className={`py-2 px-2 rounded-xl border text-xs text-center transition-all ${
                      isSelected
                        ? `${theme.accentBgClass} font-semibold shadow-xs`
                        : `${theme.borderClass} ${theme.subtextClass} hover:text-current`
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ghost Pacer Target Speed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 font-semibold text-current">
                <Flag className="w-4 h-4" />
                <span>Ghost Pacer Target</span>
              </label>
              <span className={`font-mono text-xs font-bold tabular-nums ${theme.accentClass}`}>
                {settings.pacerWpm} WPM
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="160"
              step="5"
              value={settings.pacerWpm}
              onChange={e => onUpdateSettings({ pacerWpm: parseInt(e.target.value, 10) })}
              className="w-full accent-current cursor-pointer"
            />
            <div className="flex justify-between text-[10px] opacity-40 font-mono mt-1">
              <span>30 WPM (Beginner)</span>
              <span>80 WPM (Proficient)</span>
              <span>160 WPM (Esports)</span>
            </div>
          </div>

          {/* HUD Toggles */}
          <div className="pt-2 border-t border-current/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-current">Show Live WPM & Accuracy</div>
                <div className={`text-xs ${theme.subtextClass}`}>
                  Displays real-time speed counter during the test
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showLiveWpm}
                onChange={e => onUpdateSettings({ showLiveWpm: e.target.checked })}
                className="w-4 h-4 rounded-md accent-current cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-current flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4" />
                  <span>On-Screen Touch Typing Guide</span>
                </div>
                <div className={`text-xs ${theme.subtextClass}`}>
                  Highlights upcoming keystroke and ergonomic finger zones
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showKeyboard}
                onChange={e => onUpdateSettings({ showKeyboard: e.target.checked })}
                className="w-4 h-4 rounded-md accent-current cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-current/10 flex justify-end">
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs ${theme.accentBgClass} hover:opacity-90 transition-opacity`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
