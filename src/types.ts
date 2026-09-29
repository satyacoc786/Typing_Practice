export type GameMode = 'time' | 'words' | 'quote' | 'code' | 'zen' | 'custom';

export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;
export type QuoteLength = 'short' | 'medium' | 'long';
export type SwitchSound = 'thock' | 'clicky' | 'tactile' | 'typewriter' | 'bubble' | 'off';
export type CaretStyle = 'line' | 'block' | 'underline' | 'outline';
export type ThemeId = 'obsidian' | 'emerald' | 'frost' | 'matcha' | 'sunset' | 'paper';

export interface SecondSnapshot {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface KeyMistakeRecord {
  key: string;
  count: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  mode: GameMode;
  modeSetting: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  elapsedSeconds: number;
  charStats: {
    correct: number;
    incorrect: number;
    extra: number;
    missed: number;
  };
  keyMistakes: KeyMistakeRecord[];
  secondHistory: SecondSnapshot[];
  isPersonalBest?: boolean;
}

export interface GameSettings {
  theme: ThemeId;
  sound: SwitchSound;
  volume: number; // 0 to 1
  caretStyle: CaretStyle;
  smoothCaret: boolean;
  showKeyboard: boolean;
  showLiveWpm: boolean;
  showGhostPacer: boolean;
  pacerWpm: number;
  includeNumbers: boolean;
  includePunctuation: boolean;
  masterMode: boolean; // sudden death on single error
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
}
