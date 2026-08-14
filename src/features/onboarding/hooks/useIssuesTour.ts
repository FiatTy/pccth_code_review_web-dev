import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useIssuesTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => {
    const isDesktop = window.innerWidth >= 768;
    return [
      {
        element: '#tour-issue-filters',
        popover: {
          title: t('TOUR.ISSUES.FILTERS_TITLE', 'Filter Issues'),
          description: t('TOUR.ISSUES.FILTERS_DESC', 'Use these filters to narrow down issues by type, severity, status, or project.'),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: isDesktop ? '#tour-issue-checkboxes' : '#tour-issue-checkboxes-mobile',
        popover: {
          title: t('TOUR.ISSUES.CHECKBOXES_TITLE', 'Select Issues'),
          description: t('TOUR.ISSUES.CHECKBOXES_DESC', 'Select one or more issues to assign them in bulk. Please click the checkbox to continue.'),
          side: isDesktop ? 'right' : 'bottom',
          align: 'start',
          showButtons: ['previous', 'close'],
        },
        onHighlighted: () => {
          const selector = isDesktop ? '#tour-issue-checkboxes input[type="checkbox"]' : '#tour-issue-checkboxes-mobile';
          const checkbox = document.querySelector<HTMLInputElement>(selector);
          if (checkbox) {
            const handleChange = () => {
              checkbox.removeEventListener('change', handleChange);
              setTimeout(() => {
                const driver = (window as any).currentTourDriver;
                if (driver) driver.moveNext();
              }, 300);
            };
            checkbox.addEventListener('change', handleChange);
          }
        },
      },
      {
        element: '#tour-issue-bulk-assign-btn',
        popover: {
          title: t('TOUR.ISSUES.ASSIGN_BTN_TITLE', 'Assign Selected'),
          description: t('TOUR.ISSUES.ASSIGN_BTN_DESC', 'Click this button to assign the selected issues to a team member.'),
          side: 'top',
          align: 'end',
          showButtons: ['previous', 'close'],
        },
        onHighlighted: () => {
          const btn = document.querySelector<HTMLButtonElement>('#tour-issue-bulk-assign-btn');
          if (btn) {
            const handleClick = () => {
              btn.removeEventListener('click', handleClick);
              setTimeout(() => {
                const driver = (window as any).currentTourDriver;
                if (driver) driver.moveNext();
              }, 300); // wait for modal to render
            };
            btn.addEventListener('click', handleClick);
          }
        },
      },
      {
        element: '#tour-issue-bulk-assign-user-select',
        popover: {
          title: t('TOUR.ISSUES.MODAL_USER_TITLE', 'Select a Team Member'),
          description: t('TOUR.ISSUES.MODAL_USER_DESC', 'Choose a user from the dropdown to assign the issues to them.'),
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#tour-issue-bulk-assign-submit',
        popover: {
          title: t('TOUR.ISSUES.MODAL_SUBMIT_TITLE', 'Submit'),
          description: t('TOUR.ISSUES.MODAL_SUBMIT_DESC', 'Click here to save your changes and assign the issues.'),
          side: 'top',
          align: 'end',
        },
        onDeselected: () => {
          const closeBtn = document.querySelector<HTMLButtonElement>('#tour-issue-bulk-assign-close');
          if (closeBtn) closeBtn.click();
        },
      },
      {
        element: isDesktop ? '#tour-issue-view-btn' : '#tour-issue-view-btn-mobile',
        popover: {
          title: t('TOUR.ISSUES.VIEW_BTN_TITLE', 'View Details'),
          description: t('TOUR.ISSUES.VIEW_BTN_DESC', 'Click this button to view the full details of the issue.'),
          side: isDesktop ? 'left' : 'bottom',
          align: 'start',
        },
      }
    ];
  }, [t]);

  return usePageTour('issues', steps);
}
