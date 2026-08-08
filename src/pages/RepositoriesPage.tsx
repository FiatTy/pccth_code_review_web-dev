import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  FolderGit2,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SkeletonCard } from '@/components/common/Skeleton';
import { RepositoryCard } from '@/features/repository/components/RepositoryCard';
import { RepositoryStatsRow } from '@/features/repository/components/RepositoryStatsRow';
import { RepositoryFilterBar } from '@/features/repository/components/RepositoryFilterBar';
import { RepositoryFolderList } from '@/features/repository/components/RepositoryFolderList';
import {
  MissingScanConfigDialog,
  type MissingScanConfigReason,
} from '@/features/repository/components/MissingScanConfigDialog';
import { useToast } from '@/lib/toast/toast-context';
import { useDeleteRepository, useRepositories } from '@/features/repository/hooks/useRepositories';
import { useStartScan } from '@/features/repository/hooks/useRepository';
import { useSonarQubeConfig } from '@/features/setting/hooks/useSonarQubeConfig';
import type {
  Repository,
  RepositoryStatusFilter,
  RepositoryTypeTab,
  RepositoryViewMode,
} from '@/features/repository/types';
import { parseGitUrl } from '@/lib/git-utils';

const SCAN_BRANCH = 'dev';


const VIEW_MODE_KEY = 'codereview_repo_view_mode';

export function RepositoriesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: repositories, isPending, isError, refetch, isFetching } = useRepositories();
  const deleteRepository = useDeleteRepository();
  const configQuery = useSonarQubeConfig();
  const startScan = useStartScan();

  const [typeTab, setTypeTab] = useState<RepositoryTypeTab>('all');
  const [statusFilter, setStatusFilter] = useState<RepositoryStatusFilter>('all');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [viewMode, setViewModeState] = useState<RepositoryViewMode>(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    return saved === 'folder' || saved === 'grid' ? saved : 'grid';
  });

  function setViewMode(mode: RepositoryViewMode) {
    setViewModeState(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  }

  const [searchParams] = useSearchParams();
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState(() => searchParams.get('search') ?? searchParams.get('q') ?? '');
  const [pendingDelete, setPendingDelete] = useState<Repository | null>(null);

  const [lastSearchParams, setLastSearchParams] = useState(searchParams);
  if (searchParams !== lastSearchParams) {
    setLastSearchParams(searchParams);
    const param = searchParams.get('search') ?? searchParams.get('q');
    if (param !== null) {
      setSearch(param);
    }
  }
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [missingConfigKey, setMissingConfigKey] = useState<MissingScanConfigReason | null>(null);

  function toggleFolder(folderName: string) {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderName]: prev[folderName] === false ? true : false,
    }));
  }

  const config = configQuery.data;

  async function handleScan(repo: Repository) {
    if (!config?.authToken?.trim() || !config?.serverUrl?.trim()) {
      setMissingConfigKey('SONAR');
      return;
    }
    const gitToken = config.gitAccessToken?.trim() || null;
    if (!gitToken) {
      setMissingConfigKey('GIT');
      return;
    }

    setScanningId(repo.projectId);
    try {
      await startScan.mutateAsync({
        projectId: repo.projectId,
        branch: SCAN_BRANCH,
        config,
        gitToken,
        serverUrl: config.serverUrl,
      });
      showToast({
        tone: 'success',
        title: t('REPOSITORY.SCAN_STARTED'),
        description: repo.name,
      });
    } catch {
      showToast({
        tone: 'error',
        title: t('REPOSITORY.SCAN_START_FAILED'),
        description: repo.name,
      });
    } finally {
      setScanningId(null);
    }
  }

  const list = useMemo(() => repositories ?? [], [repositories]);

  const stats = useMemo(
    () => ({
      total: list.length,
      active: list.filter((repo) => repo.status === 'Active').length,
      scanning: list.filter((repo) => repo.status === 'Scanning').length,
      error: list.filter((repo) => repo.status === 'Error').length,
    }),
    [list],
  );

  const availableFolders = useMemo(() => {
    const set = new Set<string>();
    for (const repo of list) {
      const folder = parseGitUrl(repo.repositoryUrl).folder;
      if (folder) {
        set.add(folder);
      }
    }
    return Array.from(set).sort();
  }, [list]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return list.filter((repo) => {
      if (typeTab !== 'all' && repo.projectType !== typeTab) {
        return false;
      }
      if (statusFilter !== 'all' && repo.status !== statusFilter) {
        return false;
      }
      if (folderFilter !== 'all') {
        const folder = parseGitUrl(repo.repositoryUrl).folder;
        if (folder !== folderFilter) {
          return false;
        }
      }
      if (query && !`${repo.name} ${repo.repositoryUrl}`.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  }, [list, typeTab, statusFilter, folderFilter, search]);

  const groupedByFolder = useMemo(() => {
    const map = new Map<string, Repository[]>();
    for (const repo of filtered) {
      const folder = parseGitUrl(repo.repositoryUrl).folder;
      if (!map.has(folder)) {
        map.set(folder, []);
      }
      map.get(folder)!.push(repo);
    }
    return Array.from(map.entries());
  }, [filtered]);

  function collapseAll() {
    setCollapsedFolders({});
  }

  function expandAll() {
    const next: Record<string, boolean> = {};
    for (const [folderName] of groupedByFolder) {
      next[folderName] = false;
    }
    setCollapsedFolders(next);
  }

  async function confirmDelete() {
    if (!pendingDelete) {
      return;
    }
    await deleteRepository.mutateAsync(pendingDelete.projectId).catch(() => undefined);
    setPendingDelete(null);
  }

  return (
    <div>
      <PageHeader
        title={t('REPOSITORY.TITLE')}
        subtitle={t('REPOSITORY.SUBTITLE')}
        actions={
          <button
            type="button"
            onClick={() => navigate('/addrepository')}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-sm transition hover:bg-primary-hover active:scale-[0.99]"
          >
            <Plus size={16} />
            {t('REPOSITORY.NEW_REPOSITORY')}
          </button>
        }
      />

      <RepositoryStatsRow stats={stats} />
      <RepositoryFilterBar
        typeTab={typeTab}
        onTypeTabChange={setTypeTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        search={search}
        onSearchChange={setSearch}
        folderFilter={folderFilter}
        onFolderFilterChange={setFolderFilter}
        availableFolders={availableFolders}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isPending ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16 text-center">
          <AlertTriangle size={28} className="text-danger" />
          <p className="mt-3 text-sm text-muted">{t('COMMON.ERROR')}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : undefined} />
            {t('COMMON.RESET')}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-16 text-center">
          <FolderGit2 size={30} className="text-faint" />
          <h3 className="mt-4 text-sm font-semibold text-fg">{t('REPOSITORY.NO_REPOS_FOUND')}</h3>
          <p className="mt-1 max-w-sm text-sm text-muted">{t('REPOSITORY.NO_REPOS_FOUND_DESC')}</p>
        </div>
      ) : viewMode === 'folder' ? (
        <RepositoryFolderList
          groupedByFolder={groupedByFolder}
          collapsedFolders={collapsedFolders}
          onToggleFolder={toggleFolder}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          scanningId={scanningId}
          onScan={(repo) => void handleScan(repo)}
          onDelete={setPendingDelete}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((repo) => (
            <RepositoryCard
              key={repo.projectId}
              repo={repo}
              onDelete={setPendingDelete}
              onScan={(target) => void handleScan(target)}
              isScanPending={scanningId === repo.projectId}
            />
          ))}
        </div>
      )}

      {missingConfigKey ? (
        <MissingScanConfigDialog
          reason={missingConfigKey}
          onClose={() => setMissingConfigKey(null)}
          onGoToConfig={() => navigate('/sonarqubeconfig')}
        />
      ) : null}

      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={t('COMMON.CANCEL')}
            className="absolute inset-0 bg-black/50"
            onClick={() => setPendingDelete(null)}
          />
          <div className="relative w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/12 text-danger">
              <Trash2 size={20} />
            </div>
            <h2 className="mt-4 text-base font-semibold text-fg">
              {t('REPOSITORY.DELETE_CONFIRM.TITLE')}
            </h2>
            <p className="mt-1.5 text-sm text-muted">{t('REPOSITORY.DELETE_CONFIRM.TEXT')}</p>
            <p className="mt-2 truncate text-sm font-medium text-fg">{pendingDelete.name}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
              >
                {t('REPOSITORY.DELETE_CONFIRM.CANCEL')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteRepository.isPending}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-danger px-4 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.99] disabled:opacity-70"
              >
                {deleteRepository.isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  t('REPOSITORY.DELETE_CONFIRM.CONFIRM')
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
