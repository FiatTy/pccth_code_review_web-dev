import { apiClient } from '@/lib/api-client';
import { mapIssue } from '@/lib/mappers/issue-mapper';
import type { Issue, RawComment, RawIssue } from '@/types/issue';
import type {
  AddCommentPayload,
  IssueAnalysis,
  IssueComment,
  IssueWithComments,
} from '@/features/issue/types';

export async function getAllIssues(): Promise<Issue[]> {
  const response = await apiClient.get<RawIssue[]>('/api/issues');
  return (response.data ?? [])
    .map(mapIssue)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface UpdateIssuePayload {
  id: string;
  status?: string | null;
  assignedTo?: string | null;
}

export async function updateIssue(payload: UpdateIssuePayload): Promise<void> {
  await apiClient.post('/api/issues/update', payload);
}

function mapComment(raw: RawComment, issueId: string): IssueComment {
  return {
    id: raw.id ?? '',
    issueId: raw.issue ?? issueId,
    userId: raw.user?.id,
    username: raw.user?.username ?? '',
    comment: raw.comment ?? '',
    createdAt: raw.createdAt ?? '',
    parentCommentId: raw.parentCommentId || undefined,
  };
}

export async function getIssueById(issueId: string): Promise<IssueWithComments> {
  const { data } = await apiClient.get<RawIssue>(`/api/issues/${issueId}`);
  return {
    ...mapIssue(data),
    comments: (data.commentData ?? [])
      .map((comment) => mapComment(comment, data.id))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  };
}

export async function getIssueAnalysis(issueId: string): Promise<IssueAnalysis> {
  const { data } = await apiClient.get<IssueAnalysis>(`/api/issue-details/${issueId}`);
  return data;
}

export async function addIssueComment(payload: AddCommentPayload): Promise<void> {
  await apiClient.post('/api/comments', payload);
}

export async function triggerRecommendFixAi(projectId: string, issueId: string): Promise<void> {
  await apiClient.post('/api/recommend-fix-ai', { projectId, issueId });
}
