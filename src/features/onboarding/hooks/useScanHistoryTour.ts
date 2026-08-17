import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useScanHistoryTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => {
    const isDesktop = window.innerWidth >= 768;
    return [
      {
        element: '#tour-scan-filters',
        popover: {
          title: t('TOUR.SCANHISTORY.FILTERS_TITLE', 'Filter Scans'),
          description: t('TOUR.SCANHISTORY.FILTERS_DESC', 'Use these filters to find specific scans by project, status, or date range.'),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: isDesktop ? '#tour-scan-checkbox' : '#tour-scan-checkbox-mobile',
        popover: {
          title: t('TOUR.SCANHISTORY.CHECKBOXES_TITLE', 'Select for Comparison'),
          description: t('TOUR.SCANHISTORY.CHECKBOXES_DESC', 'You can select 2 or 3 scans to compare their metrics side by side.'),
          side: isDesktop ? 'left' : 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-scan-compare-btn',
        popover: {
          title: t('TOUR.SCANHISTORY.COMPARE_BTN_TITLE', 'Compare Scans'),
          description: t('TOUR.SCANHISTORY.COMPARE_BTN_DESC', 'Once you have selected the scans, click this button to open the comparison view.'),
          side: 'top',
          align: 'start',
        },
      },
      {
        element: isDesktop ? '#tour-scan-result-btn' : '#tour-scan-result-btn-mobile',
        popover: {
          title: t('TOUR.SCANHISTORY.RESULT_BTN_TITLE', 'View Scan Results'),
          description: t('TOUR.SCANHISTORY.RESULT_BTN_DESC', 'Click here to dive into the detailed report, vulnerabilities, and code smells for this specific scan.'),
          side: isDesktop ? 'left' : 'bottom',
          align: 'start',
        },
      }
    ];
  }, [t]);

  return usePageTour('scanhistory', steps);
}

