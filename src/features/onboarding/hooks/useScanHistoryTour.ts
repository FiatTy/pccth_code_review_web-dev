import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useScanHistoryTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-scan-header',
      popover: {
        title: t('TOUR.SCANHISTORY.HEADER_TITLE', 'ScanHistory Overview'),
        description: t('TOUR.SCANHISTORY.HEADER_DESC', 'This page allows you to view and manage scanhistory.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('scanhistory', steps);
}
