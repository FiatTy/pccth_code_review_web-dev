import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Search, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

const AUTO_SEARCH_THRESHOLD = 8;

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

/**
 * Themed dropdown that replaces the native `<select>` (whose option list can't
 * be styled). Trigger button + custom popup with hover, selected highlight and
 * a check mark. Closes on outside-click / Escape. Value semantics match a
 * native select: `value` is the selected option value, `onChange` gets it.
 */
export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  id,
  className = '',
  disabled,
  searchable,
  searchPlaceholder,
}: SelectFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((option) => option.value === value);
  const isSearchable = searchable ?? options.length >= AUTO_SEARCH_THRESHOLD;

  useEffect(() => {
    if (!open) {
      return;
    }
    if (isSearchable) {
      setSearchTerm('');
      const timer = window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => window.clearTimeout(timer);
    }
  }, [open, isSearchable]);

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

  const filteredOptions = useMemo(() => {
    if (!isSearchable || !searchTerm.trim()) {
      return options;
    }
    const keyword = searchTerm.trim().toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(keyword) ||
        option.value.toLowerCase().includes(keyword),
    );
  }, [options, isSearchable, searchTerm]);

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && filteredOptions.length > 0) {
      event.preventDefault();
      onChange(filteredOptions[0].value);
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 text-left ${className}`}
      >
        <span className={`truncate ${selected ? 'text-fg' : 'text-faint'}`}>
          {selected ? selected.label : (placeholder ?? '')}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-faint transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && !disabled ? (
        <div
          role="listbox"
          className="dialog-enter absolute left-0 top-full z-50 mt-1.5 flex max-h-72 w-full min-w-[200px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
        >
          {isSearchable ? (
            <div className="sticky top-0 z-10 border-b border-border bg-surface-2/50 p-2">
              <div className="relative flex items-center">
                <Search size={14} className="pointer-events-none absolute left-2.5 text-faint" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder ?? t('COMMON.SEARCH')}
                  className="h-8 w-full rounded-lg border border-border bg-surface pl-8 pr-7 text-xs text-fg placeholder:text-faint outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {searchTerm ? (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 text-faint transition-colors hover:text-fg"
                  >
                    <X size={13} />
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 overscroll-contain">
            {filteredOptions.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-muted">
                {t('COMMON.NO_RESULTS')}
              </p>
            ) : (
              filteredOptions.map((option) => {
                const active = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-fg hover:bg-surface-2'
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {active ? <Check size={15} className="shrink-0 text-primary" /> : null}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
