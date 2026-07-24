import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reportHistory } from '../data/mockData.js';

/*
 * ReportHistory — port of reporthistory.component.html (i18n).
 * Searchable table of generated reports with download action.
 */
const formatIcon = { PDF: 'bi-file-earmark-pdf', Excel: 'bi-file-earmark-excel', Word: 'bi-file-earmark-word', PowerPoint: 'bi-file-earmark-ppt' };

export default function ReportHistory() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = reportHistory.filter((r) => r.project.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1><i className="bi bi-clock-history"></i> {t('REPORT_HISTORY.TITLE')}</h1>
        </div>
        <div className="search-input">
          <i className="bi bi-search"></i>
          <input placeholder={t('REPORT_HISTORY.SEARCH_PLACEHOLDER')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('REPORT_HISTORY.PROJECT')}</th>
                <th>{t('REPORT_HISTORY.DATE_RANGE')}</th>
                <th>{t('REPORT_HISTORY.GENERATED_BY')}</th>
                <th>{t('REPORT_HISTORY.GENERATED_AT')}</th>
                <th>{t('REPORT_HISTORY.FORMAT')}</th>
                <th>{t('REPORT_HISTORY.DOWNLOAD_FILE')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon"><i className="bi bi-folder-x"></i></div><h3>{t('REPORT_HISTORY.NO_REPORTS_FOUND')}</h3></div></td></tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="repo-name">{r.project}</td>
                  <td className="text-muted">{r.from} {t('REPORT_HISTORY.TO')} {r.to}</td>
                  <td>{r.by}</td>
                  <td className="text-muted">{new Date(r.at).toLocaleString()}</td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><i className={'bi ' + formatIcon[r.format]}></i> {r.format}</span></td>
                  <td><button className="btn-icon btn-view"><i className="bi bi-download"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
