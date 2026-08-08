import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SelectField } from '@/components/common/SelectField';
import type { RepositoryStatusFilter, RepositoryTypeTab, RepositoryViewMode } from '@/features/repository/types';

interface RepositoryFilterBarProps {
  typeTab: RepositoryTypeTab;
  onTypeTabChange: (value: RepositoryTypeTab) => void;
  viewMode: RepositoryViewMode;
  onViewModeChange: (value: RepositoryViewMode) => void;
  search: string;
  onSearchChange: (value: string) => void;
  folderFilter: string;
  onFolderFilterChange: (value: string) => void;
  availableFolders: string[];
  statusFilter: RepositoryStatusFilter;
  onStatusFilterChange: (value: RepositoryStatusFilter) => void;
}

export function RepositoryFilterBar({
  typeTab,
  onTypeTabChange,
  viewMode,
  onViewModeChange,
  search,
  onSearchChange,
  folderFilter,
  onFolderFilterChange,
  availableFolders,
  statusFilter,
  onStatusFilterChange,
}: RepositoryFilterBarProps) {
  const { t } = useTranslation();

  const typeTabs: { key: RepositoryTypeTab; label: string }[] = [
    { key: 'all', label: t('REPOSITORY.TAB_ALL') },
    { key: 'ANGULAR', label: t('REPOSITORY.TAB_ANGULAR') },
    { key: 'SPRING_BOOT', label: t('REPOSITORY.TAB_SPRING') },
  ];

  return (
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
          {typeTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTypeTabChange(tab.key)}
              className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                typeTab === tab.key
                  ? 'bg-primary-subtle text-primary'
                  : 'text-muted hover:text-fg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <SelectField
          value={viewMode}
          onChange={(next) => onViewModeChange(next as RepositoryViewMode)}
          className="h-10 rounded-xl border border-border bg-surface px-3.5 text-sm text-fg shadow-sm outline-none transition hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15 min-w-44"
          options={[
            { value: 'grid', label: t('REPOSITORY.ALL_REPOS') },
            { value: 'folder', label: t('REPOSITORY.GROUP_BY_FOLDER') },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 lg:w-56">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('REPOSITORY.SEARCH_PLACEHOLDER')}
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-fg outline-none transition placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
        </div>
        {availableFolders.length > 0 ? (
          <SelectField
            value={folderFilter}
            onChange={(next) => onFolderFilterChange(next)}
            className="h-10 min-w-36 rounded-lg border border-border bg-surface px-3 text-sm text-fg shadow-sm outline-none transition hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
            options={[
              { value: 'all', label: `📁 ${t('REPOSITORY.FOLDER_ALL')}` },
              ...availableFolders.map((f) => ({ value: f, label: `📁 ${f}` })),
            ]}
          />
        ) : null}
        <SelectField
          value={statusFilter}
          onChange={(next) => onStatusFilterChange(next as RepositoryStatusFilter)}
          className="h-10 min-w-36 rounded-lg border border-border bg-surface px-3 text-sm text-fg shadow-sm outline-none transition hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
          options={[
            { value: 'all', label: t('REPOSITORY.STATUS_ALL') },
            { value: 'Active', label: t('REPOSITORY.STATUS_ACTIVE') },
            { value: 'Scanning', label: t('REPOSITORY.STATUS_SCANNING') },
            { value: 'Error', label: t('REPOSITORY.STATUS_ERROR') },
          ]}
        />
      </div>
    </div>
  );
}
