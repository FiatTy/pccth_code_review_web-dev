import type { ReactNode } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface AuthSubmitButtonProps {
  pending?: boolean;
  showArrow?: boolean;
  children: ReactNode;
}

/**
 * Shared auth submit button — premium running conic border on hover
 * (`.auth-submit`), gradient fill, spinner while pending, optional arrow.
 * Used across every auth form (login / register / forgot / reset).
 */
export function AuthSubmitButton({ pending, showArrow = true, children }: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="auth-submit group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-all hover:shadow-primary/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
    >
      {pending ? (
        <Loader2 size={17} className="animate-spin" />
      ) : (
        <>
          {children}
          {showArrow ? (
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          ) : null}
        </>
      )}
    </button>
  );
}
