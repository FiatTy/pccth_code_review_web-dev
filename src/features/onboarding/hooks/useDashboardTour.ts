import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createTour } from '../lib/driver';
import { isTourCompleted, markTourAsCompleted } from '../lib/tourStorage';
import type { DriveStep } from 'driver.js';

export function useDashboardTour() {
  const { t } = useTranslation();

  const startTour = useCallback(() => {
    const isDesktop = window.innerWidth >= 1024;
    let driverObj: any;

    const commonStepsStart: DriveStep[] = [
      {
        element: '#tour-dashboard-greeting',
        popover: {
          title: t('TOUR.DASHBOARD.WELCOME_TITLE', 'Welcome to Dashboard!'),
          description: t('TOUR.DASHBOARD.WELCOME_DESC', 'This is your main dashboard. Let us show you around.'),
          side: 'bottom', align: 'start',
        },
      },
      {
        element: '#tour-stat-cards',
        popover: {
          title: t('TOUR.DASHBOARD.STATS_TITLE', 'Overview Statistics'),
          description: t('TOUR.DASHBOARD.STATS_DESC', 'Here you can see the overall metrics of your code repositories and scans.'),
          side: 'bottom', align: 'start',
        },
      },
      {
        element: '#tour-recent-activity',
        popover: {
          title: t('TOUR.DASHBOARD.RECENT_ACTIVITY_TITLE', 'Recent Activity'),
          description: t('TOUR.DASHBOARD.RECENT_ACTIVITY_DESC', 'Keep track of your latest code scans and project activities right here.'),
          side: 'bottom', align: 'start',
        },
      },
    ];

    const desktopSteps: DriveStep[] = [
      ...commonStepsStart,
      {
        element: '#tour-sidebar',
        popover: {
          title: t('TOUR.DASHBOARD.SIDEBAR_TITLE', 'Main Navigation'),
          description: t('TOUR.DASHBOARD.SIDEBAR_DESC', 'Use the sidebar to navigate through repositories, issues, analysis, and settings.'),
          side: 'right', align: 'start',
        },
      },
      {
        element: '#tour-global-search',
        popover: {
          title: t('TOUR.DASHBOARD.SEARCH_TITLE', 'Global Search'),
          description: t('TOUR.DASHBOARD.SEARCH_DESC', 'Quickly find what you need by searching across your entire workspace.'),
          side: 'bottom', align: 'start',
        },
      },
      {
        element: '#tour-notification-bell',
        popover: {
          title: t('TOUR.DASHBOARD.NOTI_TITLE', 'Notifications'),
          description: t('TOUR.DASHBOARD.NOTI_DESC', 'Click on the bell icon to see your latest updates and alerts.'),
          side: 'bottom', align: 'end',
          showButtons: ['previous', 'close'],
        },
        disableActiveInteraction: false,
        onHighlighted: () => {
          const btn = document.querySelector<HTMLButtonElement>('#tour-notification-bell button');
          if (btn) {
            const handleClick = () => {
              btn.removeEventListener('click', handleClick);
              setTimeout(() => { if (driverObj) driverObj.moveNext(); }, 50);
            };
            btn.addEventListener('click', handleClick);
          }
        },
      },
      {
        element: '#tour-notification-dropdown',
        popover: {
          title: t('TOUR.DASHBOARD.NOTI_OPTIONS_TITLE', 'Your Updates'),
          description: t('TOUR.DASHBOARD.NOTI_OPTIONS_DESC', 'Here you can filter notifications by type or mark them as read.'),
          side: 'left', align: 'start',
        },
      },
      {
        element: '#tour-profile-menu-desktop',
        popover: {
          title: t('TOUR.DASHBOARD.PROFILE_TITLE', 'Profile & Settings'),
          description: t('TOUR.DASHBOARD.PROFILE_DESC', 'Click on your profile here to manage your account settings.'),
          side: 'bottom', align: 'end',
          showButtons: ['previous', 'close'],
        },
        disableActiveInteraction: false,
        onHighlighted: () => {
          const btn = document.querySelector<HTMLButtonElement>('#tour-profile-menu-desktop button');
          if (btn) {
            const handleClick = () => {
              btn.removeEventListener('click', handleClick);
              setTimeout(() => { if (driverObj) driverObj.moveNext(); }, 50);
            };
            btn.addEventListener('click', handleClick);
          }
        },
      },
      {
        element: '#tour-profile-dropdown',
        popover: {
          title: t('TOUR.DASHBOARD.PROFILE_OPTIONS_TITLE', 'Account Options'),
          description: t('TOUR.DASHBOARD.PROFILE_OPTIONS_DESC', 'Here you can change your password, verify your email, and safely log out.'),
          side: 'left', align: 'start',
        },
      },
    ];

    const mobileSteps: DriveStep[] = [
      ...commonStepsStart,
      {
        element: '#tour-hamburger-menu',
        popover: {
          title: t('TOUR.DASHBOARD.HAMBURGER_TITLE', 'Main Menu'),
          description: t('TOUR.DASHBOARD.HAMBURGER_DESC', 'Click here to open the main navigation menu.'),
          side: 'bottom', align: 'start',
          showButtons: ['previous', 'close'],
        },
        disableActiveInteraction: false,
        onHighlighted: () => {
          const btn = document.querySelector<HTMLButtonElement>('#tour-hamburger-menu');
          if (btn) {
            const handleClick = () => {
              btn.removeEventListener('click', handleClick);
              setTimeout(() => { if (driverObj) driverObj.moveNext(); }, 350); // wait for animation
            };
            btn.addEventListener('click', handleClick);
          }
        },
      },
      {
        element: '#tour-sidebar',
        popover: {
          title: t('TOUR.DASHBOARD.SIDEBAR_TITLE', 'Main Navigation'),
          description: t('TOUR.DASHBOARD.SIDEBAR_DESC', 'Use the sidebar to navigate through repositories, issues, analysis, and settings.'),
          side: 'right', align: 'start',
        },
      },
      {
        element: '#tour-profile-menu-mobile',
        popover: {
          title: t('TOUR.DASHBOARD.PROFILE_TITLE', 'Profile & Settings'),
          description: t('TOUR.DASHBOARD.PROFILE_DESC', 'Click on your profile here to manage your account settings.'),
          side: 'top', align: 'start',
          showButtons: ['previous', 'close'],
        },
        disableActiveInteraction: false,
        onHighlighted: () => {
          const btn = document.querySelector<HTMLButtonElement>('#tour-profile-menu-mobile button');
          if (btn) {
            const handleClick = () => {
              btn.removeEventListener('click', handleClick);
              setTimeout(() => { if (driverObj) driverObj.moveNext(); }, 50);
            };
            btn.addEventListener('click', handleClick);
          }
        },
      },
      {
        element: '#tour-profile-dropdown',
        popover: {
          title: t('TOUR.DASHBOARD.PROFILE_OPTIONS_TITLE', 'Account Options'),
          description: t('TOUR.DASHBOARD.PROFILE_OPTIONS_DESC', 'Here you can change your password, verify your email, and safely log out.'),
          side: 'top', align: 'start',
        },
        onDeselected: () => {
          // Close the sidebar when leaving the profile dropdown step
          const closeBtn = document.querySelector<HTMLButtonElement>('.fixed.inset-0.z-30.bg-black\\/50');
          if (closeBtn) closeBtn.click();
        }
      },
      {
        element: '#tour-global-search',
        popover: {
          title: t('TOUR.DASHBOARD.SEARCH_TITLE', 'Global Search'),
          description: t('TOUR.DASHBOARD.SEARCH_DESC', 'Quickly find what you need by searching across your entire workspace.'),
          side: 'bottom', align: 'start',
        },
      },
      {
        element: '#tour-notification-bell',
        popover: {
          title: t('TOUR.DASHBOARD.NOTI_TITLE', 'Notifications'),
          description: t('TOUR.DASHBOARD.NOTI_DESC', 'Click on the bell icon to see your latest updates and alerts.'),
          side: 'bottom', align: 'end',
          showButtons: ['previous', 'close'],
        },
        disableActiveInteraction: false,
        onHighlighted: () => {
          const btn = document.querySelector<HTMLButtonElement>('#tour-notification-bell button');
          if (btn) {
            const handleClick = () => {
              btn.removeEventListener('click', handleClick);
              setTimeout(() => { if (driverObj) driverObj.moveNext(); }, 50);
            };
            btn.addEventListener('click', handleClick);
          }
        },
      },
      {
        element: '#tour-notification-dropdown',
        popover: {
          title: t('TOUR.DASHBOARD.NOTI_OPTIONS_TITLE', 'Your Updates'),
          description: t('TOUR.DASHBOARD.NOTI_OPTIONS_DESC', 'Here you can filter notifications by type or mark them as read.'),
          side: 'left', align: 'start',
        },
      },
    ];

    const steps = isDesktop ? desktopSteps : mobileSteps;

    driverObj = createTour(steps, () => {
      markTourAsCompleted('dashboard');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    driverObj.drive();
  }, [t]);

  useEffect(() => {
    const hasSeenTour = isTourCompleted('dashboard');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  return { startTour };
}
