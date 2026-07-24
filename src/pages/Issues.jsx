import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { issues as allIssues, repositories } from '../data/mockData.js';

/*
 * Issues — port of issue.component.html (with i18n).
 * Type / severity / status / project filters + search, and a table of
 * issues with type, severity, component, assignee and status columns.
 */
const typeMeta = {
  BUG: { icon: 'bi-bug-fill', color: 'var(--metric-bugs)', key: 'BUG' },
  SECURITY: { icon: 'bi-shield-fill-exclamation', color: 'var(--metric-security)', key: 'SECURITY' },
  CODE_SMELL: { icon: 'bi-wind', color: 'var(--metric-code-smells)', key: 'CODE_SMELL' },
};

export default function Issues() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [type, setType] = useState('All Types');
  const [severity, setSeverity] = useState('All Severity');
  const [status, setStatus] = useState('All Status');
  const [project, setProject] = useState('All Projects');
  const [search, setSearch] = useState('');

  const filtered = allIssues.filter((i) => {
    const typeOk = type === 'All Types' || i.type === type;
    const sevOk = severity === 'All Severity' || i.severity === severity;
    const statusOk = status === 'All Status' || i.status === status;
    const projOk = project === 'All Projects' || i.project === project;
    const searchOk = i.component.toLowerCase().includes(search.toLowerCase()) || i.message.toLowerCase().includes(search.toLowerCase());
    return typeOk && sevOk && statusOk && projOk && searchOk;
  });

  const clear = () => {
    setType('All Types'); setSeverity('All Severity'); setStatus('All Status'); setProject('All Projects'); setSearch('');
  };

  const statusBadge = (s) => {
    const map = { OPEN: 'failed', IN_PROGRESS: 'scanning', RESOLVED: 'success', CLOSED: 'active' };
    const key = { OPEN: 'ISSUE.OPEN', IN_PROGRESS: 'ISSUE.IN_PROGRESS', RESOLVED: 'ISSUE.RESOLVED', CLOSED: 'ISSUE.CLOSED' };
    return <span className={'status-badge ' + map[s]}>{t(key[s])}</span>;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1><i className="bi bi-list-task"></i> {t('ISSUE.TITLE_MGT')}</h1>
          <p>{t('ISSUE.TABLE_CAPTION')}</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/assignment')}>
          <i className="bi bi-person-badge"></i> {t('ISSUE.ASSIGNMENT')}
        </button>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All Types">{t('ISSUE.ALL_TYPES')}</option>
          <option value="BUG">{t('ISSUE.BUG')}</option>
          <option value="SECURITY">{t('ISSUE.SECURITY')}</option>
          <option value="CODE_SMELL">{t('ISSUE.CODE_SMELL')}</option>
        </select>
        <select className="form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="All Severity">{t('ISSUE.ALL_SEVERITY')}</option>
          <option value="BLOCKER">BLOCKER</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="MAJOR">MAJOR</option>
          <option value="MINOR">MINOR</option>
          <option value="INFO">INFO</option>
        </select>
        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All Status">{t('ISSUE.ALL_STATUS')}</option>
          <option value="OPEN">{t('ISSUE.OPEN')}</option>
          <option value="IN_PROGRESS">{t('ISSUE.IN_PROGRESS')}</option>
          <option value="RESOLVED">{t('ISSUE.RESOLVED')}</option>
          <option value="CLOSED">{t('ISSUE.CLOSED')}</option>
        </select>
        <select className="form-select" value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="All Projects">{t('ISSUE.ALL_PROJECTS')}</option>
          {repositories.map((r) => (
            <option key={r.projectId} value={r.name}>{r.name}</option>
          ))}
        </select>
        <div className="search-input">
          <i className="bi bi-search"></i>
          <input placeholder={t('ISSUE.SEARCH_PLACEHOLDER')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-outline btn-sm" onClick={clear}>{t('ISSUE.CLEAR')}</button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}><input type="checkbox" /></th>
                <th>{t('ISSUE.COL_TYPE')}</th>
                <th>{t('ISSUE.COL_SEVERITY')}</th>
                <th>{t('ISSUE.COL_ISSUE')}</th>
                <th>{t('ISSUE.COL_COMPONENT')}</th>
                <th>{t('ISSUE.COL_PROJECT')}</th>
                <th>{t('ISSUE.COL_ASSIGNED')}</th>
                <th>{t('ISSUE.COL_STATUS')}</th>
                <th>{t('ISSUE.COL_VIEW')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <div className="empty-state">
                      <div className="empty-icon"><i className="bi bi-check2-circle"></i></div>
                      <h3>{t('ISSUE.NO_ISSUES_FOUND')}</h3>
                      <p>{t('ISSUE.NO_ISSUES_FOUND_DESC')}</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((i) => {
                const meta = typeMeta[i.type];
                return (
                  <tr key={i.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <i className={'bi ' + meta.icon} style={{ color: meta.color }}></i> {t('ISSUE.' + meta.key)}
                      </span>
                    </td>
                    <td><span className={'severity-badge ' + i.severity.toLowerCase()}>{i.severity}</span></td>
                    <td>{i.message}</td>
                    <td className="text-muted"><code>{i.component}</code></td>
                    <td>{i.project}</td>
                    <td>{i.assignee ? i.assignee : <span className="text-muted">{t('ISSUE.UNASSIGNED')}</span>}</td>
                    <td>{statusBadge(i.status)}</td>
                    <td><button className="btn-icon btn-view" onClick={() => navigate('/issuedetail/' + i.id)}><i className="bi bi-eye"></i></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
