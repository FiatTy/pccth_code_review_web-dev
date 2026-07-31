import { useEffect, useState } from 'react';

/**
 * Returns false on first paint, then flips to true on the next frame so charts
 * can transition from a hidden/collapsed state into their final shape when the
 * page (and chart) first mounts. Honors `prefers-reduced-motion` by starting
 * already-shown, so no motion plays.
 */
export function useChartReveal(): boolean {
  const [shown, setShown] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (shown) {
      return;
    }
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [shown]);

  return shown;
}
