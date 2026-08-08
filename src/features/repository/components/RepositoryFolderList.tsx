import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Folder,
  Loader2,
  Play,
  RotateCw,
  Settings2,
  Trash2,
} from 'lucide-react';
import { formatDateTime } from '@/lib/format-date';
import type { Repository } from '@/features/repository/types';

interface RepositoryFolderListProps {
  groupedByFolder: [string, Repository[]][];
  collapsedFolders: Record<string, boolean>;
  onToggleFolder: (folderName: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  scanningId: string | null;
  onScan: (repo: Repository) => void;
  onDelete: (repo: Repository) => void;
}

export function RepositoryFolderList({
  groupedByFolder,
  collapsedFolders,
  onToggleFolder,
  onExpandAll,
  onCollapseAll,
  scanningId,
  onScan,
  onDelete,
}: RepositoryFolderListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-muted">
          {t('REPOSITORY.GROUP_BY_FOLDER')} ({groupedByFolder.length} {t('REPOSITORY.FOLDER')})
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExpandAll}
            className="text-xs font-medium text-muted hover:text-primary transition-colors"
          >
            {t('REPOSITORY.EXPAND_ALL')}
          </button>
          <span className="text-faint">•</span>
          <button
            type="button"
            onClick={onCollapseAll}
            className="text-xs font-medium text-muted hover:text-primary transition-colors"
          >
            {t('REPOSITORY.COLLAPSE_ALL')}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm divide-y divide-border/60">
        {groupedByFolder.map(([folderName, repos]) => {
          const isCollapsed = collapsedFolders[folderName] !== false;
          const activeCount = repos.filter((r) => r.status === 'Active').length;
          const scanningCount = repos.filter((r) => r.status === 'Scanning').length;
          const errorCount = repos.filter((r) => r.status === 'Error').length;

          return (
            <div key={folderName} className="transition-colors">
              <div
                onClick={() => onToggleFolder(folderName)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleFolder(folderName);
                  }
                }}
                className={`flex cursor-pointer items-center justify-between select-none px-4 py-3.5 transition-colors ${
                  !isCollapsed ? 'bg-surface-2/40' : 'hover:bg-surface-2/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-muted shrink-0 transition-transform">
                    {isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                  </span>
                  <Folder size={17} className="text-muted shrink-0" />
                  <span className="truncate text-sm font-semibold text-fg">{folderName}</span>
                  <span className="text-xs text-muted font-normal shrink-0">
                    {repos.length} {repos.length === 1 ? 'repo' : 'repos'}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  {activeCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-success">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      {activeCount} active
                    </span>
                  )}
                  {scanningCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      {scanningCount} scanning
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-danger">
                      <span className="h-2 w-2 rounded-full bg-danger" />
                      {errorCount} {errorCount === 1 ? 'error' : 'errors'}
                    </span>
                  )}
                </div>
              </div>

              {!isCollapsed && (
                <div className="divide-y divide-border/40 bg-surface-2/20 border-t border-border/40">
                  {repos.map((repo) => {
                    const lastScanTime = formatDateTime(repo.lastScan);
                    const isScanning = repo.status === 'Scanning';
                    const isError = repo.status === 'Error';

                    return (
                      <div
                        key={repo.projectId}
                        className="group flex items-center justify-between gap-3 px-6 py-3 transition-colors hover:bg-surface-2/60"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${
                              repo.status === 'Active'
                                ? 'bg-success'
                                : isScanning
                                  ? 'bg-primary animate-pulse'
                                  : 'bg-danger'
                            }`}
                          />
                          <Link
                            to={`/detailrepo/${repo.projectId}`}
                            className="truncate text-sm font-semibold text-fg hover:text-primary transition-colors"
                          >
                            {repo.name}
                          </Link>
                          {repo.projectTypeLabel ? (
                            <span className="rounded-md border border-border/60 bg-surface-2/40 px-2 py-0.5 font-mono text-[11px] text-muted">
                              {repo.projectTypeLabel}
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            {isError ? (
                              <span className="text-xs font-medium text-danger">
                                Scan failed
                              </span>
                            ) : isScanning ? (
                              <span className="text-xs font-medium text-primary">
                                {t('REPOSITORY.ANALYZING')}
                              </span>
                            ) : (
                              <span className="text-xs text-muted">
                                {lastScanTime ? `Scanned ${lastScanTime}` : t('REPOSITORY.NEVER_SCANNED')}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            {repo.status === 'Active' ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onScan(repo);
                                }}
                                disabled={scanningId === repo.projectId}
                                title={t('REPOSITORY.TOOLTIP_RUN')}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-subtle"
                              >
                                {scanningId === repo.projectId ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Play size={13} />
                                )}
                              </button>
                            ) : null}
                            {repo.status === 'Error' ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onScan(repo);
                                }}
                                disabled={scanningId === repo.projectId}
                                title={t('REPOSITORY.TOOLTIP_RETRY')}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-warning transition-colors hover:bg-warning/15"
                              >
                                {scanningId === repo.projectId ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <RotateCw size={13} />
                                )}
                              </button>
                            ) : null}
                            <Link
                              to={`/detailrepo/${repo.projectId}`}
                              title={t('REPOSITORY.TOOLTIP_VIEW')}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                            >
                              <ExternalLink size={13} />
                            </Link>
                            <Link
                              to={`/settingrepo/${repo.projectId}`}
                              title={t('REPOSITORY.TOOLTIP_SETTINGS')}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                            >
                              <Settings2 size={13} />
                            </Link>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(repo);
                              }}
                              title={t('REPOSITORY.TOOLTIP_DELETE')}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
