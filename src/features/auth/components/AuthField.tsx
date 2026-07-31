import { AlertCircle, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthFieldProps {
  id: string;
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  autoComplete?: string;
  maxLength?: number;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  trailing?: ReactNode;
  children?: ReactNode;
}

export function AuthField({
  id,
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  maxLength,
  inputMode,
  trailing,
  children,
}: AuthFieldProps) {
  return (
    <div className={error ? 'field-shake' : undefined}>
      <label
        htmlFor={id}
        className={`mb-2 block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
          error ? 'text-danger' : 'text-muted'
        }`}
      >
        {label}
      </label>
      <div className="group relative">
        <Icon
          size={17}
          className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
            error ? 'text-danger' : 'text-faint group-focus-within:text-primary'
          }`}
        />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          aria-invalid={error ? true : undefined}
          className={`h-12 w-full rounded-xl border bg-surface pl-11 text-[15px] text-fg shadow-sm outline-none transition placeholder:text-faint focus:ring-4 ${
            trailing ? 'pr-11' : 'pr-3.5'
          } ${
            error
              ? 'border-danger bg-danger/[0.05] ring-4 ring-danger/10 focus:border-danger focus:ring-danger/25'
              : 'border-border hover:border-border-strong focus:border-primary focus:ring-primary/15'
          }`}
        />
        {trailing}
      </div>
      {error ? (
        <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-danger animate-[scan-log-line_260ms_ease-out_both]">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </p>
      ) : null}
      {children}
    </div>
  );
}
