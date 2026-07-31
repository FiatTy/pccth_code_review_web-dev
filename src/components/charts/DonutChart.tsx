import { useId } from 'react';
import { useChartReveal } from './useChartReveal';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  thickness?: number;
  centerValue?: string;
  centerLabel?: string;
}

export function DonutChart({
  data,
  size = 168,
  thickness = 18,
  centerValue,
  centerLabel,
}: DonutChartProps) {
  const shown = useChartReveal();
  const uid = useId().replace(/:/g, '');
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const visibleSegments = data.filter((segment) => segment.value > 0);
  // Gap between arcs (in circumference px); rounded caps sit inside the gap.
  const gap = visibleSegments.length > 1 ? Math.min(thickness * 1.1, circumference * 0.04) : 0;
  let consumed = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
      <defs>
        {data.map((segment, index) => (
          <linearGradient key={index} id={`${uid}-g${index}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={segment.color} />
            <stop offset="100%" stopColor={segment.color} stopOpacity={0.68} />
          </linearGradient>
        ))}
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.16" />
        </filter>
      </defs>

      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-surface-2)"
          strokeWidth={thickness}
        />
        <g filter={`url(#${uid}-shadow)`}>
          {total > 0 &&
            data.map((segment, index) => {
              if (segment.value <= 0) {
                return null;
              }
              const fullLength = (segment.value / total) * circumference;
              const visible = Math.max(0.001, fullLength - gap);
              const offset = -(consumed + gap / 2);
              const element = (
                <circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={`url(#${uid}-g${index})`}
                  strokeWidth={thickness}
                  strokeLinecap="round"
                  strokeDasharray={
                    shown ? `${visible} ${circumference - visible}` : `0 ${circumference}`
                  }
                  strokeDashoffset={offset}
                  style={{
                    transition: 'stroke-dasharray 900ms cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${index * 120}ms`,
                  }}
                />
              );
              consumed += fullLength;
              return element;
            })}
        </g>
      </g>

      {centerValue ? (
        <text
          x={center}
          y={centerLabel ? center - 2 : center + 6}
          textAnchor="middle"
          className="fill-fg"
          style={{ fontSize: 24, fontWeight: 600 }}
        >
          {centerValue}
        </text>
      ) : null}
      {centerLabel ? (
        <text
          x={center}
          y={center + 18}
          textAnchor="middle"
          className="fill-muted"
          style={{ fontSize: 11, letterSpacing: 0.4 }}
        >
          {centerLabel}
        </text>
      ) : null}
    </svg>
  );
}
