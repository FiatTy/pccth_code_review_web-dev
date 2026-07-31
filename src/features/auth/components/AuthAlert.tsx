import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Shared auth error banner — used across every auth form for server-side /
 * generic errors. Matches the premium inline field error styling.
 */
export function AuthAlert({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-3 text-[13px] font-medium text-danger animate-[scan-log-line_260ms_ease-out_both]"
    >
      <AlertCircle size={15} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
