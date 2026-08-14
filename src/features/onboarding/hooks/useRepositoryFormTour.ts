import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useRepositoryFormTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-repo-form-details',
      popover: {
        title: t('TOUR.REPOSITORY_FORM.DETAILS_TITLE', 'Repository Details'),
        description: t('TOUR.REPOSITORY_FORM.DETAILS_DESC', 'Provide your repository URL and setup the project information.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-repo-form-analysis',
      popover: {
        title: t('TOUR.REPOSITORY_FORM.ANALYSIS_TITLE', 'Analysis Config'),
        description: t('TOUR.REPOSITORY_FORM.ANALYSIS_DESC', 'Configure SonarQube settings like Project Key to enable code scanning.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-repo-form-summary',
      popover: {
        title: t('TOUR.REPOSITORY_FORM.SUMMARY_TITLE', 'Configuration Summary'),
        description: t('TOUR.REPOSITORY_FORM.SUMMARY_DESC', 'Review your settings before saving.'),
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#tour-repo-form-save',
      popover: {
        title: t('TOUR.REPOSITORY_FORM.SAVE_TITLE', 'Save Repository'),
        description: t('TOUR.REPOSITORY_FORM.SAVE_DESC', 'Click here to save and add this repository to your workspace.'),
        side: 'bottom',
        align: 'center',
      },
    }
  ], [t]);

  return usePageTour('repository-form', steps);
}
