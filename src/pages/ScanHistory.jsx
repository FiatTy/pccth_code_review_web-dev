import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { scans as allScans, repositories } from '../data/mockData.js';

/*
 * ScanHistory — port of scanhistory.component.html (with i18n).
 * Date-range + status + project filters, a scan table with grade/metrics,
 * log & result actions, pagination, and export/compare/clear actions.
 */
function fmtDate(iso) {
  return iso ? new Date(iso).toLocaleDateString('en-GB') : '-';
}
function fmtHm(iso) {
  return iso ? new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
}

export default function ScanHistory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('ALL');
  const [project, setProject] = useState('All Projects');

  const filtered = allScans.filter((s) => {
    const statusOk = status === 'ALL' || (status === 'SUCCESS' ? s.status === 'SUCCESS' : s.status === 'FAILED');
    const projectOk = project === 'All Projects' || s.project.name === project;
    return statusOk && projectOk;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>{t('SCAN.TITLE')}</h1>
          <p>{t('SCAN.SUBTITLE')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <label>{t('SCAN.RANGE')}</label>
        <input type="date" className="form-control" />
        <span>-</span>
        <input type="date" className="form-control" />
        <label>{t('SCAN.SCAN_STATUS')}</label>
        <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ALL">{t('SCAN.ALL')}</option>
          <option value="SUCCESS">{t('SCAN.STATUS_PASSED')}</option>
          <option value="FAILED">{t('SCAN.STATUS_FAILED')}</option>
        </select>
        <label>{t('SCAN.PROJECT')}</label>
        <select className="form-select" value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="All Projects">{t('SCAN.ALL_PROJECTS')}</option>
          {repositories.map((r) => (
            <option key={r.projectId} value={r.name}>{r.name}</option>
          ))}
        </select>
        <button className="btn btn-outline btn-sm" onClick={() => { setStatus('ALL'); setProject('All Projects'); }}>
          <i className="bi bi-eraser"></i> {t('SCAN.CLEAR_FILTER')}
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>{t('SCAN.COL_DATE_TIME')}</th>
                <th>{t('SCAN.COL_PROJECT')}</th>
                <th>{t('SCAN.COL_GRADE')}</th>
                <th>{t('SCAN.COL_ISSUES')}</th>
                <th>{t('SCAN.COL_LOG')}</th>
                <th>{t('SCAN.COL_RESULT')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon"><i className="bi bi-folder-x"></i></div>
                      <h3>{t('SCAN.NO_SCANS_FOUND')}</h3>
                      <p>{t('SCAN.NO_SCANS_FOUND_DESC')}</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr key={s.scanId}>
                  <td><input type="checkbox" /></td>
                  <td>{fmtDate(s.startedAt)}<br /><span className="text-muted">{fmtHm(s.startedAt)}</span></td>
                  <td>
                    <div className="repo-identity">
                      <div className={'type-icon ' + (s.project.projectType.includes('Angular') ? 'icon-angular' : 'icon-spring')}>
                        <i className={'bi ' + (s.project.projectType.includes('Angular') ? 'bi-code-slash' : 'bi-filetype-java')}></i>
                      </div>
                      <div>
                        <div className="repo-name">{s.project.name}</div>
                        <span className={'status-badge ' + (s.status === 'SUCCESS' ? 'success' : s.status === 'PENDING' ? 'scanning' : 'failed')}>
                          <span className="status-dot" style={{ background: 'currentColor' }}></span>
                          {s.status === 'PENDING' ? t('SCAN.STATUS_SCANNING') : s.status === 'SUCCESS' ? t('SCAN.COMPLETED') : t('SCAN.FAILED')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={'gate-badge ' + (s.status === 'PENDING' ? 'gate-scanning' : s.qualityGate === 'OK' ? 'gate-pass' : 'gate-fail')}>
                      {s.status === 'PENDING' ? t('SCAN.STATUS_SCANNING') : s.qualityGate === 'OK' ? t('SCAN.STATUS_PASSED') : t('SCAN.STATUS_FAILED')}
                    </span>
                  </td>
                  <td>
                    {s.metrics ? (
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.82rem' }}>
                        <span title={t('SCAN.BUGS')}><i className="bi bi-bug-fill" style={{ color: 'var(--metric-bugs)' }}></i> {s.metrics.bugs}</span>
                        <span title={t('SCAN.SECURITY')}><i className="bi bi-shield-fill-exclamation" style={{ color: 'var(--metric-security)' }}></i> {(s.metrics.vulnerabilities || 0) + (s.metrics.securityHotspots || 0)}</span>
                        <span title={t('SCAN.CODE_SMELLS')}><i className="bi bi-code-slash" style={{ color: 'var(--metric-code-smells)' }}></i> {s.metrics.codeSmells}</span>
                        <span title={t('SCAN.COVERAGE')}><i className="bi bi-graph-up" style={{ color: 'var(--metric-coverage)' }}></i> {s.metrics.coverage}%</span>
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td><button className="btn-icon btn-view" title={t('SCAN.VIEW_LOG_TOOLTIP')} onClick={() => navigate('/logviewer/' + s.scanId)}><i className="bi bi-file-text"></i></button></td>
                  <td><button className="btn-icon btn-view" title={t('SCAN.VIEW_RESULT_TOOLTIP')} onClick={() => navigate('/scanresult/' + s.scanId)}><i className="bi bi-eye"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="page-btn" disabled><i className="bi bi-chevron-left"></i></button>
        <span className="text-muted">{t('SCAN.PAGE_INFO', { current: 1, total: 1 })}</span>
        <button className="page-btn" disabled><i className="bi bi-chevron-right"></i></button>
      </div>

      {/* Actions */}
      <div className="actions-row">
        <button className="btn btn-success btn-sm"><i className="bi bi-download"></i> {t('SCAN.EXPORT_HISTORY')}</button>
        <button className="btn btn-info btn-sm"><i className="bi bi-bar-chart"></i> {t('SCAN.COMPARE_SCANS')}</button>
        <button className="btn btn-danger btn-sm"><i className="bi bi-trash"></i> {t('SCAN.CLEAR_OLD_LOGS')}</button>
      </div>
    </div>
  );
}
