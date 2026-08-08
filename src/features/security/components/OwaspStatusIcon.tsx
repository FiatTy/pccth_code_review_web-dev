import { CheckCircle2, TriangleAlert, XCircle } from 'lucide-react';
import type { OwaspCategory } from '@/features/security/types';

const OWASP_TONE: Record<OwaspCategory['status'], string> = {
  pass: 'text-success',
  warning: 'text-warning',
  fail: 'text-danger',
};

export function OwaspStatusIcon({ status }: { status: OwaspCategory['status'] }) {
  if (status === 'pass') return <CheckCircle2 size={14} className={OWASP_TONE.pass} />;
  if (status === 'warning') return <TriangleAlert size={14} className={OWASP_TONE.warning} />;
  return <XCircle size={14} className={OWASP_TONE.fail} />;
}
