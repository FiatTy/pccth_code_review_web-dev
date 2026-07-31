import { useId } from 'react';
import { useChartReveal } from './useChartReveal';

export interface LinePoint {
  label: string;
  value: number;
}

interface Pt {
  x: number;
  y: number;
}

/** Straight-line (polyline) path with crisp corners. */
function buildLinePath(points: Pt[]): string {
  if (points.length === 0) {
    return '';
  }
  return points.map((p, index) => `${index === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

export interface LineSeries {
  name: string;
  color: string;
  points: LinePoint[];
}

interface LineChartProps {
  series: LineSeries[];
  height?: number;
  suffix?: string;
  maxValue?: number;
  emptyLabel: string;
}

const PADDING_X = 44;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 26;
const VIEW_WIDTH = 720;
const TICKS = 4;

function formatTick(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 100) / 10}k`;
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function LineChart({
  series,
  height = 220,
  suffix = '',
  maxValue,
  emptyLabel,
}: LineChartProps) {
  const shown = useChartReveal();
  const uid = useId().replace(/:/g, '');
  const length = Math.max(0, ...series.map((line) => line.points.length));

  if (length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-dashed border-border text-xs text-faint"
        style={{ height }}
      >
        {emptyLabel}
      </div>
    );
  }

  const rawMax = Math.max(
    1,
    maxValue ?? Math.max(...series.flatMap((line) => line.points.map((point) => point.value))),
  );
  const step = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const top = Math.ceil(rawMax / step) * step;

  const plotWidth = VIEW_WIDTH - PADDING_X - 12;
  const plotHeight = height - PADDING_TOP - PADDING_BOTTOM;
  const xOf = (index: number) =>
    PADDING_X + (length === 1 ? plotWidth / 2 : (index / (length - 1)) * plotWidth);
  const yOf = (value: number) => PADDING_TOP + plotHeight - (value / top) * plotHeight;

  const labels = (series.find((line) => line.points.length === length) ?? series[0]).points.map(
    (point) => point.label,
  );
  const labelStride = Math.max(1, Math.ceil(length / 7));

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
      width="100%"
      height={height}
      role="img"
      preserveAspectRatio="none"
    >
      {Array.from({ length: TICKS + 1 }, (_, index) => {
        const value = (top / TICKS) * index;
        const y = yOf(value);
        return (
          <g key={index}>
            <line
              x1={PADDING_X}
              y1={y}
              x2={VIEW_WIDTH - 12}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth={1}
              strokeDasharray={index === 0 ? undefined : '2 5'}
              opacity={index === 0 ? 1 : 0.7}
            />
            <text
              x={PADDING_X - 8}
              y={y + 3.5}
              textAnchor="end"
              className="fill-faint"
              style={{ fontSize: 10 }}
            >
              {formatTick(value)}
              {suffix}
            </text>
          </g>
        );
      })}

      {labels.map((label, index) =>
        index % labelStride === 0 || index === length - 1 ? (
          <text
            key={label + index}
            x={xOf(index)}
            y={height - 8}
            textAnchor="middle"
            className="fill-faint"
            style={{ fontSize: 10 }}
          >
            {label}
          </text>
        ) : null,
      )}

      {series.map((line, seriesIndex) => {
        if (line.points.length === 0) {
          return null;
        }
        const coords = line.points.map((point, index) => ({
          x: xOf(index),
          y: yOf(point.value),
        }));
        const path = buildLinePath(coords);
        const area = `${path} L${coords[coords.length - 1].x},${yOf(0)} L${coords[0].x},${yOf(0)} Z`;
        const lineDelay = seriesIndex * 180;
        const gradientId = `${uid}-area-${seriesIndex}`;
        return (
          <g key={line.name}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={line.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path
              d={area}
              fill={`url(#${gradientId})`}
              opacity={shown ? 1 : 0}
              style={{
                transition: 'opacity 700ms ease',
                transitionDelay: `${lineDelay + 250}ms`,
              }}
            />
            <path
              d={path}
              fill="none"
              stroke={line.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={shown ? 0 : 1}
              style={{
                transition: 'stroke-dashoffset 1100ms cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${lineDelay}ms`,
              }}
            />
            {coords.map((coord, index) => (
              <circle
                key={line.points[index].label + index}
                cx={coord.x}
                cy={coord.y}
                r={3}
                fill={line.color}
                stroke="var(--color-surface)"
                strokeWidth={1.5}
                opacity={shown ? 1 : 0}
                style={{
                  transition: 'opacity 260ms ease',
                  transitionDelay: `${lineDelay + 900 + index * 25}ms`,
                }}
              >
                <title>{`${line.name} · ${line.points[index].label}: ${line.points[index].value}${suffix}`}</title>
              </circle>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
