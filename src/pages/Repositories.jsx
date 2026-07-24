import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { repositories as allRepos } from '../data/mockData.js';

/*
 * Repositories — port of repositories.component.html (with i18n).
 * Summary stats, type filter tabs, search + status filter, and a grid of
 * repository cards with metrics / scanning state / action buttons.
 */
function securityTotal(m) {
  if (!m) return 0;
  return (m.vulnerabilities || 0) + (m.securityHotspots || 0);
}

export default function Repositories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const stats = [
    { key: 'STATS_TOTAL', count: allRepos.length, icon: 'bi bi-folder-fill', bg: 'bg-blue' },
    { key: 'STATS_ACTIVE', count: allRepos.filter((r) => r.status === 'Active').length, icon: 'bi bi-check-circle-fill', bg: 'bg-green' },
    { key: 'STATS_SCANNING', count: allRepos.filter((r) => r.status === 'Scanning').length, icon: 'bi bi-arrow-repeat', bg: 'bg-orange' },
    { key: 'STATS_ERROR', count: allRepos.filter((r) => r.status === 'Error').length, icon: 'bi bi-exclamation-octagon-fill', bg: 'bg-red' },
  ];

  const countByType = (ty) => allRepos.filter((r) => r.projectTypeLabel === ty).length;

  const filtered = allRepos.filter((r) => {
    const typeOk = filter === 'all' || r.projectTypeLabel === filter;
    const statusOk = status === 'all' || r.status === status;
    const searchOk = r.name.toLowerCase().includes(search.toLowerCase());
    return typeOk && statusOk && searchOk;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>{t('REPOSITORY.TITLE')}</h1>
          <p>{t('REPOSITORY.SUBTITLE')}</p>
        </div>
        <button className="btn btn-primary-gradient" onClick={() => navigate('/addrepository')}>
          <i className="bi bi-plus-lg"></i> {t('REPOSITORY.NEW_REPOSITORY')}
        </button>
      </div>

      {/* Summary stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.key}>
            <div className={'stat-icon ' + s.bg}><i className={s.icon}></i></div>
            <div className="stat-info">
              <h3>{s.count}</h3>
              <span>{t('REPOSITORY.' + s.key)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar-container">
        <div className="filter-tabs">
          <button className={'tab-btn' + (filter === 'all' ? ' active' : '')} onClick={() => setFilter('all')}>
            {t('REPOSITORY.TAB_ALL')} <span className="badge-count">{allRepos.length}</span>
          </button>
          <button className={'tab-btn' + (filter === 'ANGULAR' ? ' active' : '')} onClick={() => setFilter('ANGULAR')}>
            {t('REPOSITORY.TAB_ANGULAR')} <span className="badge-count">{countByType('ANGULAR')}</span>
          </button>
          <button className={'tab-btn' + (filter === 'SPRING_BOOT' ? ' active' : '')} onClick={() => setFilter('SPRING_BOOT')}>
            {t('REPOSITORY.TAB_SPRING')} <span className="badge-count">{countByType('SPRING_BOOT')}</span>
          </button>
        </div>
        <div className="search-actions">
          <div className="search-input">
            <i className="bi bi-search"></i>
            <input placeholder={t('REPOSITORY.SEARCH_PLACEHOLDER')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">{t('REPOSITORY.STATUS_ALL')}</option>
            <option value="Active">{t('REPOSITORY.STATUS_ACTIVE')}</option>
            <option value="Scanning">{t('REPOSITORY.STATUS_SCANNING')}</option>
            <option value="Error">{t('REPOSITORY.STATUS_ERROR')}</option>
          </select>
        </div>
      </div>

      {/* Repo grid */}
      <div className="repo-grid">
        {filtered.map((repo) => (
          <div className="repo-card" key={repo.projectId}>
            <div className="card-header-row">
              <div className="repo-identity">
                <div className={'type-icon ' + (repo.projectTypeLabel === 'ANGULAR' ? 'icon-angular' : 'icon-spring')}>
                  <i className={'bi ' + (repo.projectTypeLabel === 'ANGULAR' ? 'bi-code-slash' : 'bi-filetype-java')}></i>
                </div>
                <div>
                  <h4 className="repo-name">{repo.name}</h4>
                  <div className="repo-meta">
                    <span className={repo.projectTypeLabel === 'ANGULAR' ? 'text-angular' : 'text-spring'}>{repo.projectTypeLabel}</span>
                    <a href={repo.repositoryUrl} target="_blank" rel="noreferrer" className="repo-url">
                      <i className="bi bi-link-45deg"></i> {t('REPOSITORY.LINK')}
                    </a>
                  </div>
                </div>
              </div>
              <span className={'status-dot status-' + repo.status.toLowerCase()} title={repo.status}></span>
            </div>

            <div>
              {repo.status === 'Scanning' ? (
                <div className="scanning-state">
                  <div className="progress-bar-wrapper"><div className="progress-bar-animated"></div></div>
                  <span className="scanning-label"><i className="bi bi-arrow-repeat spin"></i> {t('REPOSITORY.ANALYZING')}</span>
                </div>
              ) : (
                <>
                  <div className="metrics-row">
                    <div className="metric-item" title={t('REPOSITORY.BUGS')}>
                      <i className="bi bi-bug" style={{ color: 'var(--metric-bugs)' }}></i>
                      <span className="metric-value">{repo.metrics?.bugs || 0}</span>
                      <span className="metric-label">{t('REPOSITORY.BUGS')}</span>
                    </div>
                    <div className="metric-item" title={t('REPOSITORY.SECURITY')}>
                      <i className="bi bi-shield-exclamation" style={{ color: 'var(--metric-security)' }}></i>
                      <span className="metric-value">{securityTotal(repo.metrics)}</span>
                      <span className="metric-label">{t('REPOSITORY.SECURITY')}</span>
                    </div>
                    <div className="metric-item" title={t('REPOSITORY.COVERAGE')}>
                      <i className="bi bi-graph-up" style={{ color: 'var(--metric-coverage)' }}></i>
                      <span className="metric-value">{repo.metrics?.coverage || 0}%</span>
                      <span className="metric-label">{t('REPOSITORY.COVERAGE')}</span>
                    </div>
                    {repo.qualityGate && (
                      <div className="metric-item quality-gate">
                        <span className={'gate-badge ' + (repo.qualityGate === 'Passed' ? 'gate-pass' : 'gate-fail')}>
                          {repo.qualityGate === 'Passed' ? t('REPOSITORY.PASSED') : t('REPOSITORY.FAILED')}
                        </span>
                        <span className="metric-label">{t('REPOSITORY.QUALITY_GATE')}</span>
                      </div>
                    )}
                  </div>
                  <div className="last-updated" style={{ marginTop: 10 }}>
                    <i className="bi bi-clock"></i>{' '}
                    {repo.lastScan ? new Date(repo.lastScan).toLocaleString() : t('REPOSITORY.NEVER_SCANNED')}
                  </div>
                </>
              )}
            </div>

            <div className="card-footer-row">
              <div className="action-buttons">
                {repo.status === 'Active' && (
                  <button className="btn-icon btn-run" title={t('REPOSITORY.TOOLTIP_RUN')}><i className="bi bi-play-fill"></i></button>
                )}
                {repo.status === 'Error' && (
                  <button className="btn-icon btn-resume" title={t('REPOSITORY.TOOLTIP_RETRY')}><i className="bi bi-arrow-clockwise"></i></button>
                )}
                {repo.status !== 'Scanning' && (
                  <>
                    <button className="btn-icon btn-view" title={t('REPOSITORY.TOOLTIP_VIEW')} onClick={() => navigate('/detailrepo/' + repo.projectId)}><i className="bi bi-eye"></i></button>
                    <button className="btn-icon btn-edit" title={t('REPOSITORY.TOOLTIP_SETTINGS')} onClick={() => navigate('/settingrepo/' + repo.projectId)}><i className="bi bi-gear"></i></button>
                    <button className="btn-icon btn-delete" title={t('REPOSITORY.TOOLTIP_DELETE')}><i className="bi bi-trash"></i></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><i className="bi bi-folder-x"></i></div>
          <h3>{t('REPOSITORY.NO_REPOS_FOUND')}</h3>
          <p>{t('REPOSITORY.NO_REPOS_FOUND_DESC')}</p>
        </div>
      )}
    </div>
  );
}
