export interface TourState {
  completedTours: string[]; // e.g. ['dashboard', 'repositories', 'issues', 'scanhistory']
  hasCompletedMainTour: boolean;
  version: number;
}

export const TOUR_STORAGE_KEY = 'app_tour_state';
export const CURRENT_TOUR_VERSION = 1;

export const DEFAULT_TOUR_STATE: TourState = {
  completedTours: [],
  hasCompletedMainTour: false,
  version: CURRENT_TOUR_VERSION,
};

export function getTourState(): TourState {
  try {
    const raw = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TOUR_STATE };
    const parsed = JSON.parse(raw);
    return {
      completedTours: Array.isArray(parsed.completedTours) ? parsed.completedTours : [],
      hasCompletedMainTour: Boolean(parsed.hasCompletedMainTour),
      version: typeof parsed.version === 'number' ? parsed.version : CURRENT_TOUR_VERSION,
    };
  } catch (e) {
    console.error('Failed to parse tour state from localStorage:', e);
    return { ...DEFAULT_TOUR_STATE };
  }
}

export function saveTourState(state: TourState): void {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save tour state to localStorage:', e);
  }
}

export function isTourCompleted(tourId: string): boolean {
  const state = getTourState();
  return state.completedTours.includes(tourId);
}

export function markTourAsCompleted(tourId: string): void {
  const state = getTourState();
  if (!state.completedTours.includes(tourId)) {
    state.completedTours.push(tourId);
  }
  if (tourId === 'dashboard') {
    state.hasCompletedMainTour = true;
  }
  saveTourState(state);
}

export function resetAllTours(): void {
  saveTourState({
    completedTours: [],
    hasCompletedMainTour: false,
    version: CURRENT_TOUR_VERSION,
  });
}

export function migrateLegacyTourKeys(): void {
  try {
    const state = getTourState();
    let mutated = false;
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('has_seen_') && key.endsWith('_tour')) {
        const tourId = key.replace(/^has_seen_/, '').replace(/_tour$/, '');
        if (tourId && !state.completedTours.includes(tourId)) {
          state.completedTours.push(tourId);
          mutated = true;
        }
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((k) => localStorage.removeItem(k));

    if (mutated) {
      if (state.completedTours.includes('dashboard')) {
        state.hasCompletedMainTour = true;
      }
      saveTourState(state);
    }
  } catch (err) {
    console.error('Failed to migrate legacy tour keys:', err);
  }
}

// Automatically run backward migration on load
migrateLegacyTourKeys();
