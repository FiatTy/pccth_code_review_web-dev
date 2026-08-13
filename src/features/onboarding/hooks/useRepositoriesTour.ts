import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useRepositoriesTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-repo-header',
      popover: {
        title: t('TOUR.REPOSITORIES.HEADER_TITLE', 'Repositories Overview'),
        description: t('TOUR.REPOSITORIES.HEADER_DESC', 'This page allows you to view and manage repositories.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('repositories', steps);
}
