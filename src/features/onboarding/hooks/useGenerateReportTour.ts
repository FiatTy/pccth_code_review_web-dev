import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useGenerateReportTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => {
    const isDesktop = window.innerWidth >= 1024;
    return [
      {
        element: '#tour-genreport-project',
        popover: {
          title: t('TOUR.GENERATEREPORT.PROJECT_TITLE', 'Select a Project'),
          description: t('TOUR.GENERATEREPORT.PROJECT_DESC', 'Start by selecting the project you want to generate a report for.'),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-genreport-date',
        popover: {
          title: t('TOUR.GENERATEREPORT.DATE_TITLE', 'Choose Date Range'),
          description: t('TOUR.GENERATEREPORT.DATE_DESC', 'Select the date range to include code scans completed within this period.'),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-genreport-sections',
        popover: {
          title: t('TOUR.GENERATEREPORT.SECTIONS_TITLE', 'Include Sections'),
          description: t('TOUR.GENERATEREPORT.SECTIONS_DESC', 'Customize your report by toggling the sections you want to include in the final PDF.'),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-genreport-generate-btn',
        popover: {
          title: t('TOUR.GENERATEREPORT.GENERATE_TITLE', 'Generate Report'),
          description: t('TOUR.GENERATEREPORT.GENERATE_DESC', 'When you are ready, click this button to generate and download your PDF report.'),
          side: isDesktop ? 'left' : 'bottom',
          align: 'start',
        },
      }
    ];
  }, [t]);

  return usePageTour('generatereport', steps);
}

