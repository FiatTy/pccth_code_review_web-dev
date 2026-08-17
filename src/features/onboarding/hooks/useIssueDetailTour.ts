import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useIssueDetailTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => {
    const isDesktop = window.innerWidth >= 1024;
    return [
      {
        element: '#tour-issuedetail-header',
        popover: {
          title: t('TOUR.ISSUEDETAIL.HEADER_TITLE', 'Issue Overview'),
          description: t('TOUR.ISSUEDETAIL.HEADER_DESC', 'Here you can see the issue title, type, severity, and status at a glance.'),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-issuedetail-analysis',
        popover: {
          title: t('TOUR.ISSUEDETAIL.ANALYSIS_TITLE', 'Analysis & Vulnerable Code'),
          description: t('TOUR.ISSUEDETAIL.ANALYSIS_DESC', 'This section provides a detailed description of the issue, highlights the vulnerable code, and offers AI-generated fixes or recommendations.'),
          side: isDesktop ? 'right' : 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-issuedetail-comments',
        popover: {
          title: t('TOUR.ISSUEDETAIL.COMMENTS_TITLE', 'Discussion'),
          description: t('TOUR.ISSUEDETAIL.COMMENTS_DESC', 'You can leave comments, ask questions, or discuss this issue with your team members here.'),
          side: isDesktop ? 'right' : 'top',
          align: 'start',
        },
      },
      {
        element: '#tour-issuedetail-assignment',
        popover: {
          title: t('TOUR.ISSUEDETAIL.ASSIGNMENT_TITLE', 'Assignee'),
          description: t('TOUR.ISSUEDETAIL.ASSIGNMENT_DESC', 'See who is currently responsible for this issue, or assign it to a team member to start working on a fix.'),
          side: isDesktop ? 'left' : 'top',
          align: 'start',
        },
      },
      {
        element: '#tour-issuedetail-status',
        popover: {
          title: t('TOUR.ISSUEDETAIL.STATUS_TITLE', 'Status & Priority'),
          description: t('TOUR.ISSUEDETAIL.STATUS_DESC', 'Check the current status and priority level of the issue. You can manually update the status here if needed.'),
          side: isDesktop ? 'left' : 'top',
          align: 'start',
        },
      }
    ];
  }, [t]);

  return usePageTour('issuedetail', steps);
}
