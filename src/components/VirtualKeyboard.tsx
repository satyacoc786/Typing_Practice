import { ThemeConfig } from '../utils/theme';

interface VirtualKeyboardProps {
  theme: ThemeConfig;
  nextChar: string; // The character user should type next
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
];

export function VirtualKeyboard({ theme, nextChar }: VirtualKeyboardProps) {
  const normalizedNext = nextChar ? nextChar.toLowerCase() : '';
  const isNextSpace = nextChar === ' ';

  const isKeyActive = (key: string) => {
    if (key === 'Space' && isNextSpace) return true;
    if (key.length === 1 && key.toLowerCase() === normalizedNext) return true;
    return false;
  };

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'Backspace':
        return 'w-16 flex-grow';
      case 'Tab':
      case '\\':
        return 'w-12';
      case 'Caps':
        return 'w-14';
      case 'Enter':
        return 'w-16 flex-grow';
      case 'Shift':
        return 'w-20 flex-grow';
      case 'Space':
        return 'w-64 max-w-sm flex-grow';
      default:
        return 'w-8 md:w-10';
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto mt-6 p-4 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} shadow-xs select-none transition-all duration-200`}>
      <div className="flex flex-col gap-1.5 items-center">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5 w-full justify-center">
            {row.map((key, keyIdx) => {
              const active = isKeyActive(key);
              return (
                <div
                  key={`${rowIdx}-${keyIdx}-${key}`}
                  className={`h-9 flex items-center justify-center rounded-lg text-xs font-mono font-medium transition-all duration-100 ${getKeyWidth(
                    key
                  )} ${
                    active
                      ? `${theme.accentBgClass} scale-105 shadow-sm font-bold`
                      : `bg-black/5 dark:bg-white/5 border ${theme.borderClass} ${theme.subtextClass}`
                  }`}
                >
                  {key === 'Space' ? (
                    <span className="text-[10px] opacity-70">SPACE</span>
                  ) : (
                    key
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px] mt-3 px-2 text-slate-400">
        <span>Touch Typing Guide</span>
        <span>Next Key: <strong className={`font-mono text-xs ${theme.accentClass}`}>{nextChar === ' ' ? 'Space' : nextChar || '—'}</strong></span>
      </div>
    </div>
  );
}
