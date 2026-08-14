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
        description: t('TOUR.REPOSITORIES.HEADER_DESC', 'This page allows you to view and manage all your connected projects.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-repo-new-btn',
      popover: {
        title: t('TOUR.REPOSITORIES.NEW_BTN_TITLE', 'New Repository'),
        description: t('TOUR.REPOSITORIES.NEW_BTN_DESC', 'Click here to add a new repository to your workspace.'),
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '#tour-repo-stats',
      popover: {
        title: t('TOUR.REPOSITORIES.STATS_TITLE', 'Repository Statistics'),
        description: t('TOUR.REPOSITORIES.STATS_DESC', 'Quick overview of your repository statuses—see what\'s active, scanning, or facing issues.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-repo-filters',
      popover: {
        title: t('TOUR.REPOSITORIES.FILTERS_TITLE', 'Filters & View Modes'),
        description: t('TOUR.REPOSITORIES.FILTERS_DESC', 'Use these filters to quickly find specific repositories by project type, folder, or status.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-repo-list',
      popover: {
        title: t('TOUR.REPOSITORIES.LIST_TITLE', 'Repository List'),
        description: t('TOUR.REPOSITORIES.LIST_DESC', 'Here is your repository list. From here, you can manually trigger code scans or manage settings.'),
        side: 'top',
        align: 'center',
      },
    }
  ], [t]);

  return usePageTour('repositories', steps);
}
