import { useState } from 'react';
import { SecondSnapshot } from '../types';
import { ThemeConfig } from '../utils/theme';

interface WpmChartProps {
  theme: ThemeConfig;
  data: SecondSnapshot[];
  height?: number;
}

export function WpmChart({ theme, data, height = 200 }: WpmChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length < 2) {
    return (
      <div
        className={`w-full flex items-center justify-center rounded-xl border ${theme.borderClass} ${theme.surfaceClass} text-xs ${theme.subtextClass}`}
        style={{ height }}
      >
        Complete a longer session to view second-by-second analytics
      </div>
    );
  }

  const maxWpm = Math.max(...data.map(d => Math.max(d.wpm, d.rawWpm, 40))) + 15;
  const minWpm = 0;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = 700;
  const chartHeight = height;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    return paddingLeft + (index / (data.length - 1)) * graphWidth;
  };

  const getY = (val: number) => {
    return paddingTop + graphHeight - ((val - minWpm) / (maxWpm - minWpm)) * graphHeight;
  };

  // Generate Net WPM smooth path
  const wpmPoints = data.map((d, i) => `${getX(i)},${getY(d.wpm)}`);
  const wpmPathD = `M ${wpmPoints.join(' L ')}`;
  const areaPathD = `${wpmPathD} L ${getX(data.length - 1)},${getY(0)} L ${getX(0)},${getY(0)} Z`;

  // Generate Raw WPM dotted path
  const rawPoints = data.map((d, i) => `${getX(i)},${getY(d.rawWpm)}`);
  const rawPathD = `M ${rawPoints.join(' L ')}`;

  // Y-axis ticks
  const yTicks = [0, Math.round(maxWpm / 2), Math.round(maxWpm)];

  return (
    <div className={`relative w-full rounded-2xl p-4 border ${theme.borderClass} ${theme.surfaceClass} shadow-xs select-none`}>
      <div className="flex items-center justify-between text-xs mb-3 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accentColor }} />
            <span className="font-medium text-current">Net WPM</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-2.5 h-0.5 border-b border-dashed border-current" />
            <span>Raw WPM</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-500">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Errors</span>
          </div>
        </div>

        {hoverIndex !== null && data[hoverIndex] && (
          <div className="font-mono tabular-nums text-xs">
            <span className="opacity-60">{data[hoverIndex].second}s · </span>
            <span className={theme.accentClass}><strong className="font-bold">{data[hoverIndex].wpm}</strong> wpm</span>
            <span className="opacity-60"> · raw: {data[hoverIndex].rawWpm}</span>
            {data[hoverIndex].errors > 0 && (
              <span className="text-rose-500 font-semibold"> · {data[hoverIndex].errors} errors</span>
            )}
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.accentColor} stopOpacity="0.28" />
              <stop offset="100%" stopColor={theme.accentColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map(tick => (
            <g key={tick}>
              <line
                x1={paddingLeft}
                y1={getY(tick)}
                x2={chartWidth - paddingRight}
                y2={getY(tick)}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="3 3"
              />
              <text
                x={paddingLeft - 8}
                y={getY(tick) + 4}
                textAnchor="end"
                className="text-[10px] font-mono fill-current opacity-40 tabular-nums"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPathD} fill="url(#wpmGradient)" />

          {/* Raw WPM line */}
          <path
            d={rawPathD}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Net WPM main line */}
          <path
            d={wpmPathD}
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Error markers */}
          {data.map((d, i) => {
            if (d.errors <= 0) return null;
            return (
              <circle
                key={`err-${i}`}
                cx={getX(i)}
                cy={getY(d.wpm)}
                r="3.5"
                fill="#f43f5e"
                stroke="white"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Interactive hover crosshairs */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={paddingTop + graphHeight}
                stroke={theme.accentColor}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].wpm)}
                r="5"
                fill={theme.accentColor}
                stroke="white"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Interactive touch/mouse columns */}
          {data.map((_, i) => (
            <rect
              key={`zone-${i}`}
              x={getX(i) - graphWidth / (data.length * 2)}
              y={paddingTop}
              width={graphWidth / data.length}
              height={graphHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
