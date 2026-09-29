import { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface CustomTextModalProps {
  theme: ThemeConfig;
  onApplyCustomText: (text: string) => void;
  onClose: () => void;
}

export function CustomTextModal({
  theme,
  onApplyCustomText,
  onClose
}: CustomTextModalProps) {
  const [text, setText] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      onApplyCustomText(text.trim());
      onClose();
    }
  };

  const sampleTexts = [
    {
      title: 'Pangram Workout',
      snippet: 'The quick brown fox jumps over the lazy dog while Sphinx of black quartz judged my sacred vow.'
    },
    {
      title: 'Programming Logic',
      snippet: 'const calculateLatency = (start, end) => Math.max(0, end - start);'
    },
    {
      title: 'Inspirational Wisdom',
      snippet: 'Mastery is not a function of genius or haste, but of constant calm practice and relentless presence.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-lg rounded-3xl border ${theme.borderClass} ${theme.surfaceClass} p-6 shadow-2xl transition-all`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-current/10">
          <div className="flex items-center gap-2">
            <FileText className={`w-5 h-5 ${theme.accentClass}`} />
            <h2 className="text-base font-bold tracking-tight text-current">
              Custom Practice Text
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border ${theme.borderClass} ${theme.subtextClass} hover:text-current hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleApply} className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-current mb-2">
              Paste or type your own practice text:
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste any paragraphs, code, or article snippet here..."
              className={`w-full p-3 rounded-xl border ${theme.borderClass} bg-black/5 dark:bg-white/5 font-mono text-xs text-current placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-current`}
              autoFocus
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold opacity-60 uppercase tracking-wider mb-2">
              Or quick insert samples:
            </span>
            <div className="space-y-1.5">
              {sampleTexts.map((sample, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setText(sample.snippet)}
                  className={`w-full text-left p-2.5 rounded-lg border ${theme.borderClass} hover:bg-black/5 dark:hover:bg-white/5 text-xs transition-colors`}
                >
                  <div className="font-semibold text-current">{sample.title}</div>
                  <div className="text-[11px] opacity-60 truncate">{sample.snippet}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-current/10">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium border ${theme.borderClass} ${theme.subtextClass} hover:text-current`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className={`px-5 py-2 rounded-xl text-xs font-semibold ${theme.accentBgClass} disabled:opacity-40 hover:opacity-90`}
            >
              Start Custom Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
