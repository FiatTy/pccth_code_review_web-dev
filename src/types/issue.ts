export interface Issue {
  id: string;
  scanId: string;
  projectId?: string;
  projectName: string;
  issueKey: string;
  type: string;
  severity: string;
  ruleKey?: string;
  component: string;
  line?: number;
  message: string;
  status: string;
  assignedId?: string;
  assignedName?: string;
  createdAt: string;
}

export interface RawIssue {
  id: string;
  scanId: string;
  projectId?: string;
  projectData?: { id?: string; name?: string } | null;
  issueKey: string;
  type?: string;
  severity?: string;
  ruleKey?: string;
  component?: string;
  line?: number;
  message?: string;
  status?: string;
  assignedTo?: { id?: string; username?: string } | null;
  createdAt?: string;
  commentData?: RawComment[] | null;
}

export interface RawComment {
  id?: string;
  issue?: string;
  user?: { id?: string; username?: string } | null;
  comment?: string;
  createdAt?: string;
  parentCommentId?: string;
}
