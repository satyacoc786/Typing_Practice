import { QuoteLength } from '../types';

export const COMMON_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it',
  'that', 'for', 'they', 'with', 'as', 'not', 'on', 'she', 'at', 'by',
  'this', 'we', 'you', 'do', 'but', 'his', 'from', 'they', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
  'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
  'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its',
  'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
  'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any',
  'these', 'give', 'day', 'most', 'us', 'great', 'world', 'here', 'right',
  'still', 'life', 'never', 'feel', 'own', 'down', 'light', 'water', 'place',
  'stand', 'find', 'point', 'hand', 'part', 'child', 'eye', 'ask', 'seem',
  'next', 'group', 'number', 'system', 'program', 'run', 'read', 'code',
  'write', 'state', 'clear', 'focus', 'fast', 'quick', 'sharp', 'fluid',
  'motion', 'craft', 'mind', 'power', 'rhythm', 'pace', 'space', 'breath',
  'spark', 'stone', 'river', 'cloud', 'flame', 'silver', 'copper', 'golden',
  'orbit', 'signal', 'echo', 'prism', 'pulse', 'drift', 'shift', 'glide',
  'forge', 'track', 'bloom', 'vault', 'trace', 'weave', 'stride', 'zenith'
];

export interface QuoteItem {
  text: string;
  source: string;
  length: QuoteLength;
}

export const QUOTES: QuoteItem[] = [
  {
    text: "Simplicity is prerequisite for reliability.",
    source: "Edsger W. Dijkstra",
    length: "short"
  },
  {
    text: "Make it work, make it right, make it fast.",
    source: "Kent Beck",
    length: "short"
  },
  {
    text: "The only way to go fast is to go well.",
    source: "Robert C. Martin",
    length: "short"
  },
  {
    text: "Premature optimization is the root of all evil in programming.",
    source: "Donald Knuth",
    length: "short"
  },
  {
    text: "We shape our tools and thereafter our tools shape us.",
    source: "Marshall McLuhan",
    length: "short"
  },
  {
    text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
    source: "Antoine de Saint-Exupéry",
    length: "medium"
  },
  {
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    source: "Harold Abelson",
    length: "medium"
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    source: "Martin Fowler",
    length: "medium"
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    source: "Marcus Aurelius",
    length: "medium"
  },
  {
    text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    source: "Buddha",
    length: "medium"
  },
  {
    text: "It is not the critic who counts, not the man who points out how the strong man stumbles, but the man who is actually in the arena, whose face is marred by dust and sweat and blood.",
    source: "Theodore Roosevelt",
    length: "long"
  },
  {
    text: "Computer science is no more about computers than astronomy is about telescopes. The universe of computation is bounded only by the elegance of human imagination.",
    source: "Edsger W. Dijkstra",
    length: "long"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall. Consistency and calm precision create mastery over haste.",
    source: "Nelson Mandela",
    length: "long"
  }
];

export const CODE_SNIPPETS = [
  "const debounce = (fn, ms) => { let id; return (...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), ms); }; };",
  "function binarySearch(arr, target) { let l = 0, r = arr.length - 1; while (l <= r) { const mid = (l + r) >> 1; if (arr[mid] === target) return mid; if (arr[mid] < target) l = mid + 1; else r = mid - 1; } return -1; }",
  "interface Vector2D { x: number; y: number; magnitude(): number; normalize(): Vector2D; }",
  "const memoize = (fn) => { const cache = new Map(); return (arg) => (cache.has(arg) ? cache.get(arg) : (cache.set(arg, fn(arg)), cache.get(arg))); };",
  "export async function fetchWithRetry(url, options = {}, retries = 3) { for (let i = 0; i < retries; i++) { try { return await fetch(url, options); } catch (e) { if (i === retries - 1) throw e; } } }",
  "type DeepReadonly<T> = { readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]; };"
];

export const PANGRAMS = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "Sphinx of black quartz, judge my vow.",
  "How vexingly quick daft zebras jump!",
  "Bright vixens jump; dozy fowl quack.",
  "Quick zephyrs blow, vexing daft Jim."
];

export function generateWords(count: number, options: { numbers?: boolean; punctuation?: boolean } = {}): string {
  const result: string[] = [];
  const punctuationMarks = ['.', ',', ';', '!', '?', '-'];

  for (let i = 0; i < count; i++) {
    // Occasionally pick a number if enabled
    if (options.numbers && Math.random() < 0.12) {
      result.push(Math.floor(Math.random() * 900 + 10).toString());
      continue;
    }

    let word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];

    // Capitalize first word or random word if punctuation enabled
    if (options.punctuation && (i === 0 || result[i - 1]?.endsWith('.'))) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    if (options.punctuation && Math.random() < 0.2 && i < count - 1) {
      const punct = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
      word += punct;
    }

    result.push(word);
  }

  // Ensure last word has a period if punctuation is active
  if (options.punctuation && result.length > 0) {
    const last = result[result.length - 1];
    if (!last.endsWith('.')) {
      result[result.length - 1] = last.replace(/[,;?!-]$/, '') + '.';
    }
  }

  return result.join(' ');
}

export function getRandomQuote(length?: QuoteLength): QuoteItem {
  const pool = length ? QUOTES.filter(q => q.length === length) : QUOTES;
  return pool[Math.floor(Math.random() * pool.length)] || QUOTES[0];
}

export function getRandomCodeSnippet(): string {
  return CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
}

/**
 * Generates a targeted drill practicing the user's specific weak keys.
 * Finds dictionary words containing the targeted keys, interspersed with connecting words.
 */
export function generateWeakKeyDrill(weakKeys: string[], wordCount: number = 30): string {
  if (!weakKeys.length) {
    return generateWords(wordCount);
  }

  const cleanKeys = weakKeys.map(k => k.toLowerCase()).filter(k => k.length === 1 && /[a-z0-9]/.test(k));
  if (!cleanKeys.length) return generateWords(wordCount);

  // Filter dictionary for words that contain at least one of the weak keys
  const matchingWords = COMMON_WORDS.filter(w =>
    cleanKeys.some(k => w.toLowerCase().includes(k))
  );

  const fallbackPool = matchingWords.length >= 10 ? matchingWords : COMMON_WORDS;
  const drillWords: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    // 70% of words contain target keys, 30% are rhythm transitions
    if (Math.random() < 0.75 && fallbackPool.length > 0) {
      drillWords.push(fallbackPool[Math.floor(Math.random() * fallbackPool.length)]);
    } else {
      drillWords.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
    }
  }

  return drillWords.join(' ');
}
