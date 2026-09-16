import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, KeyRound, TriangleAlert } from 'lucide-react';
import { Portal } from '@/components/common/Portal';
import type { McpClientCreated } from '@/features/mcp/types';

type Field = 'id' | 'secret';

const LABEL_CLASS =
  'font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-faint';

export function McpSecretPanel({
  created,
  onAcknowledge,
}: {
  created: McpClientCreated;
  onAcknowledge: () => void;
}) {
  const { t } = useTranslation();
  const [settled, setSettled] = useState(false);
  const [copied, setCopied] = useState<Field | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const copySecret = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSettled(true);
    copySecret.current?.focus();
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy(field: Field, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyFailed(false);
      setCopied(field);
    } catch {
      setCopyFailed(true);
    }
  }

  function credential(field: Field, label: string, value: string) {
    const isCopied = copied === field;
    return (
      <div>
        <p className={LABEL_CLASS}>{label}</p>
        <div className="mt-1.5 flex items-stretch gap-2">
          <code className="min-w-0 flex-1 select-all break-all rounded-xl border border-border bg-surface-2/60 px-3.5 py-2.5 text-xs leading-relaxed text-fg">
            {value}
          </code>
          <button
            ref={field === 'secret' ? copySecret : undefined}
            type="button"
            onClick={() => copy(field, value)}
            aria-label={t(isCopied ? 'MCP.COPIED' : 'MCP.COPY')}
            className="inline-flex w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 active:scale-[0.97]"
          >
            {isCopied ? (
              <Check size={15} className="text-success" />
            ) : (
              <Copy size={15} />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div
          aria-hidden
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mcp-secret-title"
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
          className={`relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl transition-[opacity,transform] duration-200 motion-reduce:transition-none ${
            settled ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'
          }`}
        >
          <div className="flex items-start gap-3.5 border-b border-border px-5 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/12 text-success">
              <KeyRound size={17} />
            </span>
            <div className="min-w-0">
              <h2
                id="mcp-secret-title"
                className="text-sm font-semibold text-fg"
              >
                {t('MCP.CREATED_TITLE')}
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                {t('MCP.CREATED_SUBTITLE')}
              </p>
            </div>
          </div>

          <div className="space-y-4 px-5 py-5">
            <p
              role="alert"
              className="flex gap-2.5 rounded-xl bg-warning/12 px-3.5 py-3 text-xs leading-relaxed text-warning"
            >
              <TriangleAlert size={15} className="mt-px shrink-0" />
              <span>{t('MCP.SECRET_SHOWN_ONCE')}</span>
            </p>

            {credential('id', t('MCP.CLIENT_ID'), created.clientId)}
            {credential('secret', t('MCP.CLIENT_SECRET'), created.clientSecret)}

            {copyFailed ? (
              <p role="alert" className="text-xs text-danger">
                {t('MCP.COPY_FAILED')}
              </p>
            ) : null}
          </div>

          <div className="border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={onAcknowledge}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover active:scale-[0.99]"
            >
              {t('MCP.SECRET_SAVED')}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
