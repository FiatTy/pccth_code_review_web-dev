import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  Loader2,
  ShieldCheck,
  Unplug,
  UserRound,
} from 'lucide-react';
import { StatusChip } from '@/components/ui/StatusChip';
import { ClientMark } from '@/features/mcp/components/ClientMark';
import { formatDateTime } from '@/lib/format-date';
import { scopeLabelKey } from '@/features/auth/lib/oauth-consent';
import { groupByPerson } from '@/features/mcp/lib/group-by-person';
import { isTokenLive, timeAgo } from '@/features/mcp/lib/mcp-access';
import type { McpAccessGrant, McpClient } from '@/features/mcp/types';

type Tab = 'details' | 'permissions';

const LABEL_CLASS =
  'font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-faint';

const WITHDRAW_CLASS =
  'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger focus:outline-none focus:ring-4 focus:ring-primary/15 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50';

const TABS = [
  ['details', UserRound, 'MCP.TAB_DETAILS'],
  ['permissions', ShieldCheck, 'MCP.TAB_PERMISSIONS'],
] as const;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className={LABEL_CLASS}>{label}</p>
      <div className="mt-1 truncate text-sm text-fg">{children}</div>
    </div>
  );
}

export function McpAccessList({
  grants,
  clients,
  busyId,
  busyPrincipal,
  onWithdraw,
  onWithdrawEverything,
}: {
  grants: McpAccessGrant[];
  clients: McpClient[];
  busyId: string | null;
  busyPrincipal: string | null;
  onWithdraw: (grant: McpAccessGrant) => void;
  onWithdrawEverything: (principalName: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const [opened, setOpened] = useState<string[]>([]);
  const [tabs, setTabs] = useState<Record<string, Tab>>({});

  const byClientId = new Map(
    clients.map((client) => [client.clientId, client]),
  );
  const people = groupByPerson(grants);

  function toggle(principalName: string) {
    setOpened((current) =>
      current.includes(principalName)
        ? current.filter((held) => held !== principalName)
        : [...current, principalName],
    );
  }

  return (
    <ul className="space-y-4">
      {people.map((person) => {
        const isOpen = opened.includes(person.principalName);
        const tab = tabs[person.principalName] ?? 'details';
        const used = timeAgo(person.lastUsedAt, i18n.language);
        const panelId = `mcp-access-${person.principalName}`;
        const scopes = [
          ...new Set(
            person.grants.flatMap(
              (grant) => byClientId.get(grant.clientId)?.scopes ?? [],
            ),
          ),
        ];

        return (
          <li
            key={person.principalName}
            className="overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="flex flex-wrap items-center gap-3 px-5 py-4">
              <button
                type="button"
                onClick={() => toggle(person.principalName)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex min-w-0 flex-1 items-center gap-3.5 rounded-lg text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold uppercase text-primary">
                  {person.principalName.slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.95rem] font-semibold text-fg">
                      {person.principalName}
                    </span>
                    <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      {t('MCP.APP_COUNT', {
                        total: String(person.grants.length),
                      })}
                    </span>
                    {person.inUse > 0 ? (
                      <StatusChip
                        tone="success"
                        label={t('MCP.IN_USE')}
                        dot
                        pulse
                      />
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {used
                      ? t('MCP.LAST_USED', { ago: used })
                      : t('MCP.NEVER_USED')}
                  </span>
                </span>
              </button>

              <button
                type="button"
                disabled={busyPrincipal === person.principalName}
                onClick={() => onWithdrawEverything(person.principalName)}
                className={WITHDRAW_CLASS}
              >
                {busyPrincipal === person.principalName ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Unplug size={13} />
                )}
                {t('MCP.WITHDRAW_ALL')}
              </button>

              <button
                type="button"
                onClick={() => toggle(person.principalName)}
                aria-hidden
                tabIndex={-1}
                className="rounded-lg p-1.5 text-faint transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <ChevronDown
                  size={16}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                  className={`transition-transform duration-200 motion-reduce:transition-none ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            <div
              id={panelId}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
              }}
              className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex gap-1 border-t border-border px-5">
                  {TABS.map(([name, Icon, labelKey]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        setTabs((current) => ({
                          ...current,
                          [person.principalName]: name,
                        }))
                      }
                      className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm transition-colors ${
                        tab === name
                          ? 'border-primary font-medium text-primary'
                          : 'border-transparent text-muted hover:text-fg'
                      }`}
                    >
                      <Icon size={15} />
                      {t(labelKey)}
                    </button>
                  ))}
                </div>

                <div className="border-t border-border px-5 py-5">
                  {tab === 'details' ? (
                    <div className="space-y-4">
                      {person.grants.map((grant) => {
                        const client = byClientId.get(grant.clientId);
                        const inUse = isTokenLive(grant.accessTokenExpiresAt);
                        const grantUsed = timeAgo(
                          grant.lastUsedAt,
                          i18n.language,
                        );

                        return (
                          <div
                            key={grant.id}
                            className="rounded-xl border border-border bg-surface-2/40 px-5 py-4"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <ClientMark clientName={grant.clientName} />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-fg">
                                    {grant.clientName}
                                  </p>
                                  <StatusChip
                                    tone={inUse ? 'success' : 'neutral'}
                                    label={t(inUse ? 'MCP.IN_USE' : 'MCP.IDLE')}
                                    dot
                                  />
                                </div>
                                <p className="mt-0.5 text-xs text-muted">
                                  {t('MCP.ALLOWED_BY', {
                                    name: person.principalName,
                                  })}
                                </p>
                              </div>
                              <button
                                type="button"
                                disabled={busyId === grant.id}
                                onClick={() => onWithdraw(grant)}
                                className={WITHDRAW_CLASS}
                              >
                                {busyId === grant.id ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Unplug size={13} />
                                )}
                                {t('MCP.WITHDRAW')}
                              </button>
                            </div>

                            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-border/70 pt-4 sm:grid-cols-2">
                              <Field label={t('MCP.CLIENT_ID')}>
                                <span className="font-mono text-xs">
                                  {grant.clientId}
                                </span>
                              </Field>
                              <Field label={t('MCP.PERMISSIONS')}>
                                <span className="flex flex-wrap gap-1.5">
                                  {(client?.scopes ?? []).map((scope) => (
                                    <span
                                      key={scope}
                                      className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted"
                                    >
                                      {scope.replace('codereview:', '')}
                                    </span>
                                  ))}
                                </span>
                              </Field>
                              <Field label={t('MCP.SOURCE')}>
                                {client?.selfRegistered
                                  ? t('MCP.SOURCE_SELF')
                                  : t('MCP.SOURCE_ADMIN')}
                              </Field>
                              <Field label={t('MCP.REGISTERED')}>
                                {formatDateTime(client?.registeredAt) ?? '—'}
                              </Field>
                              <Field label={t('MCP.LAST_USED_COLUMN')}>
                                {grantUsed ?? t('MCP.NEVER_USED')}
                              </Field>
                              <Field label={t('MCP.UNTIL_LABEL')}>
                                {formatDateTime(grant.accessUntil) ?? '—'}
                              </Field>
                            </dl>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {scopes.map((scope) => (
                        <li key={scope} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-success/12 text-success">
                            <ShieldCheck size={14} />
                          </span>
                          <div className="min-w-0">
                            <p className="font-mono text-xs text-fg">{scope}</p>
                            <p className="mt-0.5 text-xs text-muted">
                              {t(scopeLabelKey(scope))}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
