import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useIssuesTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-issue-header',
      popover: {
        title: t('TOUR.ISSUES.HEADER_TITLE', 'Issues Overview'),
        description: t('TOUR.ISSUES.HEADER_DESC', 'This page allows you to view and manage issues.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('issues', steps);
}
