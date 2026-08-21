import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useRepositoriesTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-repo-new-btn',
      popover: {
        title: t('TOUR.REPOSITORIES.NEW_BTN_TITLE', 'New Repository'),
        description: t('TOUR.REPOSITORIES.NEW_BTN_DESC', 'Click this button to add a new repository. The tour will continue when you return to this page.'),
        side: 'bottom',
        align: 'end',
        showButtons: ['previous', 'close'],
      },
      disableActiveInteraction: false,
      onHighlighted: () => {
        const btn = document.querySelector<HTMLButtonElement>('#tour-repo-new-btn');
        if (btn) {
          const handleClick = () => {
            localStorage.setItem('resume_tour_repositories', '1');
            btn.removeEventListener('click', handleClick);
          };
          btn.addEventListener('click', handleClick);
        }
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
      element: '.tour-repo-card',
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
