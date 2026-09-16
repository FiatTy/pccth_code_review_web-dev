import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, X } from 'lucide-react';
import { Portal } from '@/components/common/Portal';
import { FIELD_INPUT_CLASS, FormField } from '@/components/common/FormField';
import { scopeLabelKey } from '@/features/auth/lib/oauth-consent';
import {
  MCP_SCOPES,
  emptyDraft,
  hasErrors,
  toRequest,
  validateDraft,
  type ClientDraft,
  type DraftErrors,
} from '@/features/mcp/lib/mcp-client-form';
import type { McpClient, McpClientRequest } from '@/features/mcp/types';

const TEXTAREA_CLASS = FIELD_INPUT_CLASS.replace(
  'h-11',
  'min-h-[5.5rem] py-2.5 leading-relaxed',
);

function draftFrom(client: McpClient | null): ClientDraft {
  if (!client) {
    return emptyDraft();
  }
  return {
    clientName: client.clientName,
    redirectUris: client.redirectUris.join('\n'),
    scopes: [...client.scopes],
  };
}

export function McpClientFormModal({
  client,
  isPending,
  onSubmit,
  onCancel,
}: {
  client: McpClient | null;
  isPending: boolean;
  onSubmit: (payload: McpClientRequest) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ClientDraft>(() => draftFrom(client));
  const [errors, setErrors] = useState<DraftErrors>({});
  const isEditing = client !== null;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const found = validateDraft(draft);
    setErrors(found);
    if (!hasErrors(found)) {
      onSubmit(toRequest(draft));
    }
  }

  function toggleScope(scope: string) {
    setDraft((current) => ({
      ...current,
      scopes: current.scopes.includes(scope)
        ? current.scopes.filter((held) => held !== scope)
        : [...current.scopes, scope],
    }));
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <button
          type="button"
          aria-label={t('COMMON.CLOSE')}
          onClick={onCancel}
          className="absolute inset-0 cursor-default bg-slate-950/60 backdrop-blur-[2px]"
        />
        <form
          onSubmit={submit}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mcp-form-title"
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 id="mcp-form-title" className="text-sm font-semibold text-fg">
              {t(isEditing ? 'MCP.EDIT_APP' : 'MCP.ADD_APP')}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              aria-label={t('COMMON.CLOSE')}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 px-5 py-5">
            <FormField
              id="mcp-client-name"
              label={t('MCP.APP_NAME')}
              error={errors.clientName ? t(errors.clientName) : undefined}
              hint={t('MCP.APP_NAME_HINT')}
            >
              <input
                id="mcp-client-name"
                className={FIELD_INPUT_CLASS}
                value={draft.clientName}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    clientName: event.target.value,
                  }))
                }
                placeholder={t('MCP.APP_NAME_PLACEHOLDER')}
              />
            </FormField>

            <FormField
              id="mcp-redirect-uris"
              label={t('MCP.REDIRECT_URIS')}
              error={errors.redirectUris ? t(errors.redirectUris) : undefined}
              hint={t('MCP.REDIRECT_HINT')}
            >
              <textarea
                id="mcp-redirect-uris"
                rows={3}
                className={TEXTAREA_CLASS}
                value={draft.redirectUris}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    redirectUris: event.target.value,
                  }))
                }
                placeholder={
                  'https://partner.example/callback\nhttp://127.0.0.1:33418/callback'
                }
              />
            </FormField>

            <fieldset>
              <legend className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                {t('MCP.PERMISSIONS')}
              </legend>
              <div className="mt-1.5 space-y-2">
                {MCP_SCOPES.map((scope) => (
                  <label
                    key={scope}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-3.5 py-3 transition-colors hover:border-border-strong hover:bg-surface-2/50"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary,currentColor)]"
                      checked={draft.scopes.includes(scope)}
                      onChange={() => toggleScope(scope)}
                    />
                    <span className="min-w-0">
                      <span className="block font-mono text-xs text-fg">
                        {scope}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {t(scopeLabelKey(scope))}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.scopes ? (
                <p role="alert" className="mt-1.5 text-xs text-danger">
                  {t(errors.scopes)}
                </p>
              ) : null}
            </fieldset>
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {t('COMMON.CANCEL')}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : null}
              {t(isEditing ? 'COMMON.SAVE' : 'MCP.CREATE_APP')}
            </button>
          </div>
        </form>
      </div>
    </Portal>
  );
}
