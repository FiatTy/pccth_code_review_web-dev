import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useTechnicalDebtTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-techdebt-header',
      popover: {
        title: t('TOUR.TECHNICALDEBT.HEADER_TITLE', 'TechnicalDebt Overview'),
        description: t('TOUR.TECHNICALDEBT.HEADER_DESC', 'This page allows you to view and manage technicaldebt.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('technicaldebt', steps);
}
