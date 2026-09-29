import { useEffect, useRef, useState } from 'react';
import { Flame, AlertTriangle, RotateCcw } from 'lucide-react';
import { GameMode, GameSettings } from '../types';
import { ThemeConfig } from '../utils/theme';

interface TypingAreaProps {
  theme: ThemeConfig;
  settings: GameSettings;
  mode: GameMode;
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  typedWords: string[];
  quoteSource?: string;
  isActive: boolean;
  timeLeft: number;
  elapsedSeconds: number;
  totalWordsTarget: number;
  liveWpm: number;
  liveAccuracy: number;
  comboStreak: number;
  capsLockActive: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRestart: () => void;
}

export function TypingArea({
  theme,
  settings,
  mode,
  words,
  currentWordIndex,
  currentInput,
  typedWords,
  quoteSource,
  isActive,
  timeLeft,
  elapsedSeconds,
  totalWordsTarget,
  liveWpm,
  liveAccuracy,
  comboStreak,
  capsLockActive,
  onKeyDown,
  onRestart
}: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const [containerOffset, setContainerOffset] = useState(0);

  // Keep focus on input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Smooth line scrolling: track active word's offsetTop and scroll container smoothly
  useEffect(() => {
    if (!activeWordRef.current || !wordsContainerRef.current) return;
    const wordEl = activeWordRef.current;
    const container = wordsContainerRef.current;

    // Line height is approximately 40-48px depending on font size
    const wordTop = wordEl.offsetTop;
    const containerTop = container.offsetTop;
    const relativeTop = wordTop - containerTop;

    // If active word is on line 2 or beyond, scroll so current line is visible in center
    if (relativeTop > 60) {
      setContainerOffset(relativeTop - 40);
    } else {
      setContainerOffset(0);
    }
  }, [currentWordIndex]);

  // Caret style classes
  const getCaretClass = () => {
    switch (settings.caretStyle) {
      case 'block':
        return 'w-2.5 h-7 opacity-75 animate-pulse';
      case 'underline':
        return 'w-2.5 h-1 self-end mb-1';
      case 'outline':
        return 'w-2.5 h-7 border-2 border-current bg-transparent';
      case 'line':
      default:
        return 'w-0.5 h-7 rounded-full';
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="relative w-full max-w-4xl mx-auto cursor-text select-none focus:outline-none"
    >
      {/* Hidden real input capturing keystrokes cleanly */}
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={() => {}} // Controlled by onKeyDown in hook
        onKeyDown={onKeyDown}
        className="opacity-0 absolute top-0 left-0 w-1 h-1 pointer-events-none"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        autoFocus
      />

      {/* Top Real-time HUD: Pacing, Stats & Combo */}
      <div className="flex items-center justify-between px-2 mb-4 text-sm font-mono select-none">
        {/* Left: Mode counter or timer */}
        <div className="flex items-center gap-3">
          {mode === 'time' && (
            <div className={`text-2xl font-bold tabular-nums ${theme.accentClass}`}>
              {timeLeft}
              <span className="text-xs font-normal opacity-60 ml-1">s</span>
            </div>
          )}

          {mode === 'words' && (
            <div className={`text-2xl font-bold tabular-nums ${theme.accentClass}`}>
              {Math.min(totalWordsTarget, currentWordIndex)}
              <span className="text-xs font-normal opacity-60 ml-1">/ {totalWordsTarget}</span>
            </div>
          )}

          {(mode === 'quote' || mode === 'code' || mode === 'zen' || mode === 'custom') && (
            <div className={`text-2xl font-bold tabular-nums ${theme.accentClass}`}>
              {elapsedSeconds}
              <span className="text-xs font-normal opacity-60 ml-1">s</span>
            </div>
          )}

          {/* Caps Lock indicator */}
          {capsLockActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-xs font-sans font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>CAPS LOCK</span>
            </div>
          )}
        </div>

        {/* Right: Live WPM, Accuracy & Streak */}
        <div className="flex items-center gap-5">
          {/* Combo streak flame */}
          {comboStreak > 15 && (
            <div className="flex items-center gap-1 text-xs font-sans font-semibold text-amber-500 animate-pulse">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span className="tabular-nums">{comboStreak} combo</span>
            </div>
          )}

          {settings.showLiveWpm && isActive && (
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-baseline gap-1">
                <span className={theme.subtextClass}>wpm:</span>
                <span className={`text-base font-bold tabular-nums ${theme.accentClass}`}>
                  {liveWpm}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={theme.subtextClass}>acc:</span>
                <span className="text-base font-bold tabular-nums text-current">
                  {liveAccuracy}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Words Box (3-line viewport with smooth scroll) */}
      <div
        className={`relative w-full h-36 md:h-44 overflow-hidden rounded-2xl p-6 md:p-8 border ${theme.borderClass} ${theme.surfaceClass} shadow-sm backdrop-blur-xs`}
      >
        <div
          ref={wordsContainerRef}
          className="flex flex-wrap gap-x-3 gap-y-4 font-mono text-xl md:text-2xl leading-relaxed tracking-wide transition-transform duration-200 ease-out"
          style={{
            transform: `translateY(-${containerOffset}px)`
          }}
        >
          {words.map((word, wordIdx) => {
            const isCurrent = wordIdx === currentWordIndex;
            const isTyped = wordIdx < currentWordIndex;
            const typedWord = typedWords[wordIdx] || '';

            return (
              <div
                key={wordIdx}
                ref={isCurrent ? activeWordRef : undefined}
                className="relative flex items-center"
              >
                {/* Past typed words */}
                {isTyped && (
                  <div className="flex items-center">
                    {word.split('').map((char, charIdx) => {
                      const typedChar = typedWord[charIdx];
                      const isCorrect = typedChar === char;
                      return (
                        <span
                          key={charIdx}
                          style={{
                            color: isCorrect ? theme.correctColor : theme.incorrectColor
                          }}
                          className={`transition-colors ${!isCorrect ? 'border-b border-rose-500' : ''}`}
                        >
                          {char}
                        </span>
                      );
                    })}

                    {/* Extra characters typed beyond target word */}
                    {typedWord.length > word.length &&
                      typedWord
                        .slice(word.length)
                        .split('')
                        .map((extraChar, extraIdx) => (
                          <span
                            key={`extra-${extraIdx}`}
                            style={{ color: theme.extraColor }}
                            className="opacity-80"
                          >
                            {extraChar}
                          </span>
                        ))}
                  </div>
                )}

                {/* Active current word */}
                {isCurrent && (
                  <div className="relative flex items-center">
                    {word.split('').map((char, charIdx) => {
                      const isTypedChar = charIdx < currentInput.length;
                      const typedChar = currentInput[charIdx];
                      const isCorrect = typedChar === char;
                      const isCaretHere = charIdx === currentInput.length;

                      return (
                        <span key={charIdx} className="relative inline-flex items-center">
                          {/* Caret before this char */}
                          {isCaretHere && (
                            <span
                              className={`absolute -left-[1px] ${getCaretClass()} ${theme.accentBgClass} pointer-events-none transition-all duration-75`}
                              style={{
                                boxShadow: `0 0 10px ${theme.accentColor}80`
                              }}
                            />
                          )}

                          <span
                            style={{
                              color: !isTypedChar
                                ? theme.untypedColor
                                : isCorrect
                                ? theme.correctColor
                                : theme.incorrectColor
                            }}
                            className={`transition-colors duration-75 ${
                              isTypedChar && !isCorrect ? 'bg-rose-500/10 rounded-xs' : ''
                            }`}
                          >
                            {char}
                          </span>
                        </span>
                      );
                    })}

                    {/* Extra typed characters */}
                    {currentInput.length > word.length &&
                      currentInput
                        .slice(word.length)
                        .split('')
                        .map((extraChar, extraIdx) => (
                          <span
                            key={`extra-current-${extraIdx}`}
                            style={{ color: theme.incorrectColor }}
                            className="bg-rose-500/20 rounded-xs"
                          >
                            {extraChar}
                          </span>
                        ))}

                    {/* Caret at end of word */}
                    {currentInput.length >= word.length && (
                      <span
                        className={`inline-block ${getCaretClass()} ${theme.accentBgClass} pointer-events-none transition-all duration-75`}
                        style={{
                          boxShadow: `0 0 10px ${theme.accentColor}80`
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Future unreached words */}
                {!isTyped && !isCurrent && (
                  <span style={{ color: theme.untypedColor }} className="opacity-70">
                    {word}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Quote Author citation if quote mode */}
        {quoteSource && (
          <div className="absolute bottom-3 right-6 text-xs text-right italic opacity-50 font-sans">
            — {quoteSource}
          </div>
        )}
      </div>

      {/* Quick Action Helpers */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs font-medium">
        <button
          onClick={onRestart}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${theme.borderClass} ${theme.surfaceClass} ${theme.subtextClass} hover:text-current hover:border-current/30 transition-all`}
          title="Restart Test (Esc or Tab)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Test</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded-sm bg-black/10 dark:bg-white/10 opacity-70">
            Esc
          </kbd>
        </button>
      </div>
    </div>
  );
}
