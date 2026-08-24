import { useEffect, useCallback, useRef } from 'react';
import { createTour } from '../lib/driver';
import { isTourCompleted, markTourAsCompleted } from '../lib/tourStorage';
import type { DriveStep } from 'driver.js';

export function usePageTour(
  tourKey: string,
  steps: DriveStep[],
  onComplete?: (element?: Element, step?: DriveStep, options?: { state: any }) => void
) {
  const driverRef = useRef<any>(null);

  const startTour = useCallback(() => {
    if (steps.length === 0) return;
    
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    const resumeIndexStr = localStorage.getItem(`resume_tour_${tourKey}`);
    const startIndex = resumeIndexStr ? parseInt(resumeIndexStr, 10) : 0;
    if (resumeIndexStr) {
      localStorage.removeItem(`resume_tour_${tourKey}`);
    }

    const driverObj = createTour(steps, (element, step, options) => {
      markTourAsCompleted(tourKey);
      if (onComplete) {
        onComplete(element, step, options);
      }
    });
    driverRef.current = driverObj;
    (window as any).currentTourDriver = driverObj;

    if (startIndex > 0 && startIndex < steps.length) {
      driverObj.drive(startIndex);
    } else {
      driverObj.drive();
    }
  }, [onComplete, steps, tourKey]);

  useEffect(() => {
    const hasSeenTour = isTourCompleted(tourKey);
    const hasResumeState = localStorage.getItem(`resume_tour_${tourKey}`);
    
    if ((!hasSeenTour || hasResumeState) && steps.length > 0) {
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => {
        clearTimeout(timer);
        if (driverRef.current) {
          driverRef.current.destroy();
        }
      };
    }
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [startTour, steps.length, tourKey]);

  return { startTour };
}
