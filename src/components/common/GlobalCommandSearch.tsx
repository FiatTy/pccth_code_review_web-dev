import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Bug,
  ChevronRight,
  FileClock,
  FolderGit2,
  type LucideIcon,
  ScanLine,
  Search,
  X,
} from 'lucide-react';
import { useRepositories } from '@/features/repository/hooks/useRepositories';
import { parseGitUrl } from '@/lib/git-utils';

export interface CommandConfig {
  cmd: string;
  aliases: string[];
  route: string;
  queryParam: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const COMMANDS: CommandConfig[] = [
  {
    cmd: '/Repositories',
    aliases: ['/repositories', '/repo', '/repository', '/repos'],
    route: '/repositories',
    queryParam: 'search',
    label: 'Repositories',
    description: 'ค้นหาคลังโค้ด (Repositories)',
    icon: FolderGit2,
  },
  {
    cmd: '/Scan History',
    aliases: ['/scan history', '/scanhistory', '/scan', '/scans'],
    route: '/scanhistory',
    queryParam: 'project',
    label: 'Scan History',
    description: 'ค้นหาประวัติการสแกน (Scan History)',
    icon: ScanLine,
  },
  {
    cmd: '/Issues Management',
    aliases: ['/issues management', '/issues', '/issue', '/bug', '/bugs'],
    route: '/issue',
    queryParam: 'project',
    label: 'Issues Management',
    description: 'ค้นหารายการปัญหา (Issues Management)',
    icon: Bug,
  },
  {
    cmd: '/Report History',
    aliases: ['/report history', '/reporthistory', '/report', '/reports'],
    route: '/reporthistory',
    queryParam: 'search',
    label: 'Report History',
    description: 'ค้นหาประวัติรายงาน (Report History)',
    icon: FileClock,
  },
];

export function GlobalCommandSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: repositories } = useRepositories();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll highlighted item into view when navigating with Arrow Up / Arrow Down
  useEffect(() => {
    if (!isOpen || !optionsContainerRef.current) return;
    const selectedEl = optionsContainerRef.current.querySelector<HTMLElement>('[data-selected="true"]');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen]);

  // Focus shortcut (/ or Cmd+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (e.key === '/' &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA') ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Parse typed text: e.g. "/Report History Charlie Brown01"
  const parsedCommand = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed.startsWith('/')) return null;
    const lower = trimmed.toLowerCase();

    // 1. Strict boundary match: alias equals lower OR lower starts with alias + space
    let bestMatch: { command: CommandConfig; alias: string } | null = null;

    for (const command of COMMANDS) {
      for (const alias of command.aliases) {
        const aliasLower = alias.toLowerCase();
        if (lower === aliasLower || lower.startsWith(aliasLower + ' ')) {
          if (!bestMatch || alias.length > bestMatch.alias.length) {
            bestMatch = { command, alias };
          }
        }
      }
    }

    // 2. Partial prefix match if user is still typing command name (e.g. "/Report H")
    if (!bestMatch) {
      for (const command of COMMANDS) {
        for (const alias of command.aliases) {
          const aliasLower = alias.toLowerCase();
          if (aliasLower.startsWith(lower)) {
            if (!bestMatch || alias.length > bestMatch.alias.length) {
              bestMatch = { command, alias };
            }
          }
        }
      }
    }

    if (!bestMatch) return null;

    const matchedAliasLength = lower.startsWith(bestMatch.alias.toLowerCase() + ' ')
      ? bestMatch.alias.length
      : lower === bestMatch.alias.toLowerCase()
        ? bestMatch.alias.length
        : 0;

    const searchKeyword = matchedAliasLength > 0
      ? trimmed.slice(matchedAliasLength).trim()
      : '';

    return { command: bestMatch.command, searchKeyword };
  }, [query]);

  // Command suggestions
  const matchingCommands = useMemo(() => {
    if (!query) return COMMANDS;

    const lower = query.toLowerCase();
    if (lower.startsWith('/')) {
      return COMMANDS.filter(
        (item) =>
          item.cmd.toLowerCase().includes(lower) ||
          item.aliases.some((alias) => alias.toLowerCase().includes(lower)),
      );
    }

    return COMMANDS.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.cmd.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower),
    );
  }, [query]);

  // Project suggestions matching query
  const matchingProjects = useMemo(() => {
    let searchKeyword = query.trim();
    if (parsedCommand) {
      searchKeyword = parsedCommand.searchKeyword;
    }

    if (!searchKeyword) {
      // If command is active, show available projects to search
      if (parsedCommand) {
        return (repositories ?? []).slice(0, 8);
      }
      return [];
    }
    const lower = searchKeyword.toLowerCase();

    return (repositories ?? [])
      .filter((repo) => {
        const { folder } = parseGitUrl(repo.repositoryUrl);
        return (
          repo.name.toLowerCase().includes(lower) ||
          folder.toLowerCase().includes(lower) ||
          repo.repositoryUrl.toLowerCase().includes(lower)
        );
      })
      .slice(0, 8);
  }, [query, repositories, parsedCommand]);

  // Combined list for keyboard navigation
  const allSuggestions = useMemo(() => {
    const list: {
      type: 'command' | 'project';
      command?: CommandConfig;
      project?: { name: string; folder: string; route: string; queryParam: string };
      key: string;
    }[] = [];

    matchingCommands.forEach((cmd) => {
      list.push({ type: 'command', command: cmd, key: `cmd-${cmd.cmd}` });
    });

    matchingProjects.forEach((repo) => {
      const { folder } = parseGitUrl(repo.repositoryUrl);
      const targetRoute = parsedCommand ? parsedCommand.command.route : '/repositories';
      const targetParam = parsedCommand ? parsedCommand.command.queryParam : 'search';

      list.push({
        type: 'project',
        project: {
          name: repo.name,
          folder,
          route: targetRoute,
          queryParam: targetParam,
        },
        key: `proj-${repo.projectId}`,
      });
    });

    return list;
  }, [matchingCommands, matchingProjects, parsedCommand]);

  function executeSearch(targetRoute?: string, paramName?: string, paramValue?: string) {
    if (parsedCommand) {
      const route = targetRoute || parsedCommand.command.route;
      const param = paramName || parsedCommand.command.queryParam;
      const val = paramValue !== undefined ? paramValue : parsedCommand.searchKeyword;

      const searchUrl = val
        ? `${route}?${param}=${encodeURIComponent(val)}`
        : route;

      setQuery('');
      setIsOpen(false);
      navigate(searchUrl);
      return;
    }

    if (targetRoute) {
      const searchUrl = paramValue
        ? `${targetRoute}?${paramName || 'search'}=${encodeURIComponent(paramValue)}`
        : targetRoute;
      setQuery('');
      setIsOpen(false);
      navigate(searchUrl);
      return;
    }

    if (query.trim()) {
      // Smart route detection based on current page
      const route =
        location.pathname === '/issue'
          ? '/issue'
          : location.pathname === '/scanhistory'
          ? '/scanhistory'
          : location.pathname === '/reporthistory'
          ? '/reporthistory'
          : '/repositories';

      const param =
        location.pathname === '/issue' || location.pathname === '/scanhistory'
          ? 'project'
          : 'search';

      const searchUrl = `${route}?${param}=${encodeURIComponent(query.trim())}`;
      setQuery('');
      setIsOpen(false);
      navigate(searchUrl);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allSuggestions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(0, allSuggestions.length - 1) : prev - 1,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allSuggestions[selectedIndex]) {
        const item = allSuggestions[selectedIndex];
        if (item.type === 'command' && item.command) {
          if (parsedCommand?.command.cmd === item.command.cmd && parsedCommand.searchKeyword) {
            executeSearch(item.command.route, item.command.queryParam, parsedCommand.searchKeyword);
          } else {
            setQuery(`${item.command.cmd} `);
          }
        } else if (item.type === 'project' && item.project) {
          executeSearch(item.project.route, item.project.queryParam, item.project.name);
        }
      } else {
        executeSearch();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Tab' && allSuggestions[selectedIndex]?.type === 'command') {
      e.preventDefault();
      const cmd = allSuggestions[selectedIndex].command;
      if (cmd) {
        setQuery(`${cmd.cmd} `);
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t(
            'NAV.SEARCH_PLACEHOLDER',
            'พิมพ์ / เลือกคำสั่งค้นหา เช่น /Repositories Pcc-Code-Review',
          )}
          className="h-10 w-full rounded-xl border border-border bg-surface-2/60 pl-10 pr-16 text-sm text-fg shadow-2xs outline-none transition-all placeholder:text-faint hover:border-border-strong focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/15"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 text-muted hover:text-fg"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-3 flex h-5 select-none items-center gap-0.5 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-faint shadow-2xs">
            /
          </kbd>
        )}
      </div>

      {isOpen && (
        <div
          ref={optionsContainerRef}
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[28rem] overflow-y-auto rounded-2xl border border-border bg-surface p-2 shadow-xl backdrop-blur-xl transition-all divide-y divide-border/40"
        >
          {parsedCommand ? (
            <div className="p-2 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted px-1">
                <span className="font-medium text-fg">คำสั่งที่เลือก (Selected Command)</span>
                <span className="font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">
                  {parsedCommand.command.cmd}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  executeSearch(
                    parsedCommand.command.route,
                    parsedCommand.command.queryParam,
                    parsedCommand.searchKeyword,
                  )
                }
                className="w-full flex items-center justify-between rounded-xl bg-primary-subtle/80 px-3.5 py-2.5 text-left text-sm font-semibold text-primary hover:bg-primary-subtle transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <parsedCommand.command.icon size={16} className="shrink-0 text-primary" />
                  <span className="truncate">
                    ค้นหาใน {parsedCommand.command.label}:{' '}
                    <strong className="text-fg font-bold">
                      "{parsedCommand.searchKeyword || 'ทั้งหมด (All Projects)'}"
                    </strong>
                  </span>
                </div>
                <ChevronRight size={16} className="shrink-0" />
              </button>

              <div className="rounded-xl bg-surface-2/70 p-3 text-xs text-muted border border-border/50 flex items-start gap-2.5">
                <span className="shrink-0 text-base leading-none">💡</span>
                <div className="space-y-1">
                  <p className="font-medium text-fg">
                    พิมพ์ชื่อโปรเจกต์ต่อท้ายเพื่อค้นหาได้เลย
                  </p>
                  <p className="text-[11px] text-faint flex items-center gap-1.5 flex-wrap">
                    <span>ตัวอย่าง:</span>
                    <code className="inline-block max-w-[240px] truncate align-bottom rounded bg-surface px-1.5 py-0.5 font-mono text-primary border border-border/40" title={`${parsedCommand.command.cmd} Pcc-Code-Review`}>
                      {parsedCommand.command.cmd} Pcc-Code-Review
                    </code>
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {matchingCommands.length > 0 && !parsedCommand ? (
            <div className="py-1">
              <div className="px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-faint">
                คำสั่งการค้นหา (Slash Commands)
              </div>
              {matchingCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const itemIndex = idx;
                const isSelected = selectedIndex === itemIndex;

                return (
                  <button
                    key={cmd.cmd}
                    type="button"
                    data-selected={isSelected ? 'true' : 'false'}
                    onClick={() => {
                      setQuery(`${cmd.cmd} `);
                      inputRef.current?.focus();
                    }}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${isSelected
                        ? 'bg-primary-subtle text-primary font-medium'
                        : 'text-fg hover:bg-surface-2'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2 text-muted">
                        <Icon size={15} />
                      </span>
                      <div className="truncate">
                        <span className="font-semibold text-fg">{cmd.cmd}</span>
                        <span className="ml-2 text-xs text-muted font-normal">
                          {cmd.description}
                        </span>
                      </div>
                    </div>
                    <kbd className="font-mono text-[10px] text-faint">Tab / Click</kbd>
                  </button>
                );
              })}
            </div>
          ) : null}

          {matchingProjects.length > 0 ? (
            <div className="py-1">
              <div className="px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-faint flex items-center justify-between">
                <span>
                  {parsedCommand
                    ? `เลือกโปรเจกต์เพื่อค้นหาใน ${parsedCommand.command.label}`
                    : 'โปรเจกต์ที่พบคายเคียง (Projects)'}
                </span>
                {parsedCommand ? (
                  <span className="text-primary font-normal">คลิกเพื่อค้นหาทันที</span>
                ) : null}
              </div>
              {matchingProjects.map((repo, idx) => {
                const itemIndex = matchingCommands.length + idx;
                const isSelected = selectedIndex === itemIndex;
                const { folder } = parseGitUrl(repo.repositoryUrl);
                const targetRoute = parsedCommand ? parsedCommand.command.route : '/repositories';
                const targetParam = parsedCommand ? parsedCommand.command.queryParam : 'search';

                return (
                  <button
                    key={repo.projectId}
                    type="button"
                    data-selected={isSelected ? 'true' : 'false'}
                    onClick={() => executeSearch(targetRoute, targetParam, repo.name)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${isSelected
                        ? 'bg-primary-subtle text-primary font-medium'
                        : 'text-fg hover:bg-surface-2'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FolderGit2 size={15} />
                      </span>
                      <div className="truncate">
                        <span className="font-semibold text-fg">{repo.name}</span>
                        {folder ? (
                          <span className="ml-2 font-mono text-xs text-muted">
                            📁 {folder}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      {parsedCommand ? `ค้นหาใน ${parsedCommand.command.label}` : 'Repositories'}
                      <ChevronRight size={13} />
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {allSuggestions.length === 0 && !parsedCommand ? (
            <div className="py-6 text-center text-sm text-muted">
              ไม่พบคำสั่งหรือคลังโค้ดที่ตรงกัน ลองพิมพ์ <span className="font-mono font-semibold text-primary">/</span> เพื่อดูคำสั่งทั้งหมด
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
