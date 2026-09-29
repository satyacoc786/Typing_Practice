import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  isDark: boolean;
  bgClass: string;
  surfaceClass: string;
  borderClass: string;
  textClass: string;
  subtextClass: string;
  accentClass: string;
  accentBgClass: string;
  accentBorderClass: string;
  accentColor: string; // for inline SVG/Canvas rendering
  cursorColor: string;
  untypedColor: string;
  correctColor: string;
  incorrectColor: string;
  extraColor: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Amber',
    isDark: true,
    bgClass: 'bg-[#0e1117] text-[#e2e8f0]',
    surfaceClass: 'bg-[#181c26]',
    borderClass: 'border-[#262c3d]',
    textClass: 'text-[#e2e8f0]',
    subtextClass: 'text-[#64748b]',
    accentClass: 'text-[#f59e0b]',
    accentBgClass: 'bg-[#f59e0b] text-[#0e1117]',
    accentBorderClass: 'border-[#f59e0b]',
    accentColor: '#f59e0b',
    cursorColor: '#f59e0b',
    untypedColor: '#475569',
    correctColor: '#f1f5f9',
    incorrectColor: '#f43f5e',
    extraColor: '#9f1239'
  },
  emerald: {
    id: 'emerald',
    name: 'Carbon Emerald',
    isDark: true,
    bgClass: 'bg-[#091310] text-[#e2f5ee]',
    surfaceClass: 'bg-[#10231d]',
    borderClass: 'border-[#1b3b31]',
    textClass: 'text-[#e2f5ee]',
    subtextClass: 'text-[#4e7d70]',
    accentClass: 'text-[#10b981]',
    accentBgClass: 'bg-[#10b981] text-[#091310]',
    accentBorderClass: 'border-[#10b981]',
    accentColor: '#10b981',
    cursorColor: '#10b981',
    untypedColor: '#365b50',
    correctColor: '#ecfdf5',
    incorrectColor: '#fb7185',
    extraColor: '#be123c'
  },
  frost: {
    id: 'frost',
    name: 'Nordic Frost',
    isDark: true,
    bgClass: 'bg-[#0b1320] text-[#e0f2fe]',
    surfaceClass: 'bg-[#132036]',
    borderClass: 'border-[#1e3458]',
    textClass: 'text-[#e0f2fe]',
    subtextClass: 'text-[#50729f]',
    accentClass: 'text-[#38bdf8]',
    accentBgClass: 'bg-[#38bdf8] text-[#0b1320]',
    accentBorderClass: 'border-[#38bdf8]',
    accentColor: '#38bdf8',
    cursorColor: '#38bdf8',
    untypedColor: '#3b557b',
    correctColor: '#f0f9ff',
    incorrectColor: '#fb7185',
    extraColor: '#be123c'
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Serene',
    isDark: true,
    bgClass: 'bg-[#121713] text-[#ecf2eb]',
    surfaceClass: 'bg-[#1c241e]',
    borderClass: 'border-[#2d3a30]',
    textClass: 'text-[#ecf2eb]',
    subtextClass: 'text-[#687e6b]',
    accentClass: 'text-[#84cc16]',
    accentBgClass: 'bg-[#84cc16] text-[#121713]',
    accentBorderClass: 'border-[#84cc16]',
    accentColor: '#84cc16',
    cursorColor: '#84cc16',
    untypedColor: '#455748',
    correctColor: '#f7fee7',
    incorrectColor: '#f87171',
    extraColor: '#b91c1c'
  },
  sunset: {
    id: 'sunset',
    name: 'Cyber Dusk',
    isDark: true,
    bgClass: 'bg-[#130f1c] text-[#f5eefb]',
    surfaceClass: 'bg-[#1f1730]',
    borderClass: 'border-[#382a57]',
    textClass: 'text-[#f5eefb]',
    subtextClass: 'text-[#7d6c9e]',
    accentClass: 'text-[#fb7185]',
    accentBgClass: 'bg-[#fb7185] text-[#130f1c]',
    accentBorderClass: 'border-[#fb7185]',
    accentColor: '#fb7185',
    cursorColor: '#fb7185',
    untypedColor: '#534371',
    correctColor: '#fff1f2',
    incorrectColor: '#e11d48',
    extraColor: '#9f1239'
  },
  paper: {
    id: 'paper',
    name: 'Paper Studio',
    isDark: false,
    bgClass: 'bg-[#f8fafc] text-[#0f172a]',
    surfaceClass: 'bg-[#ffffff]',
    borderClass: 'border-[#e2e8f0]',
    textClass: 'text-[#0f172a]',
    subtextClass: 'text-[#94a3b8]',
    accentClass: 'text-[#2563eb]',
    accentBgClass: 'bg-[#2563eb] text-[#ffffff]',
    accentBorderClass: 'border-[#2563eb]',
    accentColor: '#2563eb',
    cursorColor: '#2563eb',
    untypedColor: '#cbd5e1',
    correctColor: '#0f172a',
    incorrectColor: '#dc2626',
    extraColor: '#991b1b'
  }
};
