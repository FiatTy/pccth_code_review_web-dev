import { useTranslation } from 'react-i18next';
import { Ban, CircleCheck, Loader2, Pencil, Trash2 } from 'lucide-react';
import { StatusChip } from '@/components/ui/StatusChip';
import { ClientMark } from '@/features/mcp/components/ClientMark';
import { formatDateTime } from '@/lib/format-date';
import { timeAgo } from '@/features/mcp/lib/mcp-access';
import { scopeLabelKey } from '@/features/auth/lib/oauth-consent';
import type { McpClient } from '@/features/mcp/types';

const ICON_BUTTON_CLASS =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-surface-2 hover:text-fg focus:outline-none focus:ring-4 focus:ring-primary/15 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50';

interface RowActions {
  onEdit: (client: McpClient) => void;
  onToggleDisabled: (client: McpClient) => void;
  onDelete: (client: McpClient) => void;
  busyClientId: string | null;
}

function lastUsed(
  iso: string | null,
  locale: string,
  t: (key: string, vars?: Record<string, string>) => string,
) {
  const ago = timeAgo(iso, locale);
  if (!ago) {
    return <span className="text-faint">{t('MCP.NEVER_USED')}</span>;
  }
  return <span className="text-muted">{ago}</span>;
}

function ScopeChips({ scopes }: { scopes: string[] }) {
  const { t } = useTranslation();

  if (scopes.length === 0) {
    return <span className="text-xs text-faint">&mdash;</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {scopes.map((scope) => (
        <span
          key={scope}
          title={t(scopeLabelKey(scope))}
          className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted"
        >
          {scope.replace('codereview:', '')}
        </span>
      ))}
    </div>
  );
}

function Actions({
  client,
  onEdit,
  onToggleDisabled,
  onDelete,
  busyClientId,
}: RowActions & { client: McpClient }) {
  const { t } = useTranslation();
  const isBusy = busyClientId === client.clientId;

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onEdit(client)}
        aria-label={t('MCP.EDIT_APP')}
        title={t('MCP.EDIT_APP')}
        className={ICON_BUTTON_CLASS}
      >
        <Pencil size={14} />
      </button>
      <button
        type="button"
        disabled={isBusy}
        onClick={() => onToggleDisabled(client)}
        aria-label={t(client.disabled ? 'MCP.ENABLE' : 'MCP.DISABLE')}
        title={t(client.disabled ? 'MCP.ENABLE' : 'MCP.DISABLE')}
        className={ICON_BUTTON_CLASS}
      >
        {isBusy ? (
          <Loader2 size={14} className="animate-spin" />
        ) : client.disabled ? (
          <CircleCheck size={14} />
        ) : (
          <Ban size={14} />
        )}
      </button>
      <button
        type="button"
        onClick={() => onDelete(client)}
        aria-label={t('MCP.DELETE_APP')}
        title={t('MCP.DELETE_APP')}
        className={`${ICON_BUTTON_CLASS} hover:border-danger/40 hover:bg-danger/10 hover:text-danger`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function McpClientTable({
  clients,
  ...actions
}: { clients: McpClient[] } & RowActions) {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="space-y-3 sm:hidden">
        {clients.map((client) => (
          <div
            key={client.clientId}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <ClientMark clientName={client.clientName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-fg">
                  {client.clientName}
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-faint">
                  {client.clientId}
                </p>
              </div>
              <StatusChip
                tone={client.disabled ? 'neutral' : 'success'}
                label={t(
                  client.disabled ? 'MCP.STATUS_DISABLED' : 'MCP.STATUS_ACTIVE',
                )}
                dot
              />
            </div>
            <div className="mt-3">
              <ScopeChips scopes={client.scopes} />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted">
              <span>
                {client.selfRegistered
                  ? t('MCP.SOURCE_SELF')
                  : t('MCP.SOURCE_ADMIN')}
                {' · '}
                {lastUsed(client.lastUsedAt, i18n.language, t)}
              </span>
              <Actions client={client} {...actions} />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{t('MCP.TABLE_CAPTION')}</caption>
            <thead>
              <tr className="border-b border-border bg-surface-2/50 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('MCP.APP')}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('MCP.PERMISSIONS')}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('MCP.SOURCE')}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('MCP.REGISTERED')}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('MCP.LAST_USED_COLUMN')}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('MCP.STATUS')}
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  <span className="sr-only">{t('MCP.ACTIONS')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.clientId}
                  className="border-b border-border transition-colors last:border-b-0 hover:bg-surface-2/40"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <ClientMark clientName={client.clientName} size="sm" />
                      <div className="min-w-0">
                        <p className="font-medium text-fg">
                          {client.clientName}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-faint">
                          {client.clientId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <ScopeChips scopes={client.scopes} />
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted">
                    {client.selfRegistered
                      ? t('MCP.SOURCE_SELF')
                      : t('MCP.SOURCE_ADMIN')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted">
                    {formatDateTime(client.registeredAt) ?? '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs">
                    {lastUsed(client.lastUsedAt, i18n.language, t)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusChip
                      tone={client.disabled ? 'neutral' : 'success'}
                      label={t(
                        client.disabled
                          ? 'MCP.STATUS_DISABLED'
                          : 'MCP.STATUS_ACTIVE',
                      )}
                      dot
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <Actions client={client} {...actions} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
