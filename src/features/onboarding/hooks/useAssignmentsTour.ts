import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useAssignmentsTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-assignment-header',
      popover: {
        title: t('TOUR.ASSIGNMENTS.HEADER_TITLE', 'Assignments Overview'),
        description: t('TOUR.ASSIGNMENTS.HEADER_DESC', 'This page allows you to view and manage assignments.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('assignments', steps);
}
