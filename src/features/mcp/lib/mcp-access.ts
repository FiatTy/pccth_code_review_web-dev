const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 30],
  ['month', 12],
  ['year', Number.POSITIVE_INFINITY],
];

export function isTokenLive(
  expiresAt: string | null | undefined,
  now: number = Date.now(),
): boolean {
  if (!expiresAt) {
    return false;
  }
  const expiry = Date.parse(expiresAt);
  return Number.isFinite(expiry) && expiry > now;
}

export function timeAgo(
  iso: string | null | undefined,
  locale: string,
  now: number = Date.now(),
): string | null {
  if (!iso) {
    return null;
  }
  const at = Date.parse(iso);
  if (!Number.isFinite(at)) {
    return null;
  }

  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  let value = Math.round((at - now) / 1000);

  for (const [unit, step] of STEPS) {
    if (Math.abs(value) < step) {
      return format.format(value, unit);
    }
    value = Math.round(value / step);
  }
  return null;
}
