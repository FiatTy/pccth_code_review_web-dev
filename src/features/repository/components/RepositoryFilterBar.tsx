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

  const hasFolders = availableFolders.length > 0;
  const gridColsClass = hasFolders ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div className="mb-5 flex w-full flex-col gap-2.5 2xl:flex-row 2xl:items-center 2xl:gap-3">
      {/* Group 1: Pills & Search (Row 1 on tablet/laptop) */}
      <div className="flex w-full flex-col gap-2.5 md:flex-row md:items-center 2xl:w-auto 2xl:shrink-0 2xl:gap-3">
        <div className="flex h-10 w-full shrink-0 rounded-xl border border-border bg-surface p-1 shadow-2xs md:w-auto">
          {typeTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTypeTabChange(tab.key)}
              className={`inline-flex h-full flex-1 items-center justify-center whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition-all md:flex-initial md:px-3.5 md:text-sm ${
                typeTab === tab.key
                  ? 'bg-primary-subtle text-primary shadow-2xs'
                  : 'text-muted hover:text-fg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:flex-1 2xl:w-56 2xl:flex-none">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('REPOSITORY.SEARCH_PLACEHOLDER')}
            className="h-10 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm text-fg outline-none transition placeholder:text-faint focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </div>
      </div>

      {/* Group 2: Dropdowns (Row 2 on tablet/laptop) */}
      <div className={`grid w-full grid-cols-1 gap-2.5 ${gridColsClass} 2xl:flex 2xl:w-auto 2xl:flex-1 2xl:items-center 2xl:justify-end 2xl:gap-3`}>
        <SelectField
          value={viewMode}
          onChange={(next) => onViewModeChange(next as RepositoryViewMode)}
          className="h-10 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-fg shadow-2xs outline-none transition hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15 2xl:w-44"
          options={[
            { value: 'grid', label: t('REPOSITORY.ALL_REPOS') },
            { value: 'folder', label: t('REPOSITORY.GROUP_BY_FOLDER') },
          ]}
        />

        {hasFolders ? (
          <SelectField
            value={folderFilter}
            onChange={(next) => onFolderFilterChange(next)}
            className="h-10 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-fg shadow-2xs outline-none transition hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15 2xl:w-40"
            options={[
              { value: 'all', label: `📁 ${t('REPOSITORY.FOLDER_ALL')}` },
              ...availableFolders.map((f) => ({ value: f, label: `📁 ${f}` })),
            ]}
          />
        ) : null}

        <SelectField
          value={statusFilter}
          onChange={(next) => onStatusFilterChange(next as RepositoryStatusFilter)}
          className="h-10 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-fg shadow-2xs outline-none transition hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15 2xl:w-40"
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
