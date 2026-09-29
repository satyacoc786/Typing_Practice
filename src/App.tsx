/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  GameMode,
  TimeOption,
  WordOption,
  QuoteLength,
  GameSettings,
  TestResult
} from './types';
import { THEMES, ThemeConfig } from './utils/theme';
import { soundEngine } from './utils/audio';
import { useTypingEngine } from './hooks/useTypingEngine';
import { TopNav } from './components/TopNav';
import { ModeSelector } from './components/ModeSelector';
import { GhostRacer } from './components/GhostRacer';
import { TypingArea } from './components/TypingArea';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { ResultsView } from './components/ResultsView';
import { SettingsModal } from './components/SettingsModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { CustomTextModal } from './components/CustomTextModal';
import { WeakKeysModal } from './components/WeakKeysModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';

const DEFAULT_SETTINGS: GameSettings = {
  theme: 'obsidian',
  sound: 'thock',
  volume: 0.45,
  caretStyle: 'line',
  smoothCaret: true,
  showKeyboard: false,
  showLiveWpm: true,
  showGhostPacer: true,
  pacerWpm: 70,
  includeNumbers: false,
  includePunctuation: false,
  masterMode: false,
  fontSize: 'lg'
};

const STORAGE_KEYS = {
  SETTINGS: 'typocraft_settings_v1',
  HISTORY: 'typocraft_history_v1'
};

export default function App() {
  // Load persistent settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Load history
  const [history, setHistory] = useState<TestResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Mode and options state
  const [mode, setMode] = useState<GameMode>('time');
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [wordOption, setWordOption] = useState<WordOption>(25);
  const [quoteLength, setQuoteLength] = useState<QuoteLength>('medium');
  const [customText, setCustomText] = useState<string>('');
  const [weakKeysPractice, setWeakKeysPractice] = useState<string[]>([]);

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showCustomTextModal, setShowCustomTextModal] = useState(false);
  const [showWeakKeysModal, setShowWeakKeysModal] = useState(false);
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  const [showPbConfetti, setShowPbConfetti] = useState(false);

  // Sync sound engine
  useEffect(() => {
    soundEngine.setSound(settings.sound);
    soundEngine.setVolume(settings.volume);
  }, [settings.sound, settings.volume]);

  // Save settings on update
  const handleUpdateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch {
        // Storage full/quota
      }
      return updated;
    });
  }, []);

  // Save history on update
  const handleSaveResult = useCallback((result: TestResult) => {
    setHistory(prev => {
      // Check personal best for this mode
      const previousBest = prev
        .filter(h => h.mode === result.mode && h.modeSetting === result.modeSetting)
        .reduce((max, h) => Math.max(max, h.wpm), 0);

      const isPb = result.wpm > previousBest;
      const updatedResult = { ...result, isPersonalBest: isPb };

      if (isPb && result.wpm > 20) {
        setShowPbConfetti(true);
        setTimeout(() => setShowPbConfetti(false), 3000);
      }

      setLatestResult(updatedResult);

      const nextHistory = [updatedResult, ...prev.slice(0, 99)]; // keep latest 100
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(nextHistory));
      } catch {
        // storage fallback
      }
      return nextHistory;
    });
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // storage fallback
    }
  };

  // Typing engine
  const {
    words,
    currentWordIndex,
    currentInput,
    typedWords,
    quoteInfo,
    isActive,
    isFinished,
    timeLeft,
    elapsedSeconds,
    capsLockActive,
    comboStreak,
    liveWpm,
    liveAccuracy,
    handleKeyDown,
    restartTest
  } = useTypingEngine({
    settings,
    mode,
    timeOption,
    wordOption,
    quoteLength,
    customText,
    weakKeysPractice: weakKeysPractice.length > 0 ? weakKeysPractice : undefined,
    onFinishTest: handleSaveResult
  });

  const currentTheme: ThemeConfig = THEMES[settings.theme] || THEMES.obsidian;

  // Personal best calculation for active mode
  const currentPersonalBest = useMemo(() => {
    const currentModeSetting = mode === 'time' ? `${timeOption}s` : mode === 'words' ? `${wordOption}w` : mode;
    return history
      .filter(h => h.mode === mode && h.modeSetting === currentModeSetting)
      .reduce((max, h) => Math.max(max, h.wpm), 0);
  }, [history, mode, timeOption, wordOption]);

  // Aggregate detected weak keys across recent history
  const detectedWeakKeys = useMemo(() => {
    const mistakesCount = new Map<string, number>();
    history.slice(0, 10).forEach(h => {
      h.keyMistakes?.forEach(m => {
        mistakesCount.set(m.key, (mistakesCount.get(m.key) || 0) + m.count);
      });
    });
    return Array.from(mistakesCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k);
  }, [history]);

  // Next expected char for virtual keyboard
  const nextChar = useMemo(() => {
    const curWord = words[currentWordIndex] || '';
    if (currentInput.length < curWord.length) {
      return curWord[currentInput.length] || '';
    }
    return ' ';
  }, [words, currentWordIndex, currentInput]);

  // Ghost Pacer progress calculation
  const { userProgressPercent, pacerProgressPercent } = useMemo(() => {
    const totalExpectedChars = Math.max(1, words.join(' ').length);
    const userCharsTyped = typedWords.join(' ').length + (typedWords.length > 0 ? 1 : 0) + currentInput.length;
    const userPercent = Math.min(100, (userCharsTyped / totalExpectedChars) * 100);

    // Ghost types at target pacerWpm (5 chars = 1 word)
    const pacerCharsTyped = (settings.pacerWpm * 5) * (elapsedSeconds / 60);
    const pacerPercent = Math.min(100, (pacerCharsTyped / totalExpectedChars) * 100);

    return {
      userProgressPercent: userPercent,
      pacerProgressPercent: pacerPercent
    };
  }, [words, typedWords, currentInput, settings.pacerWpm, elapsedSeconds]);

  // Quick mode handler from TopNav
  const handleQuickModeSelect = (newMode: GameMode) => {
    setWeakKeysPractice([]);
    setMode(newMode);
    setLatestResult(null);
  };

  // Launch targeted weak key drill
  const handleStartWeakKeysDrill = (keys: string[]) => {
    setWeakKeysPractice(keys);
    setMode('custom');
    setLatestResult(null);
    restartTest();
  };

  // Apply custom text
  const handleApplyCustomText = (text: string) => {
    setWeakKeysPractice([]);
    setCustomText(text);
    setMode('custom');
    setLatestResult(null);
    restartTest();
  };

  // Reset and restart
  const handleFullRestart = () => {
    setLatestResult(null);
    restartTest();
  };

  // Keyboard shortcut listener for global actions
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Toggle settings with Ctrl/Cmd + ,
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettingsModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${currentTheme.bgClass}`}
    >
      {/* Celebration Confetti */}
      <ConfettiCanvas active={showPbConfetti} colors={[currentTheme.accentColor, '#f59e0b', '#10b981', '#ffffff']} />

      {/* Top Bar adhering to the 3-zone contract */}
      <TopNav
        theme={currentTheme}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onOpenWeakKeys={() => setShowWeakKeysModal(true)}
        onSetQuickMode={handleQuickModeSelect}
        activeMode={mode}
      />

      {/* Main Content Viewport */}
      <main className="flex-grow flex flex-col justify-center px-4 md:px-8 py-6 max-w-6xl mx-auto w-full">
        {/* Mode Selector (Hidden while actively reviewing results) */}
        {!isFinished && !latestResult && (
          <div className="mb-6">
            <ModeSelector
              theme={currentTheme}
              mode={mode}
              onSelectMode={m => {
                setWeakKeysPractice([]);
                setMode(m);
              }}
              timeOption={timeOption}
              onSelectTime={setTimeOption}
              wordOption={wordOption}
              onSelectWords={setWordOption}
              quoteLength={quoteLength}
              onSelectQuoteLength={setQuoteLength}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onOpenCustomTextModal={() => setShowCustomTextModal(true)}
              disabled={isActive}
            />

            {/* Weak Keys Drill Indicator */}
            {weakKeysPractice.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-3 text-xs">
                <span className="font-semibold text-rose-500">Drill Mode:</span>
                <span className="font-mono">
                  Focusing on keys: {weakKeysPractice.map(k => `"${k}"`).join(', ')}
                </span>
                <button
                  onClick={() => {
                    setWeakKeysPractice([]);
                    setMode('time');
                  }}
                  className={`underline opacity-70 hover:opacity-100 ${currentTheme.accentClass}`}
                >
                  Exit Drill
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ghost Pacer Live Track (if enabled & test is in progress or words mode) */}
        {settings.showGhostPacer && !latestResult && (mode === 'words' || mode === 'quote' || mode === 'code') && (
          <GhostRacer
            theme={currentTheme}
            userProgressPercent={userProgressPercent}
            pacerProgressPercent={pacerProgressPercent}
            userWpm={liveWpm}
            pacerWpm={settings.pacerWpm}
            isActive={isActive}
          />
        )}

        {/* Typing Canvas or Results View */}
        {latestResult ? (
          <ResultsView
            theme={currentTheme}
            result={latestResult}
            onRestart={handleFullRestart}
            onPracticeWeakKeys={keys => {
              setWeakKeysPractice(keys);
              setMode('custom');
              setLatestResult(null);
              restartTest();
            }}
            personalBestWpm={currentPersonalBest}
          />
        ) : (
          <div>
            <TypingArea
              theme={currentTheme}
              settings={settings}
              mode={mode}
              words={words}
              currentWordIndex={currentWordIndex}
              currentInput={currentInput}
              typedWords={typedWords}
              quoteSource={quoteInfo?.source}
              isActive={isActive}
              timeLeft={timeLeft}
              elapsedSeconds={elapsedSeconds}
              totalWordsTarget={wordOption}
              liveWpm={liveWpm}
              liveAccuracy={liveAccuracy}
              comboStreak={comboStreak}
              capsLockActive={capsLockActive}
              onKeyDown={handleKeyDown}
              onRestart={handleFullRestart}
            />

            {/* Optional Touch-Typing Virtual Keyboard Guide */}
            {settings.showKeyboard && (
              <VirtualKeyboard theme={currentTheme} nextChar={nextChar} />
            )}
          </div>
        )}
      </main>

      {/* Quiet Footer with Hotkeys & Metadata */}
      <footer className={`w-full py-4 px-6 border-t ${currentTheme.borderClass} text-xs ${currentTheme.subtextClass} select-none`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-4 text-[11px]">
            <span>
              <kbd className="px-1.5 py-0.5 rounded-sm bg-black/10 dark:bg-white/10 font-mono text-[10px]">
                Tab
              </kbd>{' '}
              +{' '}
              <kbd className="px-1.5 py-0.5 rounded-sm bg-black/10 dark:bg-white/10 font-mono text-[10px]">
                Enter
              </kbd>{' '}
              quick restart
            </span>
            <span className="opacity-40">·</span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded-sm bg-black/10 dark:bg-white/10 font-mono text-[10px]">
                Esc
              </kbd>{' '}
              instant reset
            </span>
            <span className="opacity-40 hidden md:inline">·</span>
            <span className="hidden md:inline">
              <kbd className="px-1.5 py-0.5 rounded-sm bg-black/10 dark:bg-white/10 font-mono text-[10px]">
                Ctrl
              </kbd>{' '}
              +{' '}
              <kbd className="px-1.5 py-0.5 rounded-sm bg-black/10 dark:bg-white/10 font-mono text-[10px]">
                Backspace
              </kbd>{' '}
              delete word
            </span>
          </div>

          <div className="text-[11px] opacity-60">
            <span>TypoCraft Studio</span>
            <span className="mx-2">·</span>
            <span>Web Audio Mechanical Synthesis</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {showSettingsModal && (
        <SettingsModal
          theme={currentTheme}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showHistoryDrawer && (
        <HistoryDrawer
          theme={currentTheme}
          history={history}
          onClearHistory={handleClearHistory}
          onClose={() => setShowHistoryDrawer(false)}
        />
      )}

      {showCustomTextModal && (
        <CustomTextModal
          theme={currentTheme}
          onApplyCustomText={handleApplyCustomText}
          onClose={() => setShowCustomTextModal(false)}
        />
      )}

      {showWeakKeysModal && (
        <WeakKeysModal
          theme={currentTheme}
          detectedKeys={detectedWeakKeys}
          onStartDrill={handleStartWeakKeysDrill}
          onClose={() => setShowWeakKeysModal(false)}
        />
      )}
    </div>
  );
}
