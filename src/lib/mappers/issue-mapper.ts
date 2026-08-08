import type { Issue, RawIssue } from '@/types/issue';

export function mapIssue(raw: RawIssue): Issue {
  return {
    id: raw.id,
    scanId: raw.scanId,
    projectId: raw.projectId ?? raw.projectData?.id,
    projectName: raw.projectData?.name ?? '',
    issueKey: raw.issueKey,
    type: (raw.type ?? '').toUpperCase(),
    severity: (raw.severity ?? '').toUpperCase(),
    ruleKey: raw.ruleKey,
    component: raw.component ?? '',
    line: raw.line,
    message: raw.message ?? '',
    status: (raw.status ?? 'OPEN').toUpperCase().replace(/\s+/g, '_'),
    assignedId: raw.assignedTo?.id,
    assignedName: raw.assignedTo?.username,
    createdAt: raw.createdAt ?? '',
  };
}
