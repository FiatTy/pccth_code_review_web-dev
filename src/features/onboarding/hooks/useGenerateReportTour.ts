import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useGenerateReportTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-genreport-header',
      popover: {
        title: t('TOUR.GENERATEREPORT.HEADER_TITLE', 'GenerateReport Overview'),
        description: t('TOUR.GENERATEREPORT.HEADER_DESC', 'This page allows you to view and manage generatereport.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('generatereport', steps);
}
