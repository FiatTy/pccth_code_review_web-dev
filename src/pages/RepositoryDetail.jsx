import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { repositories, issues, scans } from '../data/mockData.js';

/*
 * RepositoryDetail — port of detailrepository.component.html (i18n).
 * Header metrics + Overview / Issues / History tabs.
 */
function securityTotal(m) {
  return m ? (m.vulnerabilities || 0) + (m.securityHotspots || 0) : 0;
}

export default function RepositoryDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const repo = repositories.find((r) => r.projectId === projectId) || repositories[0];
  const [tab, setTab] = useState('overview');

  const repoIssues = issues.filter((i) => i.project === repo.name);
  const repoScans = scans.filter((s) => s.project.name === repo.name);

  const metrics = [
    { key: 'QUALITY_GATE', value: repo.qualityGate || '-', icon: 'bi-shield-check' },
    { key: 'BUGS', value: repo.metrics?.bugs ?? 0, icon: 'bi-bug-fill' },
    { key: 'SECURITY', value: securityTotal(repo.metrics), icon: 'bi-shield-lock-fill' },
    { key: 'COVERAGE', value: (repo.metrics?.coverage ?? 0) + '%', icon: 'bi-graph-up' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-icon" title={t('DETAIL_REPO.BACK_TOOLTIP')} onClick={() => navigate('/repositories')}><i className="bi bi-chevron-left"></i></button>
          <div>
            <h1>{repo.name}</h1>
            <p>{repo.repositoryUrl}</p>
          </div>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/settingrepo/' + repo.projectId)}>
          <i className="bi bi-gear"></i> {t('DETAIL_REPO.SETTINGS')}
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid-4">
        {metrics.map((m) => (
          <div className="stat-card" key={m.key}>
            <div className="stat-icon bg-blue"><i className={'bi ' + m.icon}></i></div>
            <div className="stat-info">
              <h3>{m.value}</h3>
              <span>{t('DETAIL_REPO.' + m.key)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="filter-tabs mt-16">
        {['overview', 'issues', 'history'].map((tk) => (
          <button key={tk} className={'tab-btn' + (tab === tk ? ' active' : '')} onClick={() => setTab(tk)}>
            {t('DETAIL_REPO.TAB_' + tk.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="card mt-16">
        {tab === 'overview' && (
          <div>
            <p><strong>{t('DETAIL_REPO.SONAR_PROJECT_KEY')}:</strong> {repo.name.replace(/-/g, '_')}</p>
            <p><strong>{t('DETAIL_REPO.LAST_ANALYSIS')}:</strong> {repo.lastScan ? new Date(repo.lastScan).toLocaleString() : t('DETAIL_REPO.NO_SCAN_HISTORY')}</p>
            <p><strong>{t('DETAIL_REPO.COST_PER_DAY')}:</strong> 5,000 THB</p>
          </div>
        )}

        {tab === 'issues' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('DETAIL_REPO.COL_TYPE')}</th>
                  <th>{t('DETAIL_REPO.COL_MESSAGE')}</th>
                  <th>{t('DETAIL_REPO.COL_SEVERITY')}</th>
                  <th>{t('DETAIL_REPO.COL_STATUS')}</th>
                  <th>{t('DETAIL_REPO.COL_ASSIGNEE')}</th>
                </tr>
              </thead>
              <tbody>
                {repoIssues.length === 0 && <tr><td colSpan={5}><div className="empty-state"><h3>{t('DETAIL_REPO.NO_ISSUES_FOUND')}</h3></div></td></tr>}
                {repoIssues.map((i) => (
                  <tr key={i.id}>
                    <td>{i.type}</td>
                    <td>{i.message}</td>
                    <td><span className={'severity-badge ' + i.severity.toLowerCase()}>{i.severity}</span></td>
                    <td>{i.status}</td>
                    <td>{i.assignee || <span className="text-muted">{t('DETAIL_REPO.UNASSIGNED')}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'history' && (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('DETAIL_REPO.COL_DATE')}</th>
                  <th>{t('DETAIL_REPO.COL_METRICS')}</th>
                  <th>{t('DETAIL_REPO.QUALITY_GATE')}</th>
                </tr>
              </thead>
              <tbody>
                {repoScans.length === 0 && <tr><td colSpan={3}><div className="empty-state"><h3>{t('DETAIL_REPO.NO_SCAN_HISTORY')}</h3></div></td></tr>}
                {repoScans.map((s) => (
                  <tr key={s.scanId}>
                    <td>{new Date(s.startedAt).toLocaleString()}</td>
                    <td>{s.metrics ? `${s.metrics.bugs} / ${securityTotal(s.metrics)} / ${s.metrics.coverage}%` : '—'}</td>
                    <td>
                      <span className={'gate-badge ' + (s.qualityGate === 'OK' ? 'gate-pass' : 'gate-fail')}>
                        {s.qualityGate === 'OK' ? t('DETAIL_REPO.PASSED') : t('DETAIL_REPO.FAILED')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
