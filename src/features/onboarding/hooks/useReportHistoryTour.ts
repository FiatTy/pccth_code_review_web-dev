import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useReportHistoryTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-reporthistory-header',
      popover: {
        title: t('TOUR.REPORTHISTORY.HEADER_TITLE', 'ReportHistory Overview'),
        description: t('TOUR.REPORTHISTORY.HEADER_DESC', 'This page allows you to view and manage reporthistory.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('reporthistory', steps);
}
