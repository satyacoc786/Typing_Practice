import { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameMode,
  TimeOption,
  WordOption,
  QuoteLength,
  GameSettings,
  SecondSnapshot,
  KeyMistakeRecord,
  TestResult
} from '../types';
import {
  generateWords,
  getRandomQuote,
  getRandomCodeSnippet,
  generateWeakKeyDrill,
  QuoteItem
} from '../utils/textGenerator';
import { soundEngine } from '../utils/audio';

export interface UseTypingEngineProps {
  settings: GameSettings;
  mode: GameMode;
  timeOption: TimeOption;
  wordOption: WordOption;
  quoteLength: QuoteLength;
  customText?: string;
  weakKeysPractice?: string[];
  onFinishTest: (result: TestResult) => void;
}

export function useTypingEngine({
  settings,
  mode,
  timeOption,
  wordOption,
  quoteLength,
  customText,
  weakKeysPractice,
  onFinishTest
}: UseTypingEngineProps) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [quoteInfo, setQuoteInfo] = useState<QuoteItem | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeOption);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Combo & Streak
  const [comboStreak, setComboStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  // Real-time tracking
  const [secondHistory, setSecondHistory] = useState<SecondSnapshot[]>([]);
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveRawWpm, setLiveRawWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);

  // Ref tracking for accurate timer loop calculations
  const keyMistakesMap = useRef<Map<string, number>>(new Map());
  const correctKeystrokes = useRef(0);
  const incorrectKeystrokes = useRef(0);
  const totalKeystrokes = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const secondCounterRef = useRef(0);
  const secondHistoryRef = useRef<SecondSnapshot[]>([]);
  const isFinishedRef = useRef(false);

  // Initialize or reset text
  const initializeText = useCallback(() => {
    let rawText = '';
    let quoteItem: QuoteItem | null = null;

    if (weakKeysPractice && weakKeysPractice.length > 0) {
      rawText = generateWeakKeyDrill(weakKeysPractice, 35);
    } else if (mode === 'custom' && customText && customText.trim()) {
      rawText = customText.trim();
    } else if (mode === 'quote') {
      quoteItem = getRandomQuote(quoteLength);
      rawText = quoteItem.text;
      setQuoteInfo(quoteItem);
    } else if (mode === 'code') {
      rawText = getRandomCodeSnippet();
      setQuoteInfo(null);
    } else if (mode === 'words') {
      rawText = generateWords(wordOption, {
        numbers: settings.includeNumbers,
        punctuation: settings.includePunctuation
      });
      setQuoteInfo(null);
    } else {
      // Time or Zen mode: start with generous buffer of words
      rawText = generateWords(80, {
        numbers: settings.includeNumbers,
        punctuation: settings.includePunctuation
      });
      setQuoteInfo(null);
    }

    const wordArray = rawText.split(/\s+/).filter(Boolean);
    setWords(wordArray);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedWords([]);
    setIsActive(false);
    setIsFinished(false);
    isFinishedRef.current = false;
    setTimeLeft(timeOption);
    setElapsedSeconds(0);
    setComboStreak(0);
    setMaxCombo(0);
    setSecondHistory([]);
    secondHistoryRef.current = [];
    setLiveWpm(0);
    setLiveRawWpm(0);
    setLiveAccuracy(100);

    // Reset refs
    keyMistakesMap.current = new Map();
    correctKeystrokes.current = 0;
    incorrectKeystrokes.current = 0;
    totalKeystrokes.current = 0;
    startTimeRef.current = null;
    secondCounterRef.current = 0;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [mode, timeOption, wordOption, quoteLength, customText, weakKeysPractice, settings.includeNumbers, settings.includePunctuation]);

  useEffect(() => {
    initializeText();
  }, [initializeText]);

  // Append more words dynamically if approaching the end in time or zen mode
  useEffect(() => {
    if ((mode === 'time' || mode === 'zen') && words.length > 0 && currentWordIndex > words.length - 20) {
      const more = generateWords(40, {
        numbers: settings.includeNumbers,
        punctuation: settings.includePunctuation
      }).split(/\s+/).filter(Boolean);
      setWords(prev => [...prev, ...more]);
    }
  }, [currentWordIndex, words.length, mode, settings.includeNumbers, settings.includePunctuation]);

  // Complete test function
  const finishTest = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsActive(false);
    setIsFinished(true);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const endTime = Date.now();
    const durationSec = startTimeRef.current
      ? Math.max(1, (endTime - startTimeRef.current) / 1000)
      : Math.max(1, elapsedSeconds);
    const durationMin = durationSec / 60;

    const totalChars = totalKeystrokes.current;
    const correctChars = correctKeystrokes.current;
    const incorrectChars = incorrectKeystrokes.current;

    const netWpm = Math.max(0, Math.round((correctChars / 5) / durationMin));
    const rawWpm = Math.max(0, Math.round((totalChars / 5) / durationMin));
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    // Calculate consistency based on snapshots
    let consistency = 100;
    if (secondHistoryRef.current.length > 2) {
      const wpms = secondHistoryRef.current.map(s => s.wpm);
      const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      if (mean > 0) {
        const variance = wpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpms.length;
        const sd = Math.sqrt(variance);
        const cv = (sd / mean) * 100;
        consistency = Math.max(0, Math.min(100, Math.round(100 - cv)));
      }
    }

    // Convert key mistakes
    const keyMistakes: KeyMistakeRecord[] = Array.from(keyMistakesMap.current.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count);

    const result: TestResult = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      mode,
      modeSetting: mode === 'time' ? `${timeOption}s` : mode === 'words' ? `${wordOption}w` : mode,
      wpm: netWpm,
      rawWpm,
      accuracy,
      consistency,
      elapsedSeconds: Math.round(durationSec),
      charStats: {
        correct: correctChars,
        incorrect: incorrectChars,
        extra: 0,
        missed: 0
      },
      keyMistakes,
      secondHistory: secondHistoryRef.current
    };

    soundEngine.playFinish(false);
    onFinishTest(result);
  }, [elapsedSeconds, mode, timeOption, wordOption, onFinishTest]);

  // Timer loop
  useEffect(() => {
    if (!isActive || isFinished) return;

    timerIntervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const roundedSec = Math.floor(elapsed);

      setElapsedSeconds(roundedSec);

      // Snapshot every second
      if (roundedSec > secondCounterRef.current) {
        secondCounterRef.current = roundedSec;
        const curMin = roundedSec / 60;
        const curWpm = curMin > 0 ? Math.round((correctKeystrokes.current / 5) / curMin) : 0;
        const curRaw = curMin > 0 ? Math.round((totalKeystrokes.current / 5) / curMin) : 0;

        const snapshot: SecondSnapshot = {
          second: roundedSec,
          wpm: curWpm,
          rawWpm: curRaw,
          errors: incorrectKeystrokes.current
        };

        secondHistoryRef.current.push(snapshot);
        setSecondHistory([...secondHistoryRef.current]);

        setLiveWpm(curWpm);
        setLiveRawWpm(curRaw);
        setLiveAccuracy(
          totalKeystrokes.current > 0
            ? Math.round((correctKeystrokes.current / totalKeystrokes.current) * 100)
            : 100
        );
      }

      if (mode === 'time') {
        const remaining = Math.max(0, timeOption - Math.floor(elapsed));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          finishTest();
        }
      }
    }, 100);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isActive, isFinished, mode, timeOption, finishTest]);

  // Handle typing keydown
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
      if (isFinishedRef.current) return;

      // Track caps lock
      if (e.getModifierState) {
        setCapsLockActive(e.getModifierState('CapsLock'));
      }

      // Quick restart shortcuts: Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        initializeText();
        return;
      }

      // Quick restart: Tab + Enter
      if (e.key === 'Tab') {
        e.preventDefault();
        initializeText();
        return;
      }

      // Start on first valid keypress
      if (!isActive && !isFinishedRef.current) {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setIsActive(true);
          startTimeRef.current = Date.now();
        }
      }

      const targetWord = words[currentWordIndex] || '';

      // Backspace handling
      if (e.key === 'Backspace') {
        e.preventDefault();

        // Ctrl/Cmd + Backspace clears whole word
        if (e.ctrlKey || e.metaKey) {
          setCurrentInput('');
          return;
        }

        if (currentInput.length > 0) {
          setCurrentInput(prev => prev.slice(0, -1));
        } else if (currentWordIndex > 0) {
          // Jump back to previous word if there were errors
          const prevWord = words[currentWordIndex - 1];
          const prevTyped = typedWords[currentWordIndex - 1];
          if (prevTyped !== undefined && prevTyped !== prevWord) {
            setCurrentWordIndex(prev => prev - 1);
            setCurrentInput(prevTyped);
            setTypedWords(prev => prev.slice(0, -1));
          }
        }
        return;
      }

      // Space handling: advance word
      if (e.key === ' ') {
        e.preventDefault();
        if (currentInput.length === 0) return; // Do not skip empty

        soundEngine.playKey(true);
        totalKeystrokes.current += 1;

        // Evaluate word correctness
        let wordCorrect = true;
        for (let i = 0; i < Math.max(targetWord.length, currentInput.length); i++) {
          if (currentInput[i] === targetWord[i]) {
            correctKeystrokes.current += 1;
          } else {
            incorrectKeystrokes.current += 1;
            wordCorrect = false;
            const expectedChar = targetWord[i] || ' ';
            keyMistakesMap.current.set(
              expectedChar,
              (keyMistakesMap.current.get(expectedChar) || 0) + 1
            );
          }
        }

        // Space bonus count
        if (currentInput === targetWord) {
          correctKeystrokes.current += 1;
        }

        // Master mode instant death check
        if (settings.masterMode && !wordCorrect) {
          soundEngine.playError();
          finishTest();
          return;
        }

        // Save typed word
        const newTyped = [...typedWords, currentInput];
        setTypedWords(newTyped);

        // Check if finished (Words, Quote, Code mode)
        const isLastWord = currentWordIndex >= words.length - 1;
        if (isLastWord && (mode === 'words' || mode === 'quote' || mode === 'code' || mode === 'custom')) {
          finishTest();
          return;
        }

        // Advance to next word
        setCurrentWordIndex(prev => prev + 1);
        setCurrentInput('');
        return;
      }

      // Regular single characters
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const char = e.key;
        const charIndex = currentInput.length;
        const expectedChar = targetWord[charIndex];

        totalKeystrokes.current += 1;

        const isCorrect = char === expectedChar;

        if (isCorrect) {
          correctKeystrokes.current += 1;
          soundEngine.playKey(false);

          setComboStreak(prev => {
            const next = prev + 1;
            if (next > maxCombo) setMaxCombo(next);
            if (next === 25 || next === 50 || next === 100 || (next > 100 && next % 50 === 0)) {
              soundEngine.playStreakChime(next);
            }
            return next;
          });
        } else {
          incorrectKeystrokes.current += 1;
          soundEngine.playError();
          setComboStreak(0);

          if (expectedChar) {
            keyMistakesMap.current.set(
              expectedChar,
              (keyMistakesMap.current.get(expectedChar) || 0) + 1
            );
          }

          // Sudden death check in master mode
          if (settings.masterMode) {
            finishTest();
            return;
          }
        }

        const nextInput = currentInput + char;
        setCurrentInput(nextInput);

        // Auto-complete on last character if it is the very last word of a quote/snippet
        if (
          currentWordIndex === words.length - 1 &&
          nextInput === targetWord &&
          (mode === 'quote' || mode === 'code' || mode === 'words' || mode === 'custom')
        ) {
          totalKeystrokes.current += 1;
          correctKeystrokes.current += 1;
          const newTyped = [...typedWords, nextInput];
          setTypedWords(newTyped);
          finishTest();
        }
      }
    },
    [
      words,
      currentWordIndex,
      currentInput,
      typedWords,
      isActive,
      mode,
      settings.masterMode,
      maxCombo,
      initializeText,
      finishTest
    ]
  );

  return {
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
    maxCombo,
    liveWpm,
    liveRawWpm,
    liveAccuracy,
    secondHistory,
    handleKeyDown,
    restartTest: initializeText
  };
}
