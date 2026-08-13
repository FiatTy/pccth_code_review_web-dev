import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useSonarQubeConfigTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-sonar-header',
      popover: {
        title: t('TOUR.SONARQUBECONFIG.HEADER_TITLE', 'SonarQubeConfig Overview'),
        description: t('TOUR.SONARQUBECONFIG.HEADER_DESC', 'This page allows you to view and manage sonarqubeconfig.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('sonarqubeconfig', steps);
}
