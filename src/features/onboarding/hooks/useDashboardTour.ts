import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createTour } from '../lib/driver';
import type { DriveStep } from 'driver.js';

const HAS_SEEN_DASHBOARD_TOUR_KEY = 'has_seen_dashboard_tour';

export function useDashboardTour() {
  const { t } = useTranslation();

  const startTour = useCallback(() => {
    const steps: DriveStep[] = [
      {
        element: '#tour-dashboard-greeting',
        popover: {
          title: t('TOUR.DASHBOARD.WELCOME_TITLE', 'Welcome to Dashboard!'),
          description: t(
            'TOUR.DASHBOARD.WELCOME_DESC',
            'This is your main dashboard. Let us show you around.'
          ),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-stat-cards',
        popover: {
          title: t('TOUR.DASHBOARD.STATS_TITLE', 'Overview Statistics'),
          description: t(
            'TOUR.DASHBOARD.STATS_DESC',
            'Here you can see the overall metrics of your code repositories and scans.'
          ),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-sidebar',
        popover: {
          title: t('TOUR.DASHBOARD.SIDEBAR_TITLE', 'Main Navigation'),
          description: t(
            'TOUR.DASHBOARD.SIDEBAR_DESC',
            'Use the sidebar to navigate through repositories, issues, analysis, and settings.'
          ),
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#tour-global-search',
        popover: {
          title: t('TOUR.DASHBOARD.SEARCH_TITLE', 'Global Search'),
          description: t(
            'TOUR.DASHBOARD.SEARCH_DESC',
            'Quickly find what you need by searching across your entire workspace.'
          ),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-profile-menu',
        popover: {
          title: t('TOUR.DASHBOARD.PROFILE_TITLE', 'Profile & Settings'),
          description: t(
            'TOUR.DASHBOARD.PROFILE_DESC',
            'Manage your account settings, language, and theme preferences here.'
          ),
          side: 'bottom',
          align: 'end',
        },
      },
    ];

    const driverObj = createTour(steps, () => {
      localStorage.setItem(HAS_SEEN_DASHBOARD_TOUR_KEY, 'true');
    });

    driverObj.drive();
  }, [t]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(HAS_SEEN_DASHBOARD_TOUR_KEY);
    if (!hasSeenTour) {
      // Delay slightly to ensure elements are rendered
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  return { startTour };
}
