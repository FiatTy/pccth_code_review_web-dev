import type { Issue } from '@/types/issue';

export interface IssueComment {
  id: string;
  issueId: string;
  userId?: string;
  username: string;
  comment: string;
  createdAt: string;
  parentCommentId?: string;
}

export interface IssueWithComments extends Issue {
  comments: IssueComment[];
}

export interface IssueAnalysis {
  description: string;
  vulnerableCode: string;
  recommendedFix: string;
  recommendedFixByAi?: string | null;
  status?: string | null;
}

export interface AddCommentPayload {
  issueId: string;
  userId: string;
  comment: string;
  parentCommentId?: string;
}
