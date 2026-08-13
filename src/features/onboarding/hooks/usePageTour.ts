import { useEffect, useCallback } from 'react';
import { createTour } from '../lib/driver';
import type { DriveStep } from 'driver.js';

export function usePageTour(tourKey: string, steps: DriveStep[]) {
  const startTour = useCallback(() => {
    if (steps.length === 0) return;
    const driverObj = createTour(steps, () => {
      localStorage.setItem(`has_seen_${tourKey}_tour`, 'true');
    });
    driverObj.drive();
  }, [steps, tourKey]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`has_seen_${tourKey}_tour`);
    if (!hasSeenTour && steps.length > 0) {
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startTour, steps.length, tourKey]);

  return { startTour };
}
