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

pages.forEach(p => {
  const filepath = path.join(process.cwd(), 'src/pages', p.file + '.tsx');
  if (!fs.existsSync(filepath)) {
    console.warn(`File not found: ${filepath}`);
    return;
  }

  let code = fs.readFileSync(filepath, 'utf8');

  // Skip if already injected
  if (code.includes(`use${p.name}Tour`)) return;

  // Add import
  const importStatement = `import { use${p.name}Tour } from '@/features/onboarding/hooks/use${p.name}Tour';\n`;
  code = importStatement + code;

  // Find component start
  const compStartRegex = new RegExp(`export function ${p.file}\\s*\\([^)]*\\)\\s*{`);
  const match = code.match(compStartRegex);
  
  if (match) {
    const insertIdx = match.index + match[0].length;
    code = code.slice(0, insertIdx) + `\n  use${p.name}Tour();` + code.slice(insertIdx);
  }

  // Find first return (
  const returnRegex = /return\s*\(\s*<div\b[^>]*>/;
  const retMatch = code.match(returnRegex);
  if (retMatch) {
    const divTag = retMatch[0];
    if (!divTag.includes('id=')) {
      const newDivTag = divTag.replace('<div', `<div id="tour-${p.selector}"`);
      code = code.replace(divTag, newDivTag);
    }
  } else {
    // some pages might return something else like <Fragment> or just <main>
    const retRegex2 = /return\s*\(\s*<([a-zA-Z0-9]+)\b/;
    const m2 = code.match(retRegex2);
    if (m2) {
       const tag = m2[1];
       const tagMatch = m2[0];
       if (tag !== 'Fragment' && tag !== '') {
          const newTag = tagMatch.replace(`<${tag}`, `<${tag} id="tour-${p.selector}"`);
          code = code.replace(tagMatch, newTag);
       }
    }
  }

  fs.writeFileSync(filepath, code);
  console.log(`Injected into ${p.file}.tsx`);
});

