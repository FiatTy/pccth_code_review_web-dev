import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useAnalysisTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-analysis-header',
      popover: {
        title: t('TOUR.ANALYSIS.HEADER_TITLE', 'Analysis Overview'),
        description: t('TOUR.ANALYSIS.HEADER_DESC', 'This page allows you to view and manage analysis.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('analysis', steps);
}
