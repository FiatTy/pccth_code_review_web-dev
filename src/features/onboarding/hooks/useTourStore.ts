import { useCallback, useState } from 'react';
import {
  getTourState,
  isTourCompleted as checkIsTourCompleted,
  markTourAsCompleted as setTourCompleted,
  resetAllTours as resetTours,
  type TourState,
} from '../lib/tourStorage';

export function useTourStore() {
  const [tourState, setTourState] = useState<TourState>(getTourState);

  const isTourCompleted = useCallback((tourId: string) => {
    return checkIsTourCompleted(tourId);
  }, []);

  const markTourAsCompleted = useCallback((tourId: string) => {
    setTourCompleted(tourId);
    setTourState(getTourState());
  }, []);

  const resetAllTours = useCallback(() => {
    resetTours();
    setTourState(getTourState());
  }, []);

  return {
    tourState,
    isTourCompleted,
    markTourAsCompleted,
    resetAllTours,
  };
}
