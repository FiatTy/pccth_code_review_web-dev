import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useChartReveal } from './useChartReveal';

export interface LinePoint {
  label: string;
  value: number;
}

interface Pt {
  x: number;
  y: number;
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
const PADDING_RIGHT = 14;
const PADDING_TOP = 14;
const PADDING_BOTTOM = 26;
const FALLBACK_WIDTH = 720;

/**
 * Picks an axis top and tick step off the 1/2/2.5/5/10 ladder so ticks land on
 * round numbers. Dividing the raw maximum into a fixed 4 gives axes like
 * 0 / 12.5 / 25 / 37.5 / 50, which reads as noise.
 */
function niceScale(rawMax: number): { top: number; step: number } {
  if (Number.isInteger(rawMax) && rawMax <= 6) {
    return { top: rawMax, step: 1 };
  }
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  for (const base of [magnitude, magnitude / 10, magnitude * 10]) {
    for (const multiple of [1, 2, 2.5, 5, 10]) {
      const step = multiple * base;
      const count = Math.ceil(rawMax / step);
      if (count >= 3 && count <= 6) {
        return { top: step * count, step };
      }
    }
  }
  return { top: rawMax, step: rawMax / 4 };
}

/**
 * Monotone cubic (Fritsch–Carlson) interpolation.
 *
 * A hard polyline reads cheap, but naive Bezier smoothing overshoots and draws
 * peaks the data never had. Monotone interpolation curves between points while
 * guaranteeing no local extremum is introduced, so the line never claims a value
 * that isn't in the series.
 */
function buildLinePath(points: Pt[]): string {
  const n = points.length;
  if (n === 0) {
    return '';
  }
  const r = (value: number) => Math.round(value * 100) / 100;
  const start = `M${r(points[0].x)},${r(points[0].y)}`;
  if (n === 1) {
    return start;
  }
  if (n === 2) {
    return `${start} L${r(points[1].x)},${r(points[1].y)}`;
  }

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    dx[i] = points[i + 1].x - points[i].x;
    slope[i] = dx[i] === 0 ? 0 : (points[i + 1].y - points[i].y) / dx[i];
  }

  const tangent: number[] = new Array<number>(n);
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i += 1) {
    if (slope[i - 1] * slope[i] <= 0) {
      // a turning point: a flat tangent is what keeps the curve from overshooting
      tangent[i] = 0;
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      tangent[i] = (w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]);
    }
  }

  let d = start;
  for (let i = 0; i < n - 1; i += 1) {
    const third = dx[i] / 3;
    d +=
      ` C${r(points[i].x + third)},${r(points[i].y + tangent[i] * third)}` +
      ` ${r(points[i + 1].x - third)},${r(points[i + 1].y - tangent[i + 1] * third)}` +
      ` ${r(points[i + 1].x)},${r(points[i + 1].y)}`;
  }
  return d;
}

function formatTick(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 100) / 10}k`;
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatValue(value: number): string {
  return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1);
}

/**
 * Tracks the element's real pixel width so the SVG viewBox can match it 1:1.
 * Scaling a fixed viewBox to fit (`preserveAspectRatio="none"`) squashes every
 * glyph, turns marker circles into ellipses and makes one stroke read at two
 * different weights depending on its slope.
 */
function useMeasuredWidth(ref: React.RefObject<HTMLDivElement | null>): number {
  const [width, setWidth] = useState(FALLBACK_WIDTH);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const measure = () => setWidth(Math.max(1, Math.round(node.getBoundingClientRect().width)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return width;
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const width = useMeasuredWidth(wrapRef);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const length = Math.max(0, ...series.map((line) => line.points.length));

  const rawMax = Math.max(
    1,
    maxValue ?? Math.max(0, ...series.flatMap((line) => line.points.map((point) => point.value))),
  );
  const { top, step: tickStep } = niceScale(rawMax);
  const tickCount = Math.round(top / tickStep);

  const plotWidth = Math.max(1, width - PADDING_X - PADDING_RIGHT);
  const plotHeight = Math.max(1, height - PADDING_TOP - PADDING_BOTTOM);
  const xOf = useCallback(
    (index: number) =>
      PADDING_X + (length <= 1 ? plotWidth / 2 : (index / (length - 1)) * plotWidth),
    [length, plotWidth],
  );
  const yOf = useCallback(
    (value: number) => PADDING_TOP + plotHeight - (value / top) * plotHeight,
    [plotHeight, top],
  );

  const labels = useMemo(() => {
    const source = series.find((line) => line.points.length === length) ?? series[0];
    return source ? source.points.map((point) => point.label) : [];
  }, [series, length]);

  /** Screen-reader summary: without it `role="img"` announces nothing useful. */
  const summary = useMemo(
    () =>
      series
        .filter((line) => line.points.length > 0)
        .map((line) => {
          const values = line.points.map((point) => point.value);
          const last = values[values.length - 1];
          return `${line.name}: ${formatValue(last)}${suffix} latest, range ${formatValue(
            Math.min(...values),
          )}${suffix}–${formatValue(Math.max(...values))}${suffix}`;
        })
        .join('. '),
    [series, suffix],
  );

  const pickIndex = useCallback(
    (clientX: number) => {
      const node = wrapRef.current;
      if (!node || length === 0) {
        return null;
      }
      const local = clientX - node.getBoundingClientRect().left;
      const ratio = length <= 1 ? 0 : (local - PADDING_X) / plotWidth;
      return Math.min(length - 1, Math.max(0, Math.round(ratio * (length - 1))));
    },
    [length, plotWidth],
  );

  const moveActive = useCallback(
    (delta: number) =>
      setActiveIndex((current) =>
        Math.min(length - 1, Math.max(0, (current ?? (delta > 0 ? -1 : length)) + delta)),
      ),
    [length],
  );

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

  const baseline = yOf(0);
  const labelStride = Math.max(1, Math.ceil(length / 7));
  const activeX = activeIndex === null ? 0 : xOf(activeIndex);
  // flip the tooltip to the left once the point is past the midpoint
  const tooltipRight = activeX > PADDING_X + plotWidth / 2;

  return (
    <div
      ref={wrapRef}
      className="relative w-full outline-none"
      tabIndex={0}
      onPointerMove={(event) => setActiveIndex(pickIndex(event.clientX))}
      onPointerLeave={() => setActiveIndex(null)}
      onFocus={() => setActiveIndex((current) => current ?? length - 1)}
      onBlur={() => setActiveIndex(null)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          moveActive(1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          moveActive(-1);
        } else if (event.key === 'Escape') {
          setActiveIndex(null);
        }
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={summary}
        className="block"
      >
        <defs>
          {series.map((line, index) => (
            <linearGradient key={line.name} id={`${uid}-area-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={line.color} stopOpacity={0.16} />
              <stop offset="100%" stopColor={line.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        {/* grid: solid hairlines one step off the surface — dashes read as
            thresholds and add noise the data has to compete with */}
        {Array.from({ length: tickCount + 1 }, (_, index) => {
          const value = tickStep * index;
          const y = yOf(value);
          return (
            <g key={index}>
              <line
                x1={PADDING_X}
                y1={y}
                x2={width - PADDING_RIGHT}
                y2={y}
                stroke={index === 0 ? 'var(--color-border-strong)' : 'var(--color-border)'}
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
              <text
                x={PADDING_X - 10}
                y={y + 3.5}
                textAnchor="end"
                className="fill-faint"
                style={{ fontSize: 10, fontVariantNumeric: 'tabular-nums' }}
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
              style={{ fontSize: 10, fontVariantNumeric: 'tabular-nums' }}
            >
              {label}
            </text>
          ) : null,
        )}

        {activeIndex !== null ? (
          <line
            x1={activeX}
            y1={PADDING_TOP}
            x2={activeX}
            y2={baseline}
            stroke="var(--color-border-strong)"
            strokeWidth={1}
            shapeRendering="crispEdges"
          />
        ) : null}

        {series.map((line, seriesIndex) => {
          if (line.points.length === 0) {
            return null;
          }
          const coords = line.points.map((point, index) => ({
            x: xOf(index),
            y: yOf(point.value),
          }));
          const path = buildLinePath(coords);
          const area = `${path} L${coords[coords.length - 1].x},${baseline} L${coords[0].x},${baseline} Z`;
          const lineDelay = seriesIndex * 180;
          const end = coords[coords.length - 1];
          return (
            <g key={line.name}>
              {/* the wash is for a lone series only — stacked translucent fills
                  tint each other and the lower line has to fight through them */}
              {series.length === 1 ? (
                <path
                  d={area}
                  fill={`url(#${uid}-area-${seriesIndex})`}
                  opacity={shown ? 1 : 0}
                  style={{
                    transition: 'opacity 700ms ease',
                    transitionDelay: `${lineDelay + 250}ms`,
                  }}
                />
              ) : null}
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
              {/* only the endpoint is marked: a dot on every sample turns a
                  30-day trend into bead soup — hover surfaces the rest */}
              <circle
                cx={end.x}
                cy={end.y}
                r={4}
                fill={line.color}
                stroke="var(--color-surface)"
                strokeWidth={2}
                opacity={shown ? 1 : 0}
                style={{
                  transition: 'opacity 260ms ease',
                  transitionDelay: `${lineDelay + 900}ms`,
                }}
              />
              {activeIndex !== null && activeIndex < line.points.length ? (
                <circle
                  cx={xOf(activeIndex)}
                  cy={yOf(line.points[activeIndex].value)}
                  r={4}
                  fill={line.color}
                  stroke="var(--color-surface)"
                  strokeWidth={2}
                />
              ) : null}
            </g>
          );
        })}
      </svg>

      {activeIndex !== null ? (
        <div
          aria-live="polite"
          className="pointer-events-none absolute z-10 min-w-[7rem] rounded-lg border border-border bg-surface px-2.5 py-2 shadow-lg"
          style={{
            top: PADDING_TOP,
            left: tooltipRight ? undefined : activeX + 12,
            right: tooltipRight ? width - activeX + 12 : undefined,
          }}
        >
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-faint">
            {labels[activeIndex]}
          </p>
          {series.map((line) =>
            activeIndex < line.points.length ? (
              <p key={line.name} className="flex items-center gap-1.5 text-xs text-fg">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: line.color }}
                />
                <span className="min-w-0 truncate text-muted">{line.name}</span>
                <span className="ml-auto font-medium tabular-nums">
                  {formatValue(line.points[activeIndex].value)}
                  {suffix}
                </span>
              </p>
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  );
}
