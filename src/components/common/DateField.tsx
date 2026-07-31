import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateFieldProps {
  /** ISO date string `yyyy-mm-dd`, or '' when empty. */
  value: string;
  onChange: (value: string) => void;
  id?: string;
  className?: string;
  placeholder?: string;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseISO(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Custom date picker that localises month / weekday names to the active app
 * language (Thai when TH is selected) while keeping a Gregorian (ค.ศ.) year,
 * so the stored value stays `yyyy-mm-dd` for the backend. Drop-in replacement
 * for `<input type="date">` — Chrome ignores `lang` on native pickers.
 */
export function DateField({ value, onChange, id, className = '', placeholder }: DateFieldProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === 'th' ? 'th' : 'en';

  const [open, setOpen] = useState(false);
  const selected = useMemo(() => parseISO(value), [value]);
  const [viewMonth, setViewMonth] = useState<Date>(() => selected ?? new Date());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setViewMonth(selected ?? new Date());
    }
  }, [open, selected]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handlePointer(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long' }).format(viewMonth);
  const year = viewMonth.getFullYear();

  const weekdays = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    // 2023-01-01 is a Sunday — build Sun..Sat labels.
    return Array.from({ length: 7 }, (_, i) => formatter.format(new Date(2023, 0, 1 + i)));
  }, [locale]);

  const cells = useMemo<(Date | null)[]>(() => {
    const monthIndex = viewMonth.getMonth();
    const startWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const result: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i += 1) {
      result.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      result.push(new Date(year, monthIndex, day));
    }
    return result;
  }, [viewMonth, year]);

  const display = selected
    ? `${pad(selected.getDate())}/${pad(selected.getMonth() + 1)}/${selected.getFullYear()}`
    : '';
  const today = new Date();

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 text-left ${className}`}
      >
        <span className={display ? 'text-fg' : 'text-faint'}>
          {display || placeholder || t('COMMON.DATE_PLACEHOLDER')}
        </span>
        <Calendar size={16} className="shrink-0 text-faint" />
      </button>

      {open ? (
        <div
          role="dialog"
          className="dialog-enter absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-surface p-3 shadow-xl"
        >
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, viewMonth.getMonth() - 1, 1))}
              aria-label="Previous month"
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-fg">
              {monthLabel} {year}
            </span>
            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, viewMonth.getMonth() + 1, 1))}
              aria-label="Next month"
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-0.5">
            {weekdays.map((label, i) => (
              <div key={i} className="py-1 text-center text-[11px] font-medium text-faint">
                {label}
              </div>
            ))}
            {cells.map((date, i) =>
              date ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(toISO(date));
                    setOpen(false);
                  }}
                  className={`h-9 rounded-lg text-sm transition-colors ${
                    selected && sameDay(date, selected)
                      ? 'bg-primary font-semibold text-primary-fg shadow-sm shadow-primary/30'
                      : sameDay(date, today)
                        ? 'font-semibold text-primary ring-1 ring-inset ring-primary/40 hover:bg-surface-2'
                        : 'text-fg hover:bg-surface-2'
                  }`}
                >
                  {date.getDate()}
                </button>
              ) : (
                <div key={i} />
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
