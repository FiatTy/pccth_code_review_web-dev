import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyRound, Plug, Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { SkeletonTable } from '@/components/common/Skeleton';
import { SectionCard } from '@/components/ui/SectionCard';
import { useToast } from '@/lib/toast/toast-context';
import { McpClientFormModal } from '@/features/mcp/components/McpClientFormModal';
import { McpClientTable } from '@/features/mcp/components/McpClientTable';
import { McpAccessList } from '@/features/mcp/components/McpAccessList';
import { McpSecretPanel } from '@/features/mcp/components/McpSecretPanel';
import {
  useCreateMcpClient,
  useDeleteMcpClient,
  useMcpClients,
  useSetMcpClientDisabled,
  useUpdateMcpClient,
} from '@/features/mcp/hooks/useMcpClients';
import {
  useMcpAccessGrants,
  useWithdrawAccess,
  useWithdrawEveryGrantOf,
} from '@/features/mcp/hooks/useMcpAccessGrants';
import type {
  McpClient,
  McpClientCreated,
  McpClientRequest,
  McpAccessGrant,
} from '@/features/mcp/types';

type Pending =
  | { kind: 'disable'; client: McpClient }
  | { kind: 'delete'; client: McpClient }
  | { kind: 'withdraw'; grant: McpAccessGrant }
  | { kind: 'withdrawAll'; principalName: string };

type Translate = (key: string, vars?: Record<string, string>) => string;

function confirmMessage(pending: Pending, t: Translate): string {
  if (pending.kind === 'withdrawAll') {
    return t('MCP.CONFIRM_WITHDRAW_ALL_TEXT', { name: pending.principalName });
  }
  if (pending.kind === 'withdraw') {
    return t('MCP.CONFIRM_WITHDRAW_TEXT', {
      name: pending.grant.principalName,
      app: pending.grant.clientName,
    });
  }
  return t(
    pending.kind === 'disable'
      ? 'MCP.CONFIRM_DISABLE_TEXT'
      : 'MCP.CONFIRM_DELETE_TEXT',
    { name: pending.client.clientName },
  );
}

export function McpManagementPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const clients = useMcpClients();
  const grants = useMcpAccessGrants();
  const createClient = useCreateMcpClient();
  const updateClient = useUpdateMcpClient();
  const setDisabled = useSetMcpClientDisabled();
  const deleteClient = useDeleteMcpClient();
  const withdraw = useWithdrawAccess();
  const withdrawAll = useWithdrawEveryGrantOf();

  const [editing, setEditing] = useState<McpClient | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [created, setCreated] = useState<McpClientCreated | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);

  function failed(titleKey: string) {
    showToast({
      tone: 'error',
      title: t(titleKey),
      description: t('MCP.TRY_AGAIN'),
    });
  }

  function cutOffDone(titleKey: string) {
    showToast({
      tone: 'success',
      title: t(titleKey),
      description: t('MCP.TAKES_EFFECT'),
    });
  }

  async function submitForm(payload: McpClientRequest) {
    try {
      if (editing) {
        await updateClient.mutateAsync({ clientId: editing.clientId, payload });
        showToast({ tone: 'success', title: t('MCP.SAVED') });
      } else {
        setCreated(await createClient.mutateAsync(payload));
      }
      setFormOpen(false);
      setEditing(null);
    } catch {
      failed('MCP.SAVE_FAILED');
    }
  }

  async function enable(client: McpClient) {
    try {
      await setDisabled.mutateAsync({
        clientId: client.clientId,
        disabled: false,
      });
      showToast({
        tone: 'success',
        title: t('MCP.ENABLED', { name: client.clientName }),
      });
    } catch {
      failed('MCP.SAVE_FAILED');
    }
  }

  async function confirmPending() {
    if (!pending) {
      return;
    }
    try {
      if (pending.kind === 'disable') {
        await setDisabled.mutateAsync({
          clientId: pending.client.clientId,
          disabled: true,
        });
        cutOffDone(t('MCP.DISABLED', { name: pending.client.clientName }));
      } else if (pending.kind === 'delete') {
        await deleteClient.mutateAsync(pending.client.clientId);
        cutOffDone(t('MCP.DELETED', { name: pending.client.clientName }));
      } else if (pending.kind === 'withdraw') {
        await withdraw.mutateAsync(pending.grant.id);
        cutOffDone(t('MCP.WITHDRAW_DONE'));
      } else {
        await withdrawAll.mutateAsync(pending.principalName);
        cutOffDone(t('MCP.WITHDRAW_ALL_DONE', { name: pending.principalName }));
      }
    } catch {
      failed('MCP.WITHDRAW_FAILED');
    } finally {
      setPending(null);
    }
  }

  const busyClientId =
    setDisabled.isPending && setDisabled.variables
      ? setDisabled.variables.clientId
      : null;

  return (
    <div>
      <PageHeader
        title={t('MCP.TITLE')}
        subtitle={t('MCP.SUBTITLE')}
        actions={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover active:scale-[0.99]"
          >
            <Plus size={16} />
            {t('MCP.ADD_APP')}
          </button>
        }
      />

      <section className="mb-6">
        {clients.isPending ? (
          <SkeletonTable rows={4} columns={5} />
        ) : clients.isError ? (
          <p
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {t('MCP.LOAD_ERROR')}
          </p>
        ) : clients.data && clients.data.length > 0 ? (
          <McpClientTable
            clients={clients.data}
            busyClientId={busyClientId}
            onEdit={(client) => {
              setEditing(client);
              setFormOpen(true);
            }}
            onToggleDisabled={(client) =>
              client.disabled
                ? enable(client)
                : setPending({ kind: 'disable', client })
            }
            onDelete={(client) => setPending({ kind: 'delete', client })}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-muted">
              <Plug size={19} />
            </span>
            <p className="mt-3 text-sm font-medium text-fg">
              {t('MCP.EMPTY_TITLE')}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
              {t('MCP.EMPTY_TEXT')}
            </p>
          </div>
        )}
      </section>

      <SectionCard
        eyebrow={t('MCP.ACCESS_EYEBROW')}
        title={t('MCP.ACCESS_TITLE')}
        description={t('MCP.ACCESS_DESCRIPTION')}
        icon={KeyRound}
      >
        {grants.isPending ? (
          <SkeletonTable rows={2} columns={3} />
        ) : grants.isError ? (
          <p role="alert" className="text-sm text-danger">
            {t('MCP.ACCESS_ERROR')}
          </p>
        ) : grants.data && grants.data.length > 0 ? (
          <McpAccessList
            grants={grants.data}
            clients={clients.data ?? []}
            busyId={withdraw.isPending ? (withdraw.variables ?? null) : null}
            busyPrincipal={
              withdrawAll.isPending ? (withdrawAll.variables ?? null) : null
            }
            onWithdraw={(grant) => setPending({ kind: 'withdraw', grant })}
            onWithdrawEverything={(principalName) =>
              setPending({ kind: 'withdrawAll', principalName })
            }
          />
        ) : (
          <p className="py-2 text-sm text-muted">{t('MCP.NO_ACCESS')}</p>
        )}
      </SectionCard>

      {formOpen ? (
        <McpClientFormModal
          client={editing}
          isPending={createClient.isPending || updateClient.isPending}
          onSubmit={submitForm}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      ) : null}

      {created ? (
        <McpSecretPanel
          created={created}
          onAcknowledge={() => setCreated(null)}
        />
      ) : null}

      {pending ? (
        <ConfirmDialog
          tone="danger"
          isPending={
            setDisabled.isPending ||
            deleteClient.isPending ||
            withdraw.isPending ||
            withdrawAll.isPending
          }
          title={t(
            pending.kind === 'disable'
              ? 'MCP.CONFIRM_DISABLE_TITLE'
              : pending.kind === 'delete'
                ? 'MCP.CONFIRM_DELETE_TITLE'
                : pending.kind === 'withdrawAll'
                  ? 'MCP.CONFIRM_WITHDRAW_ALL_TITLE'
                  : 'MCP.CONFIRM_WITHDRAW_TITLE',
          )}
          message={`${confirmMessage(pending, t)} ${t('MCP.TAKES_EFFECT')}`}
          confirmLabel={t(
            pending.kind === 'disable'
              ? 'MCP.DISABLE'
              : pending.kind === 'delete'
                ? 'COMMON.DELETE'
                : pending.kind === 'withdrawAll'
                  ? 'MCP.WITHDRAW_ALL'
                  : 'MCP.WITHDRAW',
          )}
          onConfirm={confirmPending}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </div>
  );
}
