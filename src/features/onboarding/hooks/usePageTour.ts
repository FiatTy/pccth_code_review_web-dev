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

    // Ensure page/element is scrolled into view immediately even if user scrolled beforehand
    const targetElementSelector = steps[startIndex]?.element || steps[0]?.element;
    if (typeof targetElementSelector === 'string') {
      const targetEl = document.querySelector(targetElementSelector);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

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
      }, 300);
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
