import fs from 'node:fs';
import path from 'node:path';

const pages = [
  { name: 'Repositories', file: 'RepositoriesPage', selector: 'repo-header' },
  { name: 'ScanHistory', file: 'ScanHistoryPage', selector: 'scan-header' },
  { name: 'Issues', file: 'IssuesPage', selector: 'issue-header' },
  { name: 'Assignments', file: 'AssignmentsPage', selector: 'assignment-header' },
  { name: 'Analysis', file: 'AnalysisPage', selector: 'analysis-header' },
  { name: 'SecurityDashboard', file: 'SecurityDashboardPage', selector: 'security-header' },
  { name: 'TechnicalDebt', file: 'TechnicalDebtPage', selector: 'techdebt-header' },
  { name: 'GenerateReport', file: 'GenerateReportPage', selector: 'genreport-header' },
  { name: 'ReportHistory', file: 'ReportHistoryPage', selector: 'reporthistory-header' },
  { name: 'SonarQubeConfig', file: 'SonarQubeConfigPage', selector: 'sonar-header' },
  { name: 'NotificationSettings', file: 'NotificationSettingsPage', selector: 'notification-header' },
  { name: 'UserManagement', file: 'UserManagementPage', selector: 'user-header' }
];

const hooksDir = path.join(process.cwd(), 'src/features/onboarding/hooks');
if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

pages.forEach(p => {
  const content = `import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTour } from './usePageTour';
import type { DriveStep } from 'driver.js';

export function use${p.name}Tour() {
  const { t } = useTranslation();
  
  const steps: DriveStep[] = useMemo(() => [
    {
      element: '#tour-${p.selector}',
      popover: {
        title: t('TOUR.${p.name.toUpperCase()}.HEADER_TITLE', '${p.name} Overview'),
        description: t('TOUR.${p.name.toUpperCase()}.HEADER_DESC', 'This page allows you to view and manage ${p.name.toLowerCase()}.'),
        side: 'bottom',
        align: 'start',
      },
    }
  ], [t]);

  return usePageTour('${p.name.toLowerCase()}', steps);
}
`;
  fs.writeFileSync(path.join(hooksDir, `use${p.name}Tour.ts`), content);
});

console.log('Hooks generated successfully.');
