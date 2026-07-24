/* =====================================================================
   mockData.js — static prototype data.
   Shapes mirror the interfaces used by the original Angular services
   (Repository, Scan, Issue, UserInfo). No backend / API is called here;
   this is a UI prototype only.
   ===================================================================== */

export const currentUser = {
  id: 'u-001',
  username: 'benjawan',
  email: 'benjawanad1996@gmail.com',
  role: 'ADMIN',
  status: 'VERIFIED',
};

export const repositories = [
  {
    projectId: 'p-101',
    name: 'customer-portal-web',
    projectTypeLabel: 'ANGULAR',
    repositoryUrl: 'https://git.pccth.com/team/customer-portal-web',
    status: 'Active',
    qualityGate: 'Passed',
    lastScan: '2026-07-23T14:20:00',
    metrics: { bugs: 3, vulnerabilities: 1, securityHotspots: 2, coverage: 84 },
  },
  {
    projectId: 'p-102',
    name: 'payment-service-api',
    projectTypeLabel: 'SPRING_BOOT',
    repositoryUrl: 'https://git.pccth.com/team/payment-service-api',
    status: 'Active',
    qualityGate: 'Failed',
    lastScan: '2026-07-23T09:05:00',
    metrics: { bugs: 12, vulnerabilities: 5, securityHotspots: 3, coverage: 61 },
  },
  {
    projectId: 'p-103',
    name: 'inventory-dashboard',
    projectTypeLabel: 'ANGULAR',
    repositoryUrl: 'https://git.pccth.com/team/inventory-dashboard',
    status: 'Scanning',
    qualityGate: null,
    lastScan: null,
    metrics: null,
  },
  {
    projectId: 'p-104',
    name: 'notification-worker',
    projectTypeLabel: 'SPRING_BOOT',
    repositoryUrl: 'https://git.pccth.com/team/notification-worker',
    status: 'Error',
    qualityGate: 'Failed',
    lastScan: '2026-07-21T18:40:00',
    metrics: { bugs: 8, vulnerabilities: 2, securityHotspots: 1, coverage: 45 },
  },
  {
    projectId: 'p-105',
    name: 'hr-onboarding-web',
    projectTypeLabel: 'ANGULAR',
    repositoryUrl: 'https://git.pccth.com/team/hr-onboarding-web',
    status: 'Active',
    qualityGate: 'Passed',
    lastScan: '2026-07-22T11:15:00',
    metrics: { bugs: 1, vulnerabilities: 0, securityHotspots: 0, coverage: 92 },
  },
  {
    projectId: 'p-106',
    name: 'reporting-batch-service',
    projectTypeLabel: 'SPRING_BOOT',
    repositoryUrl: 'https://git.pccth.com/team/reporting-batch-service',
    status: 'Active',
    qualityGate: 'Passed',
    lastScan: '2026-07-20T16:30:00',
    metrics: { bugs: 4, vulnerabilities: 1, securityHotspots: 0, coverage: 78 },
  },
];

export const scans = [
  {
    scanId: 's-9001',
    project: { name: 'customer-portal-web', projectType: 'Angular' },
    status: 'SUCCESS',
    qualityGate: 'OK',
    startedAt: '2026-07-23T14:20:00',
    completedAt: '2026-07-23T14:26:00',
    metrics: { bugs: 3, vulnerabilities: 1, securityHotspots: 2, codeSmells: 42, coverage: 84, duplicatedLinesDensity: 2.1 },
  },
  {
    scanId: 's-9002',
    project: { name: 'payment-service-api', projectType: 'Spring Boot' },
    status: 'SUCCESS',
    qualityGate: 'ERROR',
    startedAt: '2026-07-23T09:05:00',
    completedAt: '2026-07-23T09:14:00',
    metrics: { bugs: 12, vulnerabilities: 5, securityHotspots: 3, codeSmells: 130, coverage: 61, duplicatedLinesDensity: 6.8 },
  },
  {
    scanId: 's-9003',
    project: { name: 'inventory-dashboard', projectType: 'Angular' },
    status: 'PENDING',
    qualityGate: null,
    startedAt: '2026-07-24T08:40:00',
    completedAt: null,
    metrics: null,
  },
  {
    scanId: 's-9004',
    project: { name: 'notification-worker', projectType: 'Spring Boot' },
    status: 'FAILED',
    qualityGate: 'ERROR',
    startedAt: '2026-07-21T18:40:00',
    completedAt: '2026-07-21T18:41:00',
    metrics: { bugs: 8, vulnerabilities: 2, securityHotspots: 1, codeSmells: 77, coverage: 45, duplicatedLinesDensity: 9.2 },
  },
  {
    scanId: 's-9005',
    project: { name: 'hr-onboarding-web', projectType: 'Angular' },
    status: 'SUCCESS',
    qualityGate: 'OK',
    startedAt: '2026-07-22T11:15:00',
    completedAt: '2026-07-22T11:20:00',
    metrics: { bugs: 1, vulnerabilities: 0, securityHotspots: 0, codeSmells: 15, coverage: 92, duplicatedLinesDensity: 1.0 },
  },
  {
    scanId: 's-9006',
    project: { name: 'reporting-batch-service', projectType: 'Spring Boot' },
    status: 'SUCCESS',
    qualityGate: 'OK',
    startedAt: '2026-07-20T16:30:00',
    completedAt: '2026-07-20T16:38:00',
    metrics: { bugs: 4, vulnerabilities: 1, securityHotspots: 0, codeSmells: 58, coverage: 78, duplicatedLinesDensity: 3.4 },
  },
];

export const issues = [
  { id: 'i-5001', type: 'BUG', severity: 'CRITICAL', message: 'Null pointer dereference on user session', component: 'src/app/auth/session.service.ts', project: 'customer-portal-web', assignee: 'somchai', status: 'OPEN' },
  { id: 'i-5002', type: 'SECURITY', severity: 'BLOCKER', message: 'SQL injection via unsanitized query parameter', component: 'PaymentRepository.java', project: 'payment-service-api', assignee: null, status: 'OPEN' },
  { id: 'i-5003', type: 'CODE_SMELL', severity: 'MAJOR', message: 'Method has a cognitive complexity of 24 (allowed 15)', component: 'ReportBuilder.java', project: 'reporting-batch-service', assignee: 'nattapong', status: 'IN_PROGRESS' },
  { id: 'i-5004', type: 'BUG', severity: 'MAJOR', message: 'Subscription is never unsubscribed (memory leak)', component: 'src/app/dashboard/dashboard.component.ts', project: 'customer-portal-web', assignee: 'somchai', status: 'RESOLVED' },
  { id: 'i-5005', type: 'SECURITY', severity: 'CRITICAL', message: 'Hard-coded credentials found in configuration', component: 'application.yml', project: 'notification-worker', assignee: null, status: 'OPEN' },
  { id: 'i-5006', type: 'CODE_SMELL', severity: 'MINOR', message: 'Remove this unused import', component: 'src/app/shared/utils.ts', project: 'hr-onboarding-web', assignee: 'pornthip', status: 'CLOSED' },
  { id: 'i-5007', type: 'CODE_SMELL', severity: 'INFO', message: 'String literal duplicated 6 times', component: 'InventoryController.java', project: 'inventory-dashboard', assignee: null, status: 'OPEN' },
  { id: 'i-5008', type: 'SECURITY', severity: 'MAJOR', message: 'Weak cryptographic algorithm (MD5) used', component: 'HashUtil.java', project: 'payment-service-api', assignee: 'nattapong', status: 'IN_PROGRESS' },
];

/* Derived aggregates used by the Dashboard */
export const dashboardSummary = {
  totalScans: scans.length,
  projects: repositories.length,
  bugs: repositories.reduce((s, r) => s + (r.metrics?.bugs || 0), 0),
  security: repositories.reduce((s, r) => s + ((r.metrics?.vulnerabilities || 0) + (r.metrics?.securityHotspots || 0)), 0),
  codeSmells: scans.reduce((s, x) => s + (x.metrics?.codeSmells || 0), 0),
  coverage: Math.round(
    scans.filter((s) => s.metrics).reduce((a, s) => a + s.metrics.coverage, 0) /
      scans.filter((s) => s.metrics).length
  ),
  passed: scans.filter((s) => s.qualityGate === 'OK').length,
  failed: scans.filter((s) => s.status !== 'PENDING' && s.qualityGate !== 'OK').length,
};

export const projectDistribution = [
  { type: 'Angular', count: repositories.filter((r) => r.projectTypeLabel === 'ANGULAR').length, color: '#dd0031' },
  { type: 'Spring Boot', count: repositories.filter((r) => r.projectTypeLabel === 'SPRING_BOOT').length, color: '#6db33f' },
].map((p) => ({ ...p, percent: Math.round((p.count / repositories.length) * 100) }));

export const coverageTrend = [62, 68, 65, 72, 78, 81, 84];

export const users = [
  { id: 'u-001', username: 'benjawan', email: 'benjawanad1996@gmail.com', phone: '0801112222', role: 'ADMIN', status: 'VERIFIED' },
  { id: 'u-002', username: 'somchai', email: 'somchai@pccth.com', phone: '0812223333', role: 'USER', status: 'VERIFIED' },
  { id: 'u-003', username: 'nattapong', email: 'nattapong@pccth.com', phone: '0823334444', role: 'USER', status: 'VERIFIED' },
  { id: 'u-004', username: 'pornthip', email: 'pornthip@pccth.com', phone: '0834445555', role: 'USER', status: 'PENDING_VERIFICATION' },
];

export const assignments = issues
  .filter((i) => i.assignee)
  .map((i) => ({
    assignee: i.assignee,
    issueId: i.id,
    message: i.message,
    severity: i.severity,
    createdAt: '2026-07-2' + (2 + (i.id.charCodeAt(4) % 3)) + 'T10:00:00',
    status: i.status,
  }));

export const reportHistory = [
  { id: 'r-001', project: 'customer-portal-web', from: '2026-07-01', to: '2026-07-23', by: 'benjawan', at: '2026-07-23T15:00:00', format: 'PDF' },
  { id: 'r-002', project: 'payment-service-api', from: '2026-07-01', to: '2026-07-23', by: 'benjawan', at: '2026-07-23T10:20:00', format: 'Excel' },
  { id: 'r-003', project: 'hr-onboarding-web', from: '2026-06-15', to: '2026-07-22', by: 'somchai', at: '2026-07-22T12:10:00', format: 'Word' },
  { id: 'r-004', project: 'reporting-batch-service', from: '2026-06-01', to: '2026-07-20', by: 'nattapong', at: '2026-07-20T17:00:00', format: 'PowerPoint' },
];

export const securityTrend = [12, 10, 11, 8, 7, 6, dashboardSummary.security];

export const notifications = [
  { id: 'n1', type: 'Scans', title: 'Scan completed', message: 'customer-portal-web passed the quality gate.', isRead: false, createdAt: '2026-07-24T08:12:00' },
  { id: 'n2', type: 'Issues', title: 'New critical issue', message: 'SQL injection detected in payment-service-api.', isRead: false, createdAt: '2026-07-24T07:50:00' },
  { id: 'n3', type: 'System', title: 'SonarQube sync', message: 'Configuration synced successfully.', isRead: true, createdAt: '2026-07-23T22:00:00' },
];
