import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useUserManagementTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-user-header',
      popover: {
        title: t('TOUR.USERMANAGEMENT.HEADER_TITLE', 'UserManagement Overview'),
        description: t('TOUR.USERMANAGEMENT.HEADER_DESC', 'This page allows you to view and manage usermanagement.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('usermanagement', steps);
}
