import { Keyboard, Volume2, VolumeX, BarChart2, Settings, Zap } from 'lucide-react';
import { GameSettings, SwitchSound } from '../types';
import { ThemeConfig } from '../utils/theme';

interface TopNavProps {
  theme: ThemeConfig;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenWeakKeys: () => void;
  onSetQuickMode: (mode: 'time' | 'words' | 'quote' | 'code' | 'zen') => void;
  activeMode: string;
}

export function TopNav({
  theme,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenHistory,
  onOpenWeakKeys,
  onSetQuickMode,
  activeMode
}: TopNavProps) {
  const toggleSound = () => {
    const nextSound: SwitchSound = settings.sound === 'off' ? 'thock' : 'off';
    onUpdateSettings({ sound: nextSound });
  };

  return (
    <header className={`w-full border-b ${theme.borderClass} ${theme.surfaceClass} transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand mark */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${theme.accentBgClass}`}>
            TC
          </div>
          <span className="text-xl font-bold tracking-tight text-current select-none">
            TypoCraft
          </span>
        </div>

        {/* Zone 2: Clean text links for primary navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onSetQuickMode('time')}
            className={`transition-colors hover:text-current ${
              activeMode === 'time' ? `${theme.accentClass} font-semibold` : theme.subtextClass
            }`}
          >
            Timed Sprint
          </button>
          <button
            onClick={() => onSetQuickMode('words')}
            className={`transition-colors hover:text-current ${
              activeMode === 'words' ? `${theme.accentClass} font-semibold` : theme.subtextClass
            }`}
          >
            Word Target
          </button>
          <button
            onClick={() => onSetQuickMode('quote')}
            className={`transition-colors hover:text-current ${
              activeMode === 'quote' ? `${theme.accentClass} font-semibold` : theme.subtextClass
            }`}
          >
            Prose & Quotes
          </button>
          <button
            onClick={() => onSetQuickMode('code')}
            className={`transition-colors hover:text-current ${
              activeMode === 'code' ? `${theme.accentClass} font-semibold` : theme.subtextClass
            }`}
          >
            Code Syntax
          </button>
          <button
            onClick={onOpenWeakKeys}
            className={`flex items-center gap-1.5 transition-colors hover:text-current ${theme.subtextClass}`}
            title="Practice keys you struggled with"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Weak Keys</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary functional actions */}
        <div className="flex items-center gap-2">
          {/* Quick Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg transition-colors border ${theme.borderClass} ${
              settings.sound !== 'off' ? theme.accentClass : theme.subtextClass
            } hover:bg-black/5 dark:hover:bg-white/5`}
            title={`Sound: ${settings.sound}`}
            aria-label="Toggle mechanical switch audio"
          >
            {settings.sound === 'off' ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Virtual Keyboard Toggle */}
          <button
            onClick={() => onUpdateSettings({ showKeyboard: !settings.showKeyboard })}
            className={`p-2 rounded-lg transition-colors border ${theme.borderClass} ${
              settings.showKeyboard ? theme.accentClass : theme.subtextClass
            } hover:bg-black/5 dark:hover:bg-white/5`}
            title="Toggle On-screen Finger Guide"
            aria-label="Toggle virtual keyboard"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Stats & History */}
          <button
            onClick={onOpenHistory}
            className={`p-2 rounded-lg transition-colors border ${theme.borderClass} ${theme.subtextClass} hover:text-current hover:bg-black/5 dark:hover:bg-white/5`}
            title="View History & Records"
            aria-label="View history"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-lg transition-colors border ${theme.borderClass} ${theme.subtextClass} hover:text-current hover:bg-black/5 dark:hover:bg-white/5`}
            title="Preferences & Themes"
            aria-label="Open settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
