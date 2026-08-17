import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useAnalysisTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-analysis-security',
      popover: {
        title: t('TOUR.ANALYSIS.SECURITY_TITLE', 'Security Score'),
        description: t('TOUR.ANALYSIS.SECURITY_DESC', 'Click this card to dive deep into security vulnerabilities, code smells, and hot issues across your projects.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-analysis-debt',
      popover: {
        title: t('TOUR.ANALYSIS.DEBT_TITLE', 'Technical Debt'),
        description: t('TOUR.ANALYSIS.DEBT_DESC', 'Click this card to explore technical debt details, estimated fix times, and potential costs.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('analysis', steps);
}

