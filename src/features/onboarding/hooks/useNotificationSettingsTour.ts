import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useNotificationSettingsTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-notification-header',
      popover: {
        title: t('TOUR.NOTIFICATIONSETTINGS.HEADER_TITLE', 'NotificationSettings Overview'),
        description: t('TOUR.NOTIFICATIONSETTINGS.HEADER_DESC', 'This page allows you to view and manage notificationsettings.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('notificationsettings', steps);
}
