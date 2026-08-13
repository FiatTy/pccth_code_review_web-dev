import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useSecurityDashboardTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-security-header',
      popover: {
        title: t('TOUR.SECURITYDASHBOARD.HEADER_TITLE', 'SecurityDashboard Overview'),
        description: t('TOUR.SECURITYDASHBOARD.HEADER_DESC', 'This page allows you to view and manage securitydashboard.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('securitydashboard', steps);
}
