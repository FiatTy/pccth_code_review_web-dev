import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function useSonarQubeConfigTour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-sonar-server',
      popover: {
        title: t('TOUR.SONARQUBECONFIG.SERVER_TITLE', 'Server Configuration'),
        description: t('TOUR.SONARQUBECONFIG.SERVER_DESC', 'Set up your SonarQube server URL and authentication tokens here.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-sonar-git',
      popover: {
        title: t('TOUR.SONARQUBECONFIG.GIT_TITLE', 'Git Connection'),
        description: t('TOUR.SONARQUBECONFIG.GIT_DESC', 'Connect your GitLab account once so scans can clone private repositories.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-sonar-scanner',
      popover: {
        title: t('TOUR.SONARQUBECONFIG.SCANNER_TITLE', 'Scanner Setup'),
        description: t('TOUR.SONARQUBECONFIG.SCANNER_DESC', 'Provide your GitLab or GitHub access token for pulling source code during scans.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-sonar-quality-gate',
      popover: {
        title: t('TOUR.SONARQUBECONFIG.QUALITY_GATE_TITLE', 'Quality Gate Rules'),
        description: t('TOUR.SONARQUBECONFIG.QUALITY_GATE_DESC', 'Define thresholds for code coverage, bugs, and vulnerabilities to pass the quality gate.'),
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#tour-sonar-connection',
      popover: {
        title: t('TOUR.SONARQUBECONFIG.CONNECTION_TITLE', 'Test & Save'),
        description: t('TOUR.SONARQUBECONFIG.CONNECTION_DESC', 'Test your connection status and save the configuration when ready.'),
        side: 'left',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('sonarqubeconfig', steps);
}
